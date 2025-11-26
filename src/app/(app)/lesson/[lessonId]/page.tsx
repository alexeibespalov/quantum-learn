"use client";

import { use, useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { findLessonById } from "@/lib/firebase/courses";
import { useProgress } from "@/hooks/useProgress";
import { VideoPlayer } from "@/components/lesson/VideoPlayer";
import { EmbeddedQuestionModal } from "@/components/lesson/EmbeddedQuestion";
import { TranscriptPanel } from "@/components/lesson/TranscriptPanel";
import { ComprehensionQuiz } from "@/components/lesson/ComprehensionQuiz";
import { MarkdownRenderer } from "@/components/lesson/MarkdownRenderer";
import { DualCodedLayout } from "@/components/lesson/DualCodedLayout";
import { InteractiveDiagram } from "@/components/lesson/InteractiveDiagram";
import { SectionNav } from "@/components/lesson/SectionNav";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Lesson, VideoContent, TextContent } from "@/types/course";

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default function LessonPage({ params }: PageProps) {
  const { lessonId } = use(params);
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { progress, updateProgress, completeLesson, savePosition, getResumePosition } = useProgress({
    courseId: courseId || "",
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadLesson();
  }, [user, lessonId]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await findLessonById(lessonId);

      if (!result) {
        setError(new Error("Lesson not found"));
        return;
      }

      setLesson(result.lesson);
      setCourseId(result.courseId);

      // Set active section for text lessons
      if (result.lesson.type === "text") {
        const textContent = result.lesson.content as TextContent;
        if (textContent.sections.length > 0) {
          setActiveSectionId(textContent.sections[0].id);
        }
      }

      // Load resume position for video lessons
      if (user && result.courseId && result.lesson.type === "video") {
        const resumePosition = await getResumePosition(lessonId);
        setCurrentTime(resumePosition);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load lesson"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!lesson || lesson.type !== "video") return;

    const videoContent = lesson.content as VideoContent;
    const nextQuestion = lesson.embeddedQuestions.find(
      (q) => currentTime >= q.timestamp - 1 && currentTime < q.timestamp + 1
    );

    if (nextQuestion && !isPaused) {
      setActiveQuestion(nextQuestion.id);
      setIsPaused(true);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [currentTime, lesson, isPaused]);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    if (user && courseId) {
      savePosition(lessonId, time);
    }
  };

  const handleQuestionSubmit = (answer: string | number) => {
    setIsPaused(false);
    setActiveQuestion(null);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleQuizComplete = async (score: number, totalPoints: number) => {
    if (user && courseId) {
      const percentage = Math.round((score / totalPoints) * 100);
      await completeLesson(lessonId, percentage);
    }
    setShowQuiz(false);
  };

  const handleVideoEnd = () => {
    if (lesson && lesson.comprehensionCheck.length > 0) {
      setShowQuiz(true);
    } else if (user && courseId) {
      completeLesson(lessonId, 100);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-red-600">Error: {error?.message || "Lesson not found"}</p>
          <Link href="/subjects">
            <Button className="mt-4">Back to Subjects</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Render text lesson
  if (lesson.type === "text") {
    const textContent = lesson.content as TextContent;
    const activeSection = textContent.sections.find((s) => s.id === activeSectionId);

    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/subjects"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Subjects
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
          <p className="text-gray-600 mt-2">{lesson.description}</p>
        </div>

        {/* Text Lesson Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {textContent.sections.map((section) => (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className="mb-8 scroll-mt-4"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                {textContent.visuals
                  ?.filter((v) => v.sectionId === section.id)
                  .map((visual) => {
                    if (visual.type === "diagram" && visual.hotspots) {
                      return (
                        <DualCodedLayout
                          key={visual.id}
                          leftContent={<MarkdownRenderer content={section.content} />}
                          rightContent={
                            <InteractiveDiagram
                              imageUrl={visual.url}
                              caption={visual.caption}
                              hotspots={visual.hotspots}
                            />
                          }
                          className="mb-6"
                        />
                      );
                    }
                    return (
                      <div key={visual.id} className="mb-4">
                        <img
                          src={visual.url}
                          alt={visual.caption || ""}
                          className="w-full rounded-lg"
                        />
                        {visual.caption && (
                          <p className="text-sm text-gray-600 mt-2 italic text-center">
                            {visual.caption}
                          </p>
                        )}
                      </div>
                    );
                  })}
                {!textContent.visuals?.some((v) => v.sectionId === section.id) && (
                  <MarkdownRenderer content={section.content} />
                )}
              </div>
            ))}

            {/* Comprehension Quiz */}
            {showQuiz && lesson.comprehensionCheck.length > 0 && (
              <ComprehensionQuiz
                questions={lesson.comprehensionCheck}
                onComplete={handleQuizComplete}
              />
            )}

            {/* Complete Button */}
            {!showQuiz && (
              <div className="mt-8">
                <Button
                  onClick={() => {
                    if (lesson.comprehensionCheck.length > 0) {
                      setShowQuiz(true);
                    } else {
                      completeLesson(lessonId, 100);
                    }
                  }}
                  size="lg"
                  className="w-full"
                >
                  {lesson.comprehensionCheck.length > 0 ? "Take Quiz" : "Mark Complete"}
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <SectionNav
              sections={textContent.sections}
              activeSectionId={activeSectionId}
              onSectionChange={setActiveSectionId}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Previous Lesson
          </Button>
          <Button>
            Next Lesson
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // Render simulation lesson (not yet implemented)
  if (lesson.type === "simulation") {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Simulation lessons are not yet supported.</p>
          <Link href="/subjects">
            <Button className="mt-4">Back to Subjects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const videoContent = lesson.content as VideoContent;
  const activeQuestionData = lesson.embeddedQuestions.find((q) => q.id === activeQuestion);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/subjects"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Subjects
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
        <p className="text-gray-600 mt-2">{lesson.description}</p>
      </div>

      {/* Video Player and Transcript */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div>
            <VideoPlayer
              src={videoContent.videoUrl}
              captionsUrl={videoContent.captionsUrl}
              initialTime={currentTime}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPaused(false)}
              onPause={() => setIsPaused(true)}
            />
            <video
              ref={videoRef}
              src={videoContent.videoUrl}
              style={{ display: "none" }}
              onEnded={handleVideoEnd}
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full"
            >
              {showTranscript ? "Hide" : "Show"} Transcript
            </Button>
          </div>
          {showTranscript && (
            <TranscriptPanel
              transcript={videoContent.transcript}
              currentTime={currentTime}
              onSeek={handleSeek}
            />
          )}
        </div>
      </div>

      {/* Embedded Question Modal */}
      {activeQuestionData && (
        <EmbeddedQuestionModal
          question={activeQuestionData}
          isOpen={!!activeQuestion}
          onClose={() => {
            setActiveQuestion(null);
            setIsPaused(false);
            if (videoRef.current) {
              videoRef.current.play();
            }
          }}
          onSubmit={handleQuestionSubmit}
        />
      )}

      {/* Comprehension Quiz */}
      {showQuiz && lesson.comprehensionCheck.length > 0 && (
        <ComprehensionQuiz
          questions={lesson.comprehensionCheck}
          onComplete={handleQuizComplete}
        />
      )}

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Previous Lesson
        </Button>
        <Button>
          Next Lesson
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

