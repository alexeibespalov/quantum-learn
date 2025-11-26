"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSubjectsWithProgress, filterSubjectsByStatus } from "@/services/subjects";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import type { SubjectWithProgress } from "@/services/subjects";
import type { SubjectFilter } from "@/services/subjects";

export default function SubjectsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<SubjectFilter>("all");
  const [subjects, setSubjects] = useState<SubjectWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadSubjects();
  }, [user]);

  const loadSubjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const allSubjects = await getSubjectsWithProgress(user.uid);
      setSubjects(allSubjects);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load subjects"));
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = filterSubjectsByStatus(subjects, filter);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Subjects</h1>
          <p className="text-gray-600">Explore your Year 9 curriculum</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading subjects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Subjects</h1>
          <p className="text-gray-600">Explore your Year 9 curriculum</p>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading subjects: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Subjects</h1>
        <p className="text-gray-600">Explore your Year 9 curriculum</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "all" as const, label: "All" },
          { value: "in-progress" as const, label: "In Progress" },
          { value: "not-started" as const, label: "Not Started" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.value
                ? "bg-primary-100 text-primary-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSubjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No subjects found for this filter.</p>
        </div>
      )}
    </div>
  );
}
