"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Sparkles, RefreshCw, Edit3, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

interface RubricScore {
  criterion: string;
  score: number;
  feedback: string;
}

interface GradeResult {
  grade: string;
  score: number;
  feedback: string;
  rubricScores: RubricScore[];
  suggestions: string[];
}

interface GradeFeedbackProps {
  submissionId?: string;
  assignmentId?: string;
  content: string;
  rubric?: { criterion: string; maxScore: number; description?: string }[];
  studentId?: string;
  courseId?: string;
  onGradeOverride?: (newScore: number) => void;
}

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-orange-100 text-orange-800",
  F: "bg-red-100 text-red-800",
};

export default function GradeFeedback({
  submissionId,
  assignmentId,
  content,
  rubric,
  studentId,
  courseId,
  onGradeOverride,
}: GradeFeedbackProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [overriding, setOverriding] = useState(false);
  const [overrideScore, setOverrideScore] = useState("");

  useEffect(() => {
    if (content && !result && !loading) {
      handleGrade();
    }
  }, [content]);

  const handleGrade = async () => {
    if (!content?.trim()) {
      setError("No submission content to grade");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId,
          submissionId,
          submissionContent: content,
          rubric,
          studentId,
          courseId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to grade submission");
      }
    } catch {
      setError("Failed to grade submission");
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = () => {
    const score = Number(overrideScore);
    if (isNaN(score) || score < 0 || score > 100) {
      toast.error("Score must be between 0 and 100");
      return;
    }
    let letterGrade = "F";
    if (score >= 90) letterGrade = "A";
    else if (score >= 80) letterGrade = "B";
    else if (score >= 70) letterGrade = "C";
    else if (score >= 60) letterGrade = "D";

    setResult((prev) =>
      prev ? { ...prev, score, grade: letterGrade } : prev
    );
    setOverriding(false);
    onGradeOverride?.(score);
    toast.success("Grade overridden");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-500">AI is grading the submission...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <Button variant="outline" size="sm" onClick={handleGrade} className="mt-3 gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Grading Result
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={gradeColors[result.grade] || gradeColors.F}>
                Grade: {result.grade}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGrade}
                className="gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Re-grade
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{result.score}%</div>
              <p className="text-xs text-gray-500">Score</p>
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Score</span>
                <span className="font-medium">{result.score}/100</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    result.score >= 70
                      ? "bg-green-500"
                      : result.score >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>
            {!overriding ? (
              <Button variant="outline" size="sm" onClick={() => setOverriding(true)} className="gap-1 shrink-0">
                <Edit3 className="h-3 w-3" />
                Override
              </Button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(e.target.value)}
                  className="h-8 w-16 rounded border px-2 text-sm"
                  placeholder="0-100"
                />
                <Button size="sm" onClick={handleOverride}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setOverriding(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-1 text-sm font-semibold text-gray-700">Overall Feedback</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{result.feedback}</p>
          </div>

          {result.rubricScores && result.rubricScores.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-700">Rubric Breakdown</h4>
              <div className="space-y-2">
                {result.rubricScores.map((rs, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">{rs.criterion}</span>
                      <span className="text-sm font-bold text-gray-900">{rs.score}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{rs.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.suggestions && result.suggestions.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Improvement Suggestions
              </h4>
              <ul className="space-y-1.5">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
