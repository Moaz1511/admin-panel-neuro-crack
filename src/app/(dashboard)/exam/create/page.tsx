"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Define types for our data
interface Subject {
  id: string;
  name: string;
}
interface Chapter {
  id: string;
  name: string;
}
interface Topic {
  id: string;
  name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function CreateExamPage() {
  // State for fetched data
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for selections
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  
  // Form fields
  const [examTitle, setExamTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [standard, setStandard] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  // Fetch initial subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/meta-data/subjects`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data = await res.json();
        setAllSubjects(data);
      } catch (error) {
        toast.error("Could not load subjects.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch chapters when subjects change
  useEffect(() => {
    if (selectedSubjectIds.length === 0) {
      setAllChapters([]);
      return;
    }
    const fetchChapters = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/meta-data/chapters-by-subjects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ subjectIds: selectedSubjectIds }),
        });
        if (!res.ok) throw new Error("Failed to fetch chapters");
        const data = await res.json();
        setAllChapters(data);
      } catch (error) {
        toast.error("Could not load chapters for selected subjects.");
      }
    };
    fetchChapters();
  }, [selectedSubjectIds]);

  // Fetch topics when chapters change
  useEffect(() => {
    if (selectedChapterIds.length === 0) {
      setAllTopics([]);
      return;
    }
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/meta-data/topics-by-chapters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ chapterIds: selectedChapterIds }),
        });
        if (!res.ok) throw new Error("Failed to fetch topics");
        const data = await res.json();
        setAllTopics(data);
      } catch (error) {
        toast.error("Could not load topics for selected chapters.");
      }
    };
    fetchTopics();
  }, [selectedChapterIds]);
  
  const handleSelection = (id: string, list: string[], setList: Function) => {
    setList(
      list.includes(id) ? list.filter(item => item !== id) : [...list, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const examData = {
      title: examTitle,
      duration: parseInt(duration),
      sub_category: subCategory,
      standard: standard,
      total_marks: parseInt(totalMarks),
      topicIds: selectedTopicIds,
      is_custom: false,
    };

    if (selectedTopicIds.length === 0) {
        toast.error("Please select at least one topic.");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/exams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(examData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create exam');
        }

        toast.success("Model Test created successfully!");
    } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred.");
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create New Model Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Exam Details */}
                <div className="space-y-4 rounded-lg border p-4">
                    <h3 className="text-lg font-medium">Exam Details</h3>
                    <div className="space-y-2">
                        <Label htmlFor="title">Exam Title</Label>
                        <Input id="title" value={examTitle} onChange={e => setExamTitle(e.target.value)} placeholder="e.g., Weekly Physics Test" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="sub_category">Sub Category</Label>
                        <Input id="sub_category" value={subCategory} onChange={e => setSubCategory(e.target.value)} placeholder="e.g., HSC, Admission" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="standard">Standard</Label>
                        <Input id="standard" value={standard} onChange={e => setStandard(e.target.value)} placeholder="e.g., Board Question, Varsity" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (Mins)</Label>
                            <Input id="duration" type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="60" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="total_marks">Total Marks</Label>
                            <Input id="total_marks" type="number" value={totalMarks} onChange={e => setTotalMarks(e.target.value)} placeholder="100" required />
                        </div>
                    </div>
                </div>

                {/* Selections */}
                <div className="space-y-4">
                    <div className="space-y-2 rounded-lg border p-4">
                        <h3 className="text-lg font-medium">1. Select Subjects</h3>
                        <ScrollArea className="h-40">
                            {allSubjects.map(subject => (
                                <div key={subject.id} className="flex items-center space-x-2 p-1">
                                    <Checkbox id={`subject-${subject.id}`} checked={selectedSubjectIds.includes(subject.id)} onCheckedChange={() => handleSelection(subject.id, selectedSubjectIds, setSelectedSubjectIds)} />
                                    <Label htmlFor={`subject-${subject.id}`} className="font-normal">{subject.name}</Label>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                    <div className="space-y-2 rounded-lg border p-4">
                        <h3 className="text-lg font-medium">2. Select Chapters</h3>
                        <ScrollArea className="h-40">
                            {selectedSubjectIds.length > 0 ? allChapters.map(chapter => (
                                <div key={chapter.id} className="flex items-center space-x-2 p-1">
                                    <Checkbox id={`chapter-${chapter.id}`} checked={selectedChapterIds.includes(chapter.id)} onCheckedChange={() => handleSelection(chapter.id, selectedChapterIds, setSelectedChapterIds)} />
                                    <Label htmlFor={`chapter-${chapter.id}`} className="font-normal">{chapter.name}</Label>
                                </div>
                            )) : <p className="text-sm text-muted-foreground p-1">Select subjects to see chapters.</p>}
                        </ScrollArea>
                    </div>
                    <div className="space-y-2 rounded-lg border p-4">
                        <h3 className="text-lg font-medium">3. Select Topics</h3>
                        <ScrollArea className="h-40">
                            {selectedChapterIds.length > 0 ? allTopics.map(topic => (
                                <div key={topic.id} className="flex items-center space-x-2 p-1">
                                    <Checkbox id={`topic-${topic.id}`} checked={selectedTopicIds.includes(topic.id)} onCheckedChange={() => handleSelection(topic.id, selectedTopicIds, setSelectedTopicIds)} />
                                    <Label htmlFor={`topic-${topic.id}`} className="font-normal">{topic.name}</Label>
                                </div>
                            )) : <p className="text-sm text-muted-foreground p-1">Select chapters to see topics.</p>}
                        </ScrollArea>
                    </div>
                </div>
            </div>
            <Button type="submit" className="w-full">Create Model Test</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
