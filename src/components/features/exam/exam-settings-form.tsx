'use client'

import { useState, useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
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
import { getRequest, postRequest } from '@/lib/api/api-caller';
import { MultiSelect } from "react-multi-select-component";

const formSchema = z.object({
  program_id: z.string().min(1, { message: "Program is required" }),
  class_id: z.string().min(1, { message: "Class is required" }),
  group_id: z.string().min(1, { message: "Group is required" }),
  subjectIds: z.array(z.string()).min(1, { message: "At least one subject is required" }),
  chapterIds: z.array(z.string()).min(1, { message: "At least one chapter is required" }),
  topicIds: z.array(z.string()).min(1, { message: "At least one topic is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  instructions: z.string().optional(),
  negative_marking: z.boolean().default(false),
  shuffle_questions: z.boolean().default(false),
  syllabus: z.string().optional(),
  duration: z.number().positive({ message: "Duration must be a positive number" }),
  total_marks: z.number().positive({ message: "Total marks must be a positive number" }),
  sub_category: z.string().min(1, "Sub Category is required"),
  standard: z.string().min(1, "Standard is required"),
});

interface ExamSettingsFormProps {
  onNext: (id: string, topicIds: string[]) => void;
}

export function ExamSettingsForm({ onNext }: ExamSettingsFormProps) {
  const [programs, setPrograms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState<{ label: string, value: string }[]>([]);
  const [chapters, setChapters] = useState<{ label: string, value: string }[]>([]);
  const [topics, setTopics] = useState<{ label: string, value: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program_id: '',
      class_id: '',
      group_id: '',
      subjectIds: [],
      chapterIds: [],
      topicIds: [],
      negative_marking: false,
      shuffle_questions: false,
    },
  });

  const programId = methods.watch('program_id');
  const classId = methods.watch('class_id');
  const groupId = methods.watch('group_id');
  const selectedSubjectIds = methods.watch('subjectIds');
  const selectedChapterIds = methods.watch('chapterIds');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response: any = await getRequest(`/api/programs`);
        setPrograms(response.data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      if (programId) {
        try {
          const response: any = await getRequest(`/api/classes?program_id=${programId}`);
          setClasses(response.data);
        } catch (error) {
          console.error('Error fetching classes:', error);
        }
      } else {
        setClasses([]);
      }
    };
    fetchClasses();
  }, [programId]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (classId) {
        try {
          const response: any = await getRequest(`/api/groups?class_id=${classId}`);
          setGroups(response.data);
        } catch (error) {
          console.error('Error fetching groups:', error);
        }
      } else {
        setGroups([]);
      }
    };
    fetchGroups();
  }, [classId]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (groupId) {
        try {
          const response: any = await getRequest(`/api/subjects?group_id=${groupId}`);
          setSubjects(response.data.map((s: any) => ({ label: s.name, value: s.id })));
        } catch (error) {
          console.error('Error fetching subjects:', error);
        }
      } else {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [groupId]);

  useEffect(() => {
    const fetchChapters = async () => {
      if (selectedSubjectIds?.length) {
        const queries = selectedSubjectIds.map(id => getRequest(`/api/chapters?subject_id=${id}`));
        try {
          const responses: any[] = await Promise.all(queries);
          const allChapters = responses.flatMap(res => res.data);
          setChapters(allChapters.map((c: any) => ({ label: c.name, value: c.id })));
        } catch (error) {
          console.error('Error fetching chapters:', error);
        }
      } else {
        setChapters([]);
      }
    };
    fetchChapters();
  }, [selectedSubjectIds]);

  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedChapterIds?.length) {
        const queries = selectedChapterIds.map(id => getRequest(`/api/topics?chapter_id=${id}`));
        try {
          const responses: any[] = await Promise.all(queries);
          const allTopics = responses.flatMap(res => res.data);
          setTopics(allTopics.map((t: any) => ({ label: t.name, value: t.id })));
        } catch (error) {
          console.error('Error fetching topics:', error);
        }
      } else {
        setTopics([]);
      }
    };
    fetchTopics();
  }, [selectedChapterIds]);


  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response: any = await postRequest('/api/exams', data);
      onNext(response.id, data.topicIds);
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
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program: any) => (
                      <SelectItem key={program.id} value={program.id.toString()}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="class_id">Class</label>
                <Select onValueChange={(value) => methods.setValue('class_id', value)} disabled={!programId}>
                  <SelectTrigger id="class_id">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c: any) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="group_id">Group</label>
                <Select onValueChange={(value) => methods.setValue('group_id', value)} disabled={!classId}>
                  <SelectTrigger id="group_id">
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group: any) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label>Subjects</label>
                <Controller
                  name="subjectIds"
                  control={methods.control}
                  render={({ field }) => (
                    <MultiSelect
                      options={subjects}
                      value={subjects.filter((s:any) => field.value.includes(s.value))}
                      onChange={(selected: any[]) => field.onChange(selected.map(s => s.value))}
                      labelledBy="Select Subjects"
                      disabled={!groupId}
                    />
                  )}
                />
              </div>
              <div>
                <label>Chapters</label>
                <Controller
                  name="chapterIds"
                  control={methods.control}
                  render={({ field }) => (
                    <MultiSelect
                      options={chapters}
                      value={chapters.filter((c:any) => field.value.includes(c.value))}
                      onChange={(selected: any[]) => field.onChange(selected.map(c => c.value))}
                      labelledBy="Select Chapters"
                      disabled={!selectedSubjectIds?.length}
                    />
                  )}
                />
              </div>
              <div>
                <label>Topics</label>
                <Controller
                  name="topicIds"
                  control={methods.control}
                  render={({ field }) => (
                    <MultiSelect
                      options={topics}
                      value={topics.filter((t:any) => field.value.includes(t.value))}
                      onChange={(selected: any[]) => field.onChange(selected.map(t => t.value))}
                      labelledBy="Select Topics"
                      disabled={!selectedChapterIds?.length}
                    />
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label htmlFor="sub_category">Sub Category</label>
                <Input id="sub_category" {...methods.register('sub_category')} />
              </div>
              <div>
                <label htmlFor="standard">Standard</label>
                <Input id="standard" {...methods.register('standard')} />
              </div>
              <div>
                <label htmlFor="title">Title</label>
                <Input id="title" {...methods.register('title')} />
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <Input id="description" {...methods.register('description')} />
              </div>
              <div>
                <label htmlFor="start_date">Start Date</label>
                <Input id="start_date" type="date" {...methods.register('start_date')} />
              </div>
              <div>
                <label htmlFor="end_date">End Date</label>
                <Input id="end_date" type="date" {...methods.register('end_date')} />
              </div>
              <div>
                <label htmlFor="instructions">Instructions</label>
                <Input id="instructions" {...methods.register('instructions')} />
              </div>
              <div>
                <label htmlFor="syllabus">Syllabus</label>
                <Input id="syllabus" {...methods.register('syllabus')} />
              </div>
              <div>
                <label htmlFor="duration">Duration (minutes)</label>
                <Input id="duration" type="number" {...methods.register('duration', { valueAsNumber: true })} />
              </div>
              <div>
                <label htmlFor="total_marks">Total Marks</label>
                <Input id="total_marks" type="number" {...methods.register('total_marks', { valueAsNumber: true })} />
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="negative_marking"
                  control={methods.control}
                  render={({ field }) => (
                    <Checkbox
                      id="negative_marking"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label htmlFor="negative_marking">Negative Marking</label>
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="shuffle_questions"
                  control={methods.control}
                  render={({ field }) => (
                    <Checkbox
                      id="shuffle_questions"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
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