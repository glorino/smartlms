"use client";

import { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Brain,
  Lightbulb,
  Layers,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ContentGeneratorProps {
  lessonId: string;
  courseId: string;
}

type ContentType = "summary" | "flashcards" | "study_guide" | "key_concepts";

const contentTypeConfig: Record<
  ContentType,
  { label: string; icon: any; color: string }
> = {
  summary: { label: "Generate Summary", icon: BookOpen, color: "indigo" },
  flashcards: { label: "Create Flashcards", icon: Brain, color: "emerald" },
  study_guide: { label: "Study Guide", icon: Lightbulb, color: "amber" },
  key_concepts: { label: "Key Concepts", icon: Layers, color: "rose" },
};

function SummaryView({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
      <p className="text-gray-600 leading-relaxed">{content.summary}</p>
      {content.keyPoints?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Points</h4>
          <ul className="space-y-1.5">
            {content.keyPoints.map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FlashcardsView({ content }: { content: any }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const cards = Array.isArray(content) ? content : content.flashcards || [];

  return (
    <div className="space-y-3">
      {cards.map((card: any, i: number) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600">Q{i + 1}</span>
            {flipped[i] ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <p className="mt-1 font-medium text-gray-900">{card.front}</p>
          {flipped[i] && (
            <p className="mt-2 text-sm text-gray-600 border-t border-gray-200 pt-2">
              {card.back}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function StudyGuideView({ content }: { content: any }) {
  const sections = content?.sections || [];
  return (
    <div className="space-y-4">
      {sections.map((section: any, i: number) => (
        <div key={i} className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
          <h4 className="font-medium text-gray-900">{section.title}</h4>
          <p className="mt-1 text-sm text-gray-600">{section.content}</p>
          {section.tips?.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-amber-700 mb-1">Tips:</p>
              <ul className="space-y-1">
                {section.tips.map((tip: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-amber-800">
                    <Lightbulb className="h-3 w-3 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function KeyConceptsView({ content }: { content: any }) {
  const concepts = Array.isArray(content) ? content : content.concepts || [];
  return (
    <div className="space-y-3">
      {concepts.map((item: any, i: number) => (
        <div key={i} className="rounded-lg border border-rose-100 bg-rose-50/50 p-4">
          <h4 className="font-medium text-rose-900">{item.concept}</h4>
          <p className="mt-1 text-sm text-gray-600">{item.definition}</p>
          {item.example && (
            <div className="mt-2 rounded bg-white p-2 text-xs text-gray-500">
              <span className="font-medium text-rose-700">Example:</span> {item.example}
            </div>
          )}
          {item.relatedTo?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.relatedTo.map((rel: string, j: number) => (
                <span
                  key={j}
                  className="inline-block rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700"
                >
                  {rel}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ContentGenerator({ lessonId, courseId }: ContentGeneratorProps) {
  const [activeType, setActiveType] = useState<ContentType | null>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const generateContent = async (type: ContentType) => {
    setActiveType(type);
    setLoading(true);
    setContent(null);
    setSaved(false);

    try {
      const res = await fetch("/api/ai/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, lessonId, courseId }),
      });

      if (!res.ok) throw new Error("Failed to generate content");
      const data = await res.json();
      setContent(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveToNotes = async () => {
    if (!content || !activeType) return;
    setSaving(true);
    try {
      const noteContent = "[AI " + activeType.replace("_", " ").toUpperCase() + "]\n\n" + JSON.stringify(content, null, 2);
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, courseId, content: noteContent }),
      });
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <span className="ml-3 text-gray-500">Generating...</span>
        </div>
      );
    }

    if (!content || !activeType) return null;

    switch (activeType) {
      case "summary":
        return <SummaryView content={content} />;
      case "flashcards":
        return <FlashcardsView content={content} />;
      case "study_guide":
        return <StudyGuideView content={content} />;
      case "key_concepts":
        return <KeyConceptsView content={content} />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
          <Sparkles className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Content Tools</h3>
          <p className="text-sm text-gray-500">Generate study materials for this lesson</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-4">
        {(Object.entries(contentTypeConfig) as [ContentType, any][]).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={type}
              onClick={() => generateContent(type)}
              disabled={loading}
              className={
                "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition disabled:opacity-50 " +
                (activeType === type
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100")
              }
            >
              <Icon className="h-5 w-5" />
              {config.label}
            </button>
          );
        })}
      </div>

      {content && (
        <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
          {renderContent()}
          <div className="mt-4 flex justify-end">
            <button
              onClick={saveToNotes}
              disabled={saving || saved}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saved ? "Saved to Notes" : "Save to Notes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
