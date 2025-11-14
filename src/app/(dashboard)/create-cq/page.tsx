'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
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
import axios from 'axios';
import dynamic from 'next/dynamic';
import { baseUrl } from '@/lib/api/api-endpoints';

const QuillEditor = dynamic(
  () => import('@/components/shared/QuillEditor'),
  { ssr: false }
);

const formSchema = z.object({
  program_id: z.string().min(1, { message: "Program is required" }),
  class_id: z.string().min(1, { message: "Class is required" }),
  group_id: z.string().min(1, { message: "Group is required" }),
  subject_id: z.string().min(1, { message: "Subject is required" }),
  chapter_id: z.string().min(1, { message: "Chapter is required" }),
  topic_id: z.string().min(1, { message: "Topic is required" }),
  cqs: z.array(z.object({
    uddipok: z.string().min(1, { message: "Uddipok is required" }),
    uddipok_media_type: z.enum(["link", "file"]).optional(),
    uddipok_media_link: z.string().optional(),
    uddipok_media_file: z.any().optional(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    reference: z.string().optional(),
    sub_questions: z.array(z.object({
      question: z.string().min(1, { message: "Question is required" }),
      answer: z.string().min(1, { message: "Answer is required" }),
    })).min(1, { message: "At least one sub-question is required" })
  })).min(1, { message: "At least one CQ is required" })
});

type CqData = z.infer<typeof formSchema>;

export default function CreateCqPage() {
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
      cqs: [{
        uddipok: '',
        difficulty: 'Easy',
        reference: '',
        sub_questions: [{ question: '', answer: '' }]
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "cqs"
  });

  const programId = methods.watch('program_id');
  const classId = methods.watch('class_id');
  const groupId = methods.watch('group_id');
  const subjectId = methods.watch('subject_id');
  const chapterId = methods.watch('chapter_id');

  useEffect(() => {
    if (methods.formState.errors) {
      console.log('Form errors:', methods.formState.errors);
    }
  }, [methods.formState.errors]);

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

  const onSubmit = async (data: CqData) => {
    console.log('Submitting data:', data);
    setIsSubmitting(true);

    const promises = data.cqs.map(cq => {
        const payload = {
          program_id: data.program_id,
          class_id: data.class_id,
          group_id: data.group_id,
          subject_id: data.subject_id,
          chapter_id: data.chapter_id,
          topic_id: data.topic_id,
          uddipok: cq.uddipok,
          difficulty: cq.difficulty,
          reference: cq.reference,
          sub_questions: cq.sub_questions.map(sq => ({
            question: sq.question,
            answer: sq.answer,
          })),
        };
        return axios.post(`${baseUrl}/api/cqs`, payload);
    });

    try {
      await Promise.all(promises);
      alert('CQs created successfully!');
    } catch (error) {
      console.error('Error creating CQs:', error);
      alert('Error creating CQs. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-8">
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Create CQ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="program_id" className="block text-sm font-medium text-gray-700">Program</label>
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
                  {methods.formState.errors.program_id && <p className="text-sm text-red-500">{methods.formState.errors.program_id.message}</p>}
                </div>
                <div>
                  <label htmlFor="class_id" className="block text-sm font-medium text-gray-700">Class</label>
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
                  {methods.formState.errors.class_id && <p className="text-sm text-red-500">{methods.formState.errors.class_id.message}</p>}
                </div>
                <div>
                  <label htmlFor="group_id" className="block text-sm font-medium text-gray-700">Group</label>
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
                  {methods.formState.errors.group_id && <p className="text-sm text-red-500">{methods.formState.errors.group_id.message}</p>}
                </div>
                <div>
                  <label htmlFor="subject_id" className="block text-sm font-medium text-gray-700">Subject</label>
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
                  {methods.formState.errors.subject_id && <p className="text-sm text-red-500">{methods.formState.errors.subject_id.message}</p>}
                </div>
                <div>
                  <label htmlFor="chapter_id" className="block text-sm font-medium text-gray-700">Chapter</label>
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
                  {methods.formState.errors.chapter_id && <p className="text-sm text-red-500">{methods.formState.errors.chapter_id.message}</p>}
                </div>
                <div>
                  <label htmlFor="topic_id" className="block text-sm font-medium text-gray-700">Topic</label>
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
                  {methods.formState.errors.topic_id && <p className="text-sm text-red-500">{methods.formState.errors.topic_id.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Creative Question {index + 1}</CardTitle>
                    <Button type="button" variant="destructive" onClick={() => remove(index)}>Remove CQ</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor={`cqs.${index}.uddipok`} className="block text-sm font-medium text-gray-700">Uddipok (Stimulus)</label>
                    <QuillEditor
                      content={methods.watch(`cqs.${index}.uddipok`) as string}
                      onUpdate={(value) => methods.setValue(`cqs.${index}.uddipok`, value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Uddipok Media</label>
                    <div className="flex items-center space-x-2">
                      <Select onValueChange={(value: "link" | "file") => methods.setValue(`cqs.${index}.uddipok_media_type`, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Media Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="link">Link</SelectItem>
                          <SelectItem value="file">File</SelectItem>
                        </SelectContent>
                      </Select>
                      {methods.watch(`cqs.${index}.uddipok_media_type`) === 'link' && (
                        <Input {...methods.register(`cqs.${index}.uddipok_media_link`)} placeholder="Media Link" />
                      )}
                      {methods.watch(`cqs.${index}.uddipok_media_type`) === 'file' && (
                        <Input type="file" {...methods.register(`cqs.${index}.uddipok_media_file`)} />
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`cqs.${index}.difficulty`} className="block text-sm font-medium text-gray-700">Difficulty</label>
                    <Select onValueChange={(value: "Easy" | "Medium" | "Hard") => methods.setValue(`cqs.${index}.difficulty`, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor={`cqs.${index}.reference`} className="block text-sm font-medium text-gray-700">Reference</label>
                    <QuillEditor
                      content={methods.watch(`cqs.${index}.reference`) as string}
                      onUpdate={(value) => methods.setValue(`cqs.${index}.reference`, value)}
                    />
                  </div>

                  <SubQuestions cqIndex={index} />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between">
                          <Button type="button" variant="secondary" onClick={() => append({ uddipok: '', difficulty: 'Easy', reference: '', sub_questions: [{ question: '', answer: '' }] })}>
                            Add CQ
                          </Button>            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating CQs...' : 'Create CQs'}</Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}

function SubQuestions({ cqIndex }: { cqIndex: number }) {
  const { control, watch, setValue, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `cqs.${cqIndex}.sub_questions`
  });

  return (
    <div>
      <h3 className="text-lg font-medium">Sub-questions</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium">Sub-question {index + 1}</h4>
            <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>Remove Sub-question</Button>
          </div>
          <div>
            <label htmlFor={`cqs.${cqIndex}.sub_questions.${index}.question`} className="block text-sm font-medium text-gray-700">Question</label>
            <QuillEditor
              content={watch(`cqs.${cqIndex}.sub_questions.${index}.question`) as string}
              onUpdate={(value) => setValue(`cqs.${cqIndex}.sub_questions.${index}.question`, value)}
            />
          </div>
          <div>
            <label htmlFor={`cqs.${cqIndex}.sub_questions.${index}.answer`} className="block text-sm font-medium text-gray-700">Answer</label>
            <QuillEditor
              content={watch(`cqs.${cqIndex}.sub_questions.${index}.answer`) as string}
              onUpdate={(value) => setValue(`cqs.${cqIndex}.sub_questions.${index}.answer`, value)}
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={() => append({ question: '', answer: '' })}>
        Add Sub-question
      </Button>
    </div>
  )
}