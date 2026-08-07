"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Send,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "VIDEO" | "TEXT" | "QUIZ";
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

const categoryOptions = [
  { value: "web-development", label: "Web Development" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "data-science", label: "Data Science" },
  { value: "design", label: "Design" },
  { value: "devops", label: "DevOps" },
  { value: "mobile", label: "Mobile Development" },
  { value: "other", label: "Other" },
];

const levelOptions = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const mockCourseData: Record<string, { title: string; description: string; category: string; level: string; price: string; thumbnail: string | null; sections: Section[] }> = {
  "1": {
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a full-stack developer.",
    category: "web-development",
    level: "BEGINNER",
    price: "49.99",
    thumbnail: null,
    sections: [
      {
        id: "1",
        title: "Getting Started",
        lessons: [
          { id: "1", title: "Course Overview", duration: "5:00", type: "VIDEO" },
          { id: "2", title: "Setting Up Your Environment", duration: "15:00", type: "VIDEO" },
          { id: "3", title: "How the Web Works", duration: "12:00", type: "TEXT" },
        ],
      },
      {
        id: "2",
        title: "HTML Fundamentals",
        lessons: [
          { id: "4", title: "HTML Document Structure", duration: "18:00", type: "VIDEO" },
          { id: "5", title: "Common HTML Elements", duration: "22:00", type: "VIDEO" },
          { id: "6", title: "HTML Quiz", duration: "10:00", type: "QUIZ" },
        ],
      },
    ],
  },
  "2": {
    title: "Advanced React & Next.js Masterclass",
    description: "Master React hooks, context, Redux, Next.js App Router, server components, and advanced patterns.",
    category: "frontend",
    level: "ADVANCED",
    price: "79.99",
    thumbnail: null,
    sections: [
      {
        id: "1",
        title: "React Advanced Hooks",
        lessons: [
          { id: "1", title: "useReducer Deep Dive", duration: "20:00", type: "VIDEO" },
          { id: "2", title: "Custom Hooks Patterns", duration: "25:00", type: "VIDEO" },
        ],
      },
    ],
  },
};

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = mockCourseData[courseId] || mockCourseData["1"];
      setTitle(data.title);
      setDescription(data.description);
      setCategory(data.category);
      setLevel(data.level);
      setPrice(data.price);
      setThumbnail(data.thumbnail);
      setSections(data.sections);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [courseId]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: String(sections.length + 1),
        title: `Section ${sections.length + 1}`,
        lessons: [],
      },
    ]);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  const addLesson = (sectionId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: [
                ...s.lessons,
                {
                  id: String(s.lessons.length + 1),
                  title: "New Lesson",
                  duration: "00:00",
                  type: "VIDEO",
                },
              ],
            }
          : s
      )
    );
  };

  const removeLesson = (sectionId: string, lessonId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
          : s
      )
    );
  };

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, title: newTitle } : s)));
  };

  const updateLessonTitle = (sectionId: string, lessonId: string, newTitle: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === lessonId ? { ...l, title: newTitle } : l
              ),
            }
          : s
      )
    );
  };

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/instructor/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
          <p className="mt-1 text-gray-600">Update your course details</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the basic details about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Course Title"
                placeholder="e.g. Complete Web Development Bootcamp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                label="Description"
                placeholder="Describe what students will learn in this course..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Category"
                  options={categoryOptions}
                  placeholder="Select category"
                  value={category}
                  onChange={setCategory}
                />
                <Select
                  label="Level"
                  options={levelOptions}
                  placeholder="Select level"
                  value={level}
                  onChange={setLevel}
                />
              </div>
              <Input
                label="Price ($)"
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>
                    {sections.length} sections &middot; {totalLessons} lessons
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={addSection}>
                  <Plus className="h-4 w-4" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                      className="flex-1 border-none bg-transparent text-sm font-semibold text-gray-900 focus:outline-none"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => removeSection(section.id)}
                      disabled={sections.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-3 ml-7 space-y-2">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 rounded-md bg-gray-50 p-3"
                      >
                        <GripVertical className="h-3.5 w-3.5 text-gray-400" />
                        <Badge
                          variant={
                            lesson.type === "VIDEO"
                              ? "default"
                              : lesson.type === "QUIZ"
                              ? "warning"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {lesson.type}
                        </Badge>
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) =>
                            updateLessonTitle(section.id, lesson.id, e.target.value)
                          }
                          className="flex-1 border-none bg-transparent text-sm text-gray-700 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={lesson.duration}
                          onChange={(e) => {
                            const newSections = sections.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    lessons: s.lessons.map((l) =>
                                      l.id === lesson.id ? { ...l, duration: e.target.value } : l
                                    ),
                                  }
                                : s
                            );
                            setSections(newSections);
                          }}
                          className="w-16 border-none bg-transparent text-xs text-gray-500 focus:outline-none"
                          placeholder="00:00"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-400 hover:text-red-600"
                          onClick={() => removeLesson(section.id, lesson.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    <button
                      onClick={() => addLesson(section.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 p-2 text-sm text-gray-500 transition-colors hover:border-primary hover:text-primary"
                    >
                      <Plus className="h-4 w-4" />
                      Add Lesson
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail</CardTitle>
              <CardDescription>Upload a cover image for your course</CardDescription>
            </CardHeader>
            <CardContent>
              {thumbnail ? (
                <div className="relative">
                  <img
                    src={thumbnail}
                    alt="Thumbnail"
                    className="h-40 w-full rounded-lg object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => setThumbnail(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setThumbnail("/placeholder-thumbnail.jpg")}
                  className="flex h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-primary hover:bg-gray-50"
                >
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Click to upload thumbnail</span>
                  <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                </button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2" onClick={() => alert("Course updated and published!")}>
                <Send className="h-4 w-4" />
                Update & Publish
              </Button>
              <Button variant="outline" className="w-full gap-2" onClick={() => alert("Changes saved as draft!")}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Sections</span>
                <span className="font-medium">{sections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Lessons</span>
                <span className="font-medium">{totalLessons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price</span>
                <span className="font-medium">${price || "0.00"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
