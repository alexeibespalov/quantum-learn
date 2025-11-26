"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RefreshCw, Clock, CheckCircle } from "lucide-react";

export default function ReviewPage() {
  // Mock data - use number type annotation to allow for empty state
  const reviewsDue: number = 18;
  const estimatedTime = "~15 minutes";

  const subjectBreakdown = [
    { subject: "Mathematics", count: 7, color: "bg-blue-100 text-blue-700" },
    { subject: "French", count: 5, color: "bg-red-100 text-red-700" },
    { subject: "Science", count: 4, color: "bg-green-100 text-green-700" },
    { subject: "History", count: 2, color: "bg-purple-100 text-purple-700" },
  ];

  if (reviewsDue === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">All caught up!</h1>
        <p className="text-gray-600 mb-6">
          No reviews due right now. Come back tomorrow!
        </p>
        <p className="text-sm text-gray-500 mb-6">
          3 cards due tomorrow at 9:00 AM
        </p>
        <Link href="/subjects">
          <Button>Practice Instead</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Time to Review!</h1>
        <p className="text-gray-600">Keep your knowledge fresh</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-primary-600 mb-1">{reviewsDue}</p>
          <p className="text-gray-600">cards due today</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
          <Clock className="w-4 h-4" />
          <span>{estimatedTime}</span>
        </div>

        <div className="space-y-2 mb-6">
          {subjectBreakdown.map((item) => (
            <div
              key={item.subject}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-700">{item.subject}</span>
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${item.color}`}
              >
                {item.count} cards
              </span>
            </div>
          ))}
        </div>

        <Button className="w-full" size="lg">
          Start Review Session
        </Button>
      </div>

      <div className="text-center">
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
          <option value="all">Review all subjects</option>
          <option value="maths">Mathematics only</option>
          <option value="french">French only</option>
          <option value="science">Science only</option>
        </select>
      </div>
    </div>
  );
}
