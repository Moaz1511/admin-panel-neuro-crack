'use client'

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, FormProvider, Controller } from 'react-hook-form';
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
import { FileUpload } from '@/components/ui/file-upload';
import { OptionsFieldArray } from './OptionsFieldArray';
import dynamic from 'next/dynamic';

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
  questions: z.array(z.object({
    question: z.string().min(1, { message: "Question is required" }),
    question_image_type: z.enum(["link", "file"]).optional(),
    question_image_link: z.string().optional(),
    question_image_url: z.string().optional(),
    question_video_type: z.enum(["link", "file"]).optional(),
    question_video_link: z.string().optional(),
    question_video_url: z.string().optional(),
    question_audio_type: z.enum(["link", "file"]).optional(),
    question_audio_link: z.string().optional(),
    question_audio_url: z.string().optional(),
    difficulty: z.string().min(1, { message: "Difficulty is required" }),
    reference: z.string().min(1, { message: "Reference is required" }),
    correctAnswerIndex: z.string().min(1, { message: "A correct answer must be selected" }),
    options: z.array(z.object({
      text: z.string().min(1, { message: "Option text is required" }),
      image_type: z.enum(["link", "file"]).optional(),
      image_link: z.string().optional(),
      image_file: z.any().optional(),
      video_type: z.enum(["link", "file"]).optional(),
      video_link: z.string().optional(),
      video_file: z.any().optional(),
      audio_type: z.enum(["link", "file"]).optional(),
      audio_link: z.string().optional(),
      audio_file: z.any().optional(),
    })).min(2, { message: "At least two options are required" }),
    explanation: z.string().optional(),
    explanation_image_type: z.enum(["link", "file"]).optional(),
    explanation_image_link: z.string().optional(),
    explanation_image_url: z.string().optional(),
    explanation_video_type: z.enum(["link", "file"]).optional(),
    explanation_video_link: z.string().optional(),
    explanation_video_url: z.string().optional(),
    explanation_audio_type: z.enum(["link", "file"]).optional(),
    explanation_audio_link: z.string().optional(),
    explanation_audio_url: z.string().optional(),
    hint: z.string().optional(),
    hint_image_type: z.enum(["link", "file"]).optional(),
    hint_image_link: z.string().optional(),
    hint_image_url: z.string().optional(),
    hint_video_type: z.enum(["link", "file"]).optional(),
    hint_video_link: z.string().optional(),
    hint_video_url: z.string().optional(),
    hint_audio_type: z.enum(["link", "file"]).optional(),
    hint_audio_link: z.string().optional(),
    hint_audio_url: z.string().optional(),
  })).min(1, { message: "At least one question is required" })
});

export default function CreateQuizPage() {
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
      questions: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "questions"
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
        const response = await axios.get('http://localhost:9000/api/programs');
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
          const response = await axios.get(`http://localhost:9000/api/classes?program_id=${programId}`);
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
          const response = await axios.get(`http://localhost:9000/api/groups?class_id=${classId}`);
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
          const response = await axios.get(`http://localhost:9000/api/subjects?group_id=${groupId}`);
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
          const response = await axios.get(`http://localhost:9000/api/chapters?subject_id=${subjectId}`);
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
          const response = await axios.get(`http://localhost:9000/api/topics?chapter_id=${chapterId}`);
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
      for (const q of data.questions) {
        const transformedQuestion = {
          topic_id: data.topic_id,
          question_text: q.question,
          question_image_url: q.question_image_type === 'link' ? q.question_image_link : q.question_image_url,
          question_video_url: q.question_video_type === 'link' ? q.question_video_link : q.question_video_url,
          question_audio_url: q.question_audio_type === 'link' ? q.question_audio_link : q.question_audio_url,
          difficulty_level: q.difficulty,
          reference: q.reference,
          options: q.options.map((opt: any, index: number) => ({
            option_text: opt.text,
            is_correct: index.toString() === q.correctAnswerIndex,
            option_image_url: opt.image_type === 'link' ? opt.image_link : opt.image_file,
            option_video_url: opt.video_type === 'link' ? opt.video_link : opt.video_file,
            option_audio_url: opt.audio_type === 'link' ? opt.audio_link : opt.audio_file,
          })),
          explanation: q.explanation,
          explanation_image_url: q.explanation_image_type === 'link' ? q.explanation_image_link : q.explanation_image_url,
          explanation_video_url: q.explanation_video_type === 'link' ? q.explanation_video_link : q.explanation_video_url,
          explanation_audio_url: q.explanation_audio_type === 'link' ? q.explanation_audio_link : q.explanation_audio_url,
          hint: q.hint,
          hint_image_url: q.hint_image_type === 'link' ? q.hint_image_link : q.hint_image_url,
          hint_video_url: q.hint_video_type === 'link' ? q.hint_video_link : q.hint_video_url,
          hint_audio_url: q.hint_audio_type === 'link' ? q.hint_audio_link : q.hint_audio_url,
        };
        await axios.post('http://localhost:9000/api/questions', transformedQuestion);
      }
      alert('MCQs created successfully!');
    } catch (error) {
      console.error('Error creating MCQs:', error);
      alert('Error creating MCQs. Please check the console for details.');
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
              <CardTitle>Create MCQ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="program_id">Program</label>
                  <Select
                    onValueChange={(value) =>
                      methods.setValue("program_id", value)
                    }
                  >
                    <SelectTrigger id="program_id">
                      <SelectValue
                        placeholder={
                          programsLoading ? "Loading..." : "Select Program"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program: any) => (
                        <SelectItem
                          key={program.id}
                          value={program.id.toString()}
                        >
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {methods.formState.errors.program_id && (
                    <p className="text-red-500">
                      {methods.formState.errors.program_id.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="class_id">Class</label>
                  <Select
                    onValueChange={(value) =>
                      methods.setValue("class_id", value)
                    }
                    disabled={!programId || classesLoading}
                  >
                    <SelectTrigger id="class_id">
                      <SelectValue
                        placeholder={
                          classesLoading ? "Loading..." : "Select Class"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c: any) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {methods.formState.errors.class_id && (
                    <p className="text-red-500">
                      {methods.formState.errors.class_id.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="group_id">Group</label>
                  <Select
                    onValueChange={(value) =>
                      methods.setValue("group_id", value)
                    }
                    disabled={!classId || groupsLoading}
                  >
                    <SelectTrigger id="group_id">
                      <SelectValue
                        placeholder={
                          groupsLoading ? "Loading..." : "Select Group"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group: any) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {methods.formState.errors.group_id && (
                    <p className="text-red-500">
                      {methods.formState.errors.group_id.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="subject_id">Subject</label>
                  <Select
                    onValueChange={(value) =>
                      methods.setValue("subject_id", value)
                    }
                    disabled={!groupId || subjectsLoading}
                  >
                    <SelectTrigger id="subject_id">
                      <SelectValue
                        placeholder={
                          subjectsLoading ? "Loading..." : "Select Subject"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject: any) => (
                        <SelectItem
                          key={subject.id}
                          value={subject.id.toString()}
                        >
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {methods.formState.errors.subject_id && (
                    <p className="text-red-500">
                      {methods.formState.errors.subject_id.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="chapter_id">Chapter</label>
                  <Select
                    onValueChange={(value) =>
                      methods.setValue("chapter_id", value)
                    }
                    disabled={!subjectId || chaptersLoading}
                  >
                    <SelectTrigger id="chapter_id">
                      <SelectValue
                        placeholder={
                          chaptersLoading ? "Loading..." : "Select Chapter"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((chapter: any) => (
                        <SelectItem
                          key={chapter.id}
                          value={chapter.id.toString()}
                        >
                          {chapter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {methods.formState.errors.chapter_id && (
                    <p className="text-red-500">
                      {methods.formState.errors.chapter_id.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="topic_id">Topic</label>
                  <Select
                    onValueChange={(value) =>
                      methods.setValue("topic_id", value)
                    }
                    disabled={!chapterId || topicsLoading}
                  >
                    <SelectTrigger id="topic_id">
                      <SelectValue
                        placeholder={
                          topicsLoading ? "Loading..." : "Select Topic"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic: any) => (
                        <SelectItem key={topic.id} value={topic.id.toString()}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {methods.formState.errors.topic_id && (
                    <p className="text-red-500">
                      {methods.formState.errors.topic_id.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Question {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      Remove Question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor={`questions.${index}.question`}>
                      Question
                    </label>
                    <QuillEditor
                      content={methods.watch(`questions.${index}.question`) as string}
                      onUpdate={(value) =>
                        methods.setValue(`questions.${index}.question`, value)
                      }
                    />
                    {methods.formState.errors.questions?.[index]?.question && (
                      <p className="text-red-500">
                        {
                          methods.formState.errors.questions[index].question
                            .message
                        }
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label>Question Image</label>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value: "link" | "file") => methods.setValue(`questions.${index}.question_image_type`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                        {methods.watch(`questions.${index}.question_image_type`) === 'link' && (
                          <Input {...methods.register(`questions.${index}.question_image_link`)} placeholder="Image Link" />
                        )}
                        {methods.watch(`questions.${index}.question_image_type`) === 'file' && (
                          <FileUpload onUpload={(filePath) => methods.setValue(`questions.${index}.question_image_url`, filePath)} />
                        )}
                      </div>
                    </div>
                    <div>
                      <label>Question Video</label>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value: "link" | "file") => methods.setValue(`questions.${index}.question_video_type`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                        {methods.watch(`questions.${index}.question_video_type`) === 'link' && (
                          <Input {...methods.register(`questions.${index}.question_video_link`)} placeholder="Video Link" />
                        )}
                        {methods.watch(`questions.${index}.question_video_type`) === 'file' && (
                          <FileUpload onUpload={(filePath) => methods.setValue(`questions.${index}.question_video_url`, filePath)} />
                        )}
                      </div>
                    </div>
                    <div>
                      <label>Question Audio</label>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value: "link" | "file") => methods.setValue(`questions.${index}.question_audio_type`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                        {methods.watch(`questions.${index}.question_audio_type`) === 'link' && (
                          <Input {...methods.register(`questions.${index}.question_audio_link`)} placeholder="Audio Link" />
                        )}
                        {methods.watch(`questions.${index}.question_audio_type`) === 'file' && (
                          <FileUpload onUpload={(filePath) => methods.setValue(`questions.${index}.question_audio_url`, filePath)} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`questions.${index}.difficulty`}>
                        Difficulty
                      </label>
                      <Select
                        onValueChange={(value) =>
                          methods.setValue(
                            `questions.${index}.difficulty`,
                            value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      {methods.formState.errors.questions?.[index]
                        ?.difficulty && (
                        <p className="text-red-500">
                          {
                            methods.formState.errors.questions[index].difficulty
                              .message
                          }
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={`questions.${index}.reference`}>
                        Reference
                      </label>
                      <QuillEditor
                        content={methods.watch(`questions.${index}.reference`) as string}
                        onUpdate={(value) =>
                          methods.setValue(
                            `questions.${index}.reference`,
                            value
                          )
                        }
                      />
                      {methods.formState.errors.questions?.[index]
                        ?.reference && (
                        <p className="text-red-500">
                          {
                            methods.formState.errors.questions[index].reference
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Options</h3>
                    <OptionsFieldArray nestIndex={index} />
                    {methods.formState.errors.questions?.[index]?.options && (
                      <p className="text-red-500">
                        {
                          methods.formState.errors.questions[index].options
                            .message
                        }
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`questions.${index}.explanation`}>
                      Explanation
                    </label>
                    <QuillEditor
                      content={methods.watch(`questions.${index}.explanation`) as string}
                      onUpdate={(value) =>
                        methods.setValue(
                          `questions.${index}.explanation`,
                          value
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label>Explanation Image</label>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value: "link" | "file") => methods.setValue(`questions.${index}.explanation_image_type`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                        {methods.watch(`questions.${index}.explanation_image_type`) === 'link' && (
                          <Input {...methods.register(`questions.${index}.explanation_image_link`)} placeholder="Image Link" />
                        )}
                        {methods.watch(`questions.${index}.explanation_image_type`) === 'file' && (
                          <FileUpload onUpload={(filePath) => methods.setValue(`questions.${index}.explanation_image_url`, filePath)} />
                        )}
                      </div>
                    </div>
                    <div>
                      <label>Explanation Video</label>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value: "link" | "file") => methods.setValue(`questions.${index}.explanation_video_type`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                        {methods.watch(`questions.${index}.explanation_video_type`) === 'link' && (
                          <Input {...methods.register(`questions.${index}.explanation_video_link`)} placeholder="Video Link" />
                        )}
                        {methods.watch(`questions.${index}.explanation_video_type`) === 'file' && (
                          <FileUpload onUpload={(filePath) => methods.setValue(`questions.${index}.explanation_video_url`, filePath)} />
                        )}
                      </div>
                    </div>
                    <div>
                      <label>Explanation Audio</label>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value: "link" | "file") => methods.setValue(`questions.${index}.explanation_audio_type`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                        {methods.watch(`questions.${index}.explanation_audio_type`) === 'link' && (
                          <Input {...methods.register(`questions.${index}.explanation_audio_link`)} placeholder="Audio Link" />
                        )}
                        {methods.watch(`questions.${index}.explanation_audio_type`) === 'file' && (
                          <FileUpload onUpload={(filePath) => methods.setValue(`questions.${index}.explanation_audio_url`, filePath)} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`questions.${index}.hint`}>Hint</label>
                    <QuillEditor
                      content={methods.watch(`questions.${index}.hint`) as string}
                      onUpdate={(value) =>
                        methods.setValue(`questions.${index}.hint`, value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label>Hint Image</label>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value: "link" | "file") => methods.setValue(`questions.${index}.hint_image_type`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                        {methods.watch(`questions.${index}.hint_image_type`) === 'link' && (
                          <Input {...methods.register(`questions.${index}.hint_image_link`)} placeholder="Image Link" />
                        )}
                        {methods.watch(`questions.${index}.hint_image_type`) === 'file' && (
                          <FileUpload onUpload={(filePath) => methods.setValue(`questions.${index}.hint_image_url`, filePath)} />
                        )}
                      </div>
                    </div>
                    <div>
                      <label>Hint Video</label>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value: "link" | "file") => methods.setValue(`questions.${index}.hint_video_type`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                        {methods.watch(`questions.${index}.hint_video_type`) === 'link' && (
                          <Input {...methods.register(`questions.${index}.hint_video_link`)} placeholder="Video Link" />
                        )}
                        {methods.watch(`questions.${index}.hint_video_type`) === 'file' && (
                          <FileUpload onUpload={(filePath) => methods.setValue(`questions.${index}.hint_video_url`, filePath)} />
                        )}
                      </div>
                    </div>
                    <div>
                      <label>Hint Audio</label>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value: "link" | "file") => methods.setValue(`questions.${index}.hint_audio_type`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                        {methods.watch(`questions.${index}.hint_audio_type`) === 'link' && (
                          <Input {...methods.register(`questions.${index}.hint_audio_link`)} placeholder="Audio Link" />
                        )}
                        {methods.watch(`questions.${index}.hint_audio_type`) === 'file' && (
                          <FileUpload onUpload={(filePath) => methods.setValue(`questions.${index}.hint_audio_url`, filePath)} />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between">
            {/* This is the "Add Question" button */}
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                append({
                  question: "",
                  difficulty: "",
                  reference: "",
                  options: [], // Your OptionsFieldArray will handle adding items here
                  correctAnswerIndex: "-1",
                  explanation: "",
                  hint: "",
                })
              }
            >
              Add Question
            </Button>
            {/* This is the "Submit" button */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating MCQs..." : "Create MCQs"}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}