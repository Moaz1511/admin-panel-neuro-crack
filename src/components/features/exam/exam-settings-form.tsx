'use client'

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';
import { baseUrl } from '@/lib/api/api-endpoints';

const formSchema = z.object({
  program_id: z.string().min(1, { message: "Program is required" }),
  class_id: z.string().min(1, { message: "Class is required" }),
  group_id: z.string().min(1, { message: "Group is required" }),
  subject_id: z.string().min(1, { message: "Subject is required" }),
  chapter_id: z.string().min(1, { message: "Chapter is required" }),
  topic_id: z.string().min(1, { message: "Topic is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().min(1, { message: "End date is required" }),
  instructions: z.string().min(1, { message: "Instructions are required" }),
  negative_marking: z.boolean(),
  shuffle_questions: z.boolean(),
  syllabus: z.string().min(1, { message: "Syllabus is required" }),
  duration: z.number().min(1, { message: "Duration must be a positive number" }),
  total_marks: z.number().min(1, { message: "Total marks must be a positive number" }),
});

interface ExamSettingsFormProps {
  onNext: (id: string, topicId: string) => void;
}

export function ExamSettingsForm({ onNext }: ExamSettingsFormProps) {
  const [programs, setPrograms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      negative_marking: false,
      shuffle_questions: false,
    },
  });

  const programId = methods.watch('program_id');
  const classId = methods.watch('class_id');
  const groupId = methods.watch('group_id');
  const subjectId = methods.watch('subject_id');
  const chapterId = methods.watch('chapter_id');

  useEffect(() => {
    const fetchPrograms = async () => {
      setProgramsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/programs`);
        if (Array.isArray(response.data.data)) {
          setPrograms(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setProgramsLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    methods.setValue('class_id', '');
    methods.setValue('group_id', '');
    methods.setValue('subject_id', '');
    methods.setValue('chapter_id', '');
    methods.setValue('topic_id', '');
    setClasses([]);
    setGroups([]);
    setSubjects([]);
    setChapters([]);
    setTopics([]);
    const fetchClasses = async () => {
      if (programId) {
        setClassesLoading(true);
        try {
          const response = await axios.get(`${baseUrl}/api/classes?program_id=${programId}`);
          if (Array.isArray(response.data.data)) {
            setClasses(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching classes:', error);
        } finally {
          setClassesLoading(false);
        }
      }
    };
    fetchClasses();
  }, [programId]);

  useEffect(() => {
    methods.setValue('group_id', '');
    methods.setValue('subject_id', '');
    methods.setValue('chapter_id', '');
    methods.setValue('topic_id', '');
    setGroups([]);
    setSubjects([]);
    setChapters([]);
    setTopics([]);
    const fetchGroups = async () => {
      if (classId) {
        setGroupsLoading(true);
        try {
          const response = await axios.get(`${baseUrl}/api/groups?class_id=${classId}`);
          if (Array.isArray(response.data.data)) {
            setGroups(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching groups:', error);
        } finally {
          setGroupsLoading(false);
        }
      }
    };
    fetchGroups();
  }, [classId]);

  useEffect(() => {
    methods.setValue('subject_id', '');
    methods.setValue('chapter_id', '');
    methods.setValue('topic_id', '');
    setSubjects([]);
    setChapters([]);
    setTopics([]);
    const fetchSubjects = async () => {
      if (groupId) {
        setSubjectsLoading(true);
        try {
          const response = await axios.get(`${baseUrl}/api/subjects?group_id=${groupId}`);
          if (Array.isArray(response.data.data)) {
            setSubjects(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching subjects:', error);
        } finally {
          setSubjectsLoading(false);
        }
      }
    };
    fetchSubjects();
  }, [groupId]);

  useEffect(() => {
    methods.setValue('chapter_id', '');
    methods.setValue('topic_id', '');
    setChapters([]);
    setTopics([]);
    const fetchChapters = async () => {
      if (subjectId) {
        setChaptersLoading(true);
        try {
          const response = await axios.get(`${baseUrl}/api/chapters?subject_id=${subjectId}`);
          if (Array.isArray(response.data.data)) {
            setChapters(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching chapters:', error);
        } finally {
          setChaptersLoading(false);
        }
      }
    };
    fetchChapters();
  }, [subjectId]);

  useEffect(() => {
    methods.setValue('topic_id', '');
    setTopics([]);
    const fetchTopics = async () => {
      if (chapterId) {
        setTopicsLoading(true);
        try {
          const response = await axios.get(`${baseUrl}/api/topics?chapter_id=${chapterId}`);
          if (Array.isArray(response.data.data)) {
            setTopics(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching topics:', error);
        } finally {
          setTopicsLoading(false);
        }
      }
    };
    fetchTopics();
  }, [chapterId]);

  const onSubmit = async (data: any) => {
    console.log('Submitting data:', data);
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${baseUrl}/api/exams`, data);
      onNext(response.data.id, data.topic_id);
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Error creating exam. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Exam Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="program_id">Program</label>
                <Select onValueChange={(value) => methods.setValue('program_id', value)}>
                  <SelectTrigger id="program_id">
                    <SelectValue placeholder={programsLoading ? "Loading..." : "Select Program"} />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program: any) => (
                      <SelectItem key={program.id} value={program.id.toString()}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {methods.formState.errors.program_id && <p className="text-red-500">{methods.formState.errors.program_id.message}</p>}
              </div>
              <div>
                <label htmlFor="class_id">Class</label>
                <Select onValueChange={(value) => methods.setValue('class_id', value)} disabled={!programId || classesLoading}>
                  <SelectTrigger id="class_id">
                    <SelectValue placeholder={classesLoading ? "Loading..." : "Select Class"} />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c: any) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {methods.formState.errors.class_id && <p className="text-red-500">{methods.formState.errors.class_id.message}</p>}
              </div>
              <div>
                <label htmlFor="group_id">Group</label>
                <Select onValueChange={(value) => methods.setValue('group_id', value)} disabled={!classId || groupsLoading}>
                  <SelectTrigger id="group_id">
                    <SelectValue placeholder={groupsLoading ? "Loading..." : "Select Group"} />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group: any) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {methods.formState.errors.group_id && <p className="text-red-500">{methods.formState.errors.group_id.message}</p>}
              </div>
              <div>
                <label htmlFor="subject_id">Subject</label>
                <Select onValueChange={(value) => methods.setValue('subject_id', value)} disabled={!groupId || subjectsLoading}>
                  <SelectTrigger id="subject_id">
                    <SelectValue placeholder={subjectsLoading ? "Loading..." : "Select Subject"} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject: any) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {methods.formState.errors.subject_id && <p className="text-red-500">{methods.formState.errors.subject_id.message}</p>}
              </div>
              <div>
                <label htmlFor="chapter_id">Chapter</label>
                <Select onValueChange={(value) => methods.setValue('chapter_id', value)} disabled={!subjectId || chaptersLoading}>
                  <SelectTrigger id="chapter_id">
                    <SelectValue placeholder={chaptersLoading ? "Loading..." : "Select Chapter"} />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map((chapter: any) => (
                      <SelectItem key={chapter.id} value={chapter.id.toString()}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {methods.formState.errors.chapter_id && <p className="text-red-500">{methods.formState.errors.chapter_id.message}</p>}
              </div>
              <div>
                <label htmlFor="topic_id">Topic</label>
                <Select onValueChange={(value) => methods.setValue('topic_id', value)} disabled={!chapterId || topicsLoading}>
                  <SelectTrigger id="topic_id">
                    <SelectValue placeholder={topicsLoading ? "Loading..." : "Select Topic"} />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic: any) => (
                      <SelectItem key={topic.id} value={topic.id.toString()}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {methods.formState.errors.topic_id && <p className="text-red-500">{methods.formState.errors.topic_id.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title">Title</label>
                <Input id="title" {...methods.register('title')} />
                {methods.formState.errors.title && <p className="text-red-500">{methods.formState.errors.title.message}</p>}
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <Input id="description" {...methods.register('description')} />
                {methods.formState.errors.description && <p className="text-red-500">{methods.formState.errors.description.message}</p>}
              </div>
              <div>
                <label htmlFor="start_date">Start Date</label>
                <Input id="start_date" type="date" {...methods.register('start_date')} />
                {methods.formState.errors.start_date && <p className="text-red-500">{methods.formState.errors.start_date.message}</p>}
              </div>
              <div>
                <label htmlFor="end_date">End Date</label>
                <Input id="end_date" type="date" {...methods.register('end_date')} />
                {methods.formState.errors.end_date && <p className="text-red-500">{methods.formState.errors.end_date.message}</p>}
              </div>
              <div>
                <label htmlFor="instructions">Instructions</label>
                <Input id="instructions" {...methods.register('instructions')} />
                {methods.formState.errors.instructions && <p className="text-red-500">{methods.formState.errors.instructions.message}</p>}
              </div>
              <div>
                <label htmlFor="syllabus">Syllabus</label>
                <Input id="syllabus" {...methods.register('syllabus')} />
                {methods.formState.errors.syllabus && <p className="text-red-500">{methods.formState.errors.syllabus.message}</p>}
              </div>
              <div>
                <label htmlFor="duration">Duration (minutes)</label>
                <Input id="duration" type="number" {...methods.register('duration', { valueAsNumber: true })} />
                {methods.formState.errors.duration && <p className="text-red-500">{methods.formState.errors.duration.message}</p>}
              </div>
              <div>
                <label htmlFor="total_marks">Total Marks</label>
                <Input id="total_marks" type="number" {...methods.register('total_marks', { valueAsNumber: true })} />
                {methods.formState.errors.total_marks && <p className="text-red-500">{methods.formState.errors.total_marks.message}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="negative_marking" {...methods.register('negative_marking')} />
                <label htmlFor="negative_marking">Negative Marking</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="shuffle_questions" {...methods.register('shuffle_questions')} />
                <label htmlFor="shuffle_questions">Shuffle Questions</label>
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save and Continue'}</Button>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
