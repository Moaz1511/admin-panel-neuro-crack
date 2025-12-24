'use client';

import withAdminAuth from '@/components/shared/withAdminAuth';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getRequest, patchRequest, deleteRequest, putRequest } from '@/lib/api/api-caller';
import { toast } from 'sonner';
import QuillViewer from '@/components/shared/QuillViewer';
import { ChevronDown, ChevronUp, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: {
    code?: string
  }
}

// Define types for your data
interface Program { id: number; name: string; }
interface Class { id: number; name: string; }
interface Group { id: number; name: string; }
interface Subject { id: number; name: string; }
interface Chapter { id: number; name: string; }
interface Topic { id: number; name: string; }
export interface Option {
  id: number;
  option_text: string;
  is_correct: boolean;
  option_image_url?: string;
  option_video_url?: string;
  option_audio_url?: string;
}

export interface CQSubQuestion {
    id: number;
    cq_id: number;
    question_text: string;
    answer_text: string;
    cq_sub_question_image_url?: string;
}

export interface Explanation {
  id: number;
  question_id: number;
  explanation_text: string;
  explanation_image_url?: string;
  explanation_video_url?: string;
  explanation_audio_url?: string;
}

export interface Hint {
  id: number;
  question_id: number;
  hint_text: string;
  hint_image_url?: string;
  hint_video_url?: string;
  hint_audio_url?: string;
}

export interface Question {
  id: number;
  type: 'mcq' | 'cq' | 'saq';
  question_text?: string;
  uddipok?: string;
  is_qac: boolean;
  topic_id: number;
  topic_name: string;
  chapter_name: string;
  subject_name: string;
  group_name: string;
  class_name: string;
  program_name: string;
  difficulty_level?: string;
  reference?: string;
  explanation?: Explanation[];
  hint?: Hint[];
  options?: Option[] | CQSubQuestion[];
  question_image_url?: string;
  question_video_url?: string;
  question_audio_url?: string;
}

export interface QacLog {
    action: string;
    timestamp: string;
    user_name: string;
}

const qacSchema = z.object({
  programId: z.string().optional(),
  classId: z.string().optional(),
  groupId: z.string().optional(),
  subjectId: z.string().optional(),
  chapterId: z.string().optional(),
  topicId: z.string().optional(),
  contentType: z.enum(['MCQ', 'CQ', 'SAQ', 'ALL']).optional(),
  searchText: z.string().optional(),
  questionsPerPage: z.string().optional(),
});

type QACFormValues = z.infer<typeof qacSchema>;

import { EditQuestionModal } from '@/components/features/qac/EditQuestionModal';
import { baseUrl } from '@/lib/api/api-endpoints';

function QACPage() {
  const { register, handleSubmit, watch, setValue } = useForm<QACFormValues>({
    resolver: zodResolver(qacSchema),
    defaultValues: {
      contentType: 'ALL',
      questionsPerPage: '50',
    },
  });

  const [programs, setPrograms] = useState<Program[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hasUserSearched, setHasUserSearched] = useState(false); // New state to track if a search has been performed
  const [qacLogs, setQacLogs] = useState<QacLog[]>([]);
  const [selectedQuestionForLogs, setSelectedQuestionForLogs] = useState<Question | null>(null);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchQacLogs = async (question: Question) => {
    if (selectedQuestionForLogs?.id === question.id) {
        setSelectedQuestionForLogs(null);
        setQacLogs([]);
        return;
    }
    setLogsLoading(true);
    setSelectedQuestionForLogs(question);
    try {
        const res = await getRequest<{ data: QacLog[] }>(`/api/qac-logs/${question.id}/${question.type}`);
        if (res && res.data) {
            setQacLogs(res.data);
        } else {
            setQacLogs([]);
        }
    } catch (error) {
        toast.error('Failed to fetch QAC logs.');
        console.error('Error fetching QAC logs:', error);
    } finally {
        setLogsLoading(false);
    }
  };


  // Watch form values for dynamic filtering
  const selectedProgramId = watch('programId');
  const selectedClassId = watch('classId');
  const selectedGroupId = watch('groupId');
  const selectedSubjectId = watch('subjectId');
  const selectedChapterId = watch('chapterId');
  const selectedTopicId = watch('topicId');
  const selectedContentType = watch('contentType');
  const selectedQuestionsPerPage = watch('questionsPerPage');

  // Fetch programs on mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await getRequest<any>('/api/programs');
        if (res) {
          const data = Array.isArray(res.data) ? res.data : res;
          if (Array.isArray(data)) {
            setPrograms(data);
          }
        }
      } catch (error) {
        toast.error('Failed to fetch programs.');
        console.error('Error fetching programs:', error);
      }
    };
    fetchPrograms();
  }, []);

  // Fetch classes based on selected program
  useEffect(() => {
    const fetchClasses = async () => {
      if (selectedProgramId) {
        try {
          const res = await getRequest<any>(`/api/classes?program_id=${selectedProgramId}`);
          if (res) {
            const data = Array.isArray(res.data) ? res.data : res;
            if (Array.isArray(data)) {
                setClasses(data);
            }
          }
          setValue('classId', undefined); // Reset dependent dropdown
        } catch (error) {
          toast.error('Failed to fetch classes.');
          console.error('Error fetching classes:', error);
        }
      } else {
        setClasses([]);
        setValue('classId', undefined);
      }
    };
    fetchClasses();
  }, [selectedProgramId, setValue]);

  // Fetch groups based on selected class
  useEffect(() => {
    const fetchGroups = async () => {
      if (selectedClassId) {
        try {
          const res = await getRequest<any>(`/api/groups?class_id=${selectedClassId}`);
          if (res) {
            const data = Array.isArray(res.data) ? res.data : res;
            if (Array.isArray(data)) {
                setGroups(data);
            }
          }
          setValue('groupId', undefined); // Reset dependent dropdown
        } catch (error) {
          toast.error('Failed to fetch groups.');
          console.error('Error fetching groups:', error);
        }
      } else {
        setGroups([]);
        setValue('groupId', undefined);
      }
    };
    fetchGroups();
  }, [selectedClassId, setValue]);

  // Fetch subjects based on selected group
  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedGroupId) {
        try {
          const res = await getRequest<any>(`/api/subjects?group_id=${selectedGroupId}`);
          if (res) {
            const data = Array.isArray(res.data) ? res.data : res;
            if (Array.isArray(data)) {
                setSubjects(data);
            }
          }
          setValue('subjectId', undefined); // Reset dependent dropdown
        } catch (error) {
          toast.error('Failed to fetch subjects.');
          console.error('Error fetching subjects:', error);
        }
      } else {
        setSubjects([]);
        setValue('subjectId', undefined);
      }
    };
    fetchSubjects();
  }, [selectedGroupId, setValue]);

  // Fetch chapters based on selected subject
  useEffect(() => {
    const fetchChapters = async () => {
      if (selectedSubjectId) {
        try {
          const res = await getRequest<any>(`/api/chapters?subject_id=${selectedSubjectId}`);
          if (res) {
            const data = Array.isArray(res.data) ? res.data : res;
            if (Array.isArray(data)) {
                setChapters(data);
            }
          }
          setValue('chapterId', undefined); // Reset dependent dropdown
        } catch (error) {
          toast.error('Failed to fetch chapters.');
          console.error('Error fetching chapters:', error);
        }
      } else {
        setChapters([]);
        setValue('chapterId', undefined);
      }
    };
    fetchChapters();
  }, [selectedSubjectId, setValue]);

  // Fetch topics based on selected chapter
  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedChapterId) {
        try {
          const res = await getRequest<any>(`/api/topics?chapter_id=${selectedChapterId}`);
          if (res) {
            const data = Array.isArray(res.data) ? res.data : res;
            if(Array.isArray(data)) {
                setTopics(data);
            }
          }
          setValue('topicId', undefined); // Reset dependent dropdown
        } catch (error) {
          toast.error('Failed to fetch topics.');
          console.error('Error fetching topics:', error);
        }
      } else {
        setTopics([]);
        setValue('topicId', undefined);
      }
    };
    fetchTopics();
  }, [selectedChapterId, setValue]);


  const fetchQuestions = async (data: QACFormValues, currentPage: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (data.programId) params.append('programId', data.programId);
      if (data.classId) params.append('classId', data.classId);
      if (data.groupId) params.append('groupId', data.groupId);
      if (data.subjectId) params.append('subjectId', data.subjectId);
      if (data.chapterId) params.append('chapterId', data.chapterId);
      if (data.topicId) params.append('topicId', data.topicId);
      if (data.contentType) params.append('contentType', data.contentType);
      if (data.searchText) params.append('searchText', data.searchText);
      params.append('page', currentPage.toString());
      params.append('limit', selectedQuestionsPerPage ?? '50');

      const res = await getRequest<{ data: { rows: Question[], totalCount: number } }>(`/api/questions/search?${params.toString()}`);
      
      if (res && res.data) {
        setQuestions(res.data.rows || []);
        setTotalPages(Math.ceil((res.data.totalCount || 0) / parseInt(selectedQuestionsPerPage ?? '50')));
      } else {
        setQuestions([]);
        setTotalPages(1);
      }
    } catch (error) {
      toast.error('Failed to fetch questions.');
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: QACFormValues) => {
    setPage(1); // Reset to first page on new search
    setHasUserSearched(true); // User has initiated a search
    fetchQuestions(data, 1);
  };

  useEffect(() => {
    // Fetch questions whenever the page changes, but only if a search has been performed
    if (hasUserSearched) {
      const formData = watch();
      fetchQuestions(formData, page);
    }
  }, [page, hasUserSearched]);

    const handleQACToggle = async (question: Question) => {
        const newQacStatus = !question.is_qac;
        try {
            await patchRequest(`/api/questions/status/${question.id}`, {
                qacStatus: newQacStatus,
                type: question.type,
            });
            setQuestions(prev =>
                prev.map(q =>
                    q.id === question.id && q.type === question.type
                        ? { ...q, is_qac: newQacStatus }
                        : q
                )
            );
            toast.success(`Question marked as ${newQacStatus ? "QAC'd" : "Un-QAC'd"}.`);
        } catch (error) {
            toast.error('Failed to update QAC status.');
            console.error('Error updating QAC status:', error);
        }
    };

    const handleDeleteQuestion = async (question: Question) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await deleteRequest(`/api/questions/${question.id}?type=${question.type}`);
                setQuestions(prev => prev.filter(q => q.id !== question.id || q.type !== question.type));
                toast.success('Question deleted successfully.');
            } catch (error) {
                toast.error('Failed to delete question.');
                console.error(error);
            }
        }
    };

  // Implement handleEditQuestion (e.g., open a modal for editing)
    const handleEditQuestion = (question: Question) => {
        if (question.type !== 'mcq') {
            alert('Only MCQ questions can be edited at the moment.');
            return;
        }
        setEditingQuestion(question);
        setIsEditModalOpen(true);
    };

    const handleSaveQuestion = async (updatedQuestion: any) => {
        try {
            console.log('Saving question payload:', updatedQuestion);
            const response = await putRequest(`/api/questions/${updatedQuestion.id}`, updatedQuestion);
            console.log('Update response:', JSON.stringify(response, null, 2));
            
            // The backend might return the question object directly or wrapped in { data: ... }
            let savedQuestion = response as any;
            if (savedQuestion && !savedQuestion.id && savedQuestion.data) {
                savedQuestion = savedQuestion.data;
            }

            if (!savedQuestion || !savedQuestion.id) {
                console.error("Invalid response format from update API:", JSON.stringify(response, null, 2));
                toast.error("Failed to update question: Invalid server response.");
                return;
            }

            setQuestions(prev => prev.map(q => (q.id === savedQuestion.id && q.type === savedQuestion.type) ? savedQuestion : q));
            toast.success('Question updated successfully!');
            setIsEditModalOpen(false); // Close modal on save
            setEditingQuestion(null); // Clear editing state
        } catch (error) {
            toast.error('Failed to update question.');
            console.error('Error updating question:', error);
        }
    };


  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 ease-in-out p-4 md:p-8 mt-0">
      <div className="sticky top-0 z-10 bg-gray-50 pb-4 mb-4 border-b">
        <h1 className="text-2xl font-bold mb-4">Quality Assurance Check (QAC)</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Select onValueChange={(value) => setValue('programId', value === 'all' ? undefined : value)} value={selectedProgramId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {programs.map(program => (
                  <SelectItem key={program.id} value={String(program.id)}>{program.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setValue('classId', value === 'all' ? undefined : value)} value={selectedClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(_class => (
                  <SelectItem key={_class.id} value={String(_class.id)}>{_class.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setValue('groupId', value === 'all' ? undefined : value)} value={selectedGroupId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {groups.map(group => (
                  <SelectItem key={group.id} value={String(group.id)}>{group.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setValue('subjectId', value === 'all' ? undefined : value)} value={selectedSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={String(subject.id)}>{subject.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setValue('chapterId', value === 'all' ? undefined : value)} value={selectedChapterId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                {chapters.map(chapter => (
                  <SelectItem key={chapter.id} value={String(chapter.id)}>{chapter.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setValue('topicId', value === 'all' ? undefined : value)} value={selectedTopicId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map(topic => (
                  <SelectItem key={topic.id} value={String(topic.id)}>{topic.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setValue('contentType', value as 'MCQ' | 'CQ' | 'SAQ' | 'ALL')} value={selectedContentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Content Types</SelectItem>
                <SelectItem value="MCQ">MCQ</SelectItem>
                <SelectItem value="CQ">CQ</SelectItem>
                <SelectItem value="SAQ">SAQ</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="Search question text..." {...register('searchText')} className="lg:col-span-2" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <Search className="h-4 w-4 mr-2" /> Search Questions
          </Button>
        </form>
      </div>

      <Separator className="my-6" />

      {loading ? (
        <div className="grid gap-4">
          {[...Array(parseInt(selectedQuestionsPerPage ?? '50'))].map((_, i) => (
            <Card key={i} className="p-4 flex space-x-4">
              <div className="flex-shrink-0">
                <Checkbox disabled className="mt-1" />
              </div>
              <div className="flex-grow space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex-shrink-0 flex space-x-2">
                <Button size="icon" variant="outline" disabled><Edit className="h-4 w-4" /></Button>
                <Button size="icon" variant="outline" disabled><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No questions found matching your criteria.</div>
      ) : (
        <div className="grid gap-4">
          {questions.map((question) => {
            return (
            <Card key={`${question.type}-${question.id}`} className="p-4">
              <Collapsible defaultOpen>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={question.is_qac}
                      onCheckedChange={() => handleQACToggle(question)}
                      id={`qac-${question.type}-${question.id}`}
                    />
                    <label htmlFor={`qac-${question.type}-${question.id}`} className="font-medium">
                      QAC'd
                    </label>
                    <span className="text-sm text-muted-foreground">[{question.type.toUpperCase()} - ID: {question.id}]</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="icon" variant="outline" onClick={() => handleEditQuestion(question)} disabled={question.type !== 'mcq'}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleDeleteQuestion(question)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => fetchQacLogs(question)}>
                        {/* You might want a better icon for expand/collapse */}
                        <ChevronDown className="h-4 w-4 data-[state=open]:hidden" />
                        <ChevronUp className="h-4 w-4 data-[state=closed]:hidden" />
                        <span className="sr-only">Toggle details</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent className="pt-4 space-y-4 font-hind-siliguri">
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold">{question.type === 'cq' ? 'Uddipok:' : 'Question:'}</h3>
                    <QuillViewer content={question.type === 'cq' ? question.uddipok : question.question_text} />
                    {question.question_image_url && (
                      <img src={question.question_image_url} alt="Question Image" className="mt-2 rounded-md max-w-sm" />
                    )}
                  </div>
                  
                  {question.options && question.options.length > 0 && (
                    <div>
                      <h4 className="font-semibold">Options:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.type === 'mcq' && (question.options as Option[]).map((option, index) => {
                          if (!option) return null;
                          return (
                          <div key={option.id} className={`p-2 rounded ${option.is_correct ? 'bg-green-100 border-green-300' : 'bg-gray-100'}`}>
                            <div className="flex items-start prose">
                              <strong className="mr-2">{String.fromCharCode(65 + index)}.</strong>
                              <QuillViewer content={option.option_text} />
                            </div>
                            {option.option_image_url && (
                              <img src={option.option_image_url} alt={`Option ${index + 1} Image`} className="mt-2 rounded-md max-w-xs" />
                            )}
                          </div>
                        )})}
                        {question.type === 'cq' && (question.options as CQSubQuestion[]).map((sub, index) => {
                          if (!sub) return null;
                          return (
                          <div key={sub.id} className="p-2 bg-gray-100 rounded">
                            <div className="flex items-start prose">
                              <strong className="mr-2">{String.fromCharCode(97 + index)})</strong>
                              <QuillViewer content={sub.question_text} />
                            </div>
                            <div className="pl-4 mt-1 border-l-2 flex items-start prose">
                              <strong className="mr-2">Answer:</strong>
                              <QuillViewer content={sub.answer_text} />
                            </div>
                            {sub.cq_sub_question_image_url && (
                                <img src={sub.cq_sub_question_image_url} alt={`Sub-question ${index + 1} Image`} className="mt-2 rounded-md max-w-xs" />
                            )}
                          </div>
                        )})}
                      </div>
                    </div>
                  )}

                  {question.explanation && question.explanation.length > 0 && (
                    <div className="prose">
                      <h4 className="font-semibold">Explanation:</h4>
                      <QuillViewer content={question.explanation[0].explanation_text} />
                      {question.explanation[0].explanation_image_url && (
                        <img src={question.explanation[0].explanation_image_url} alt="Explanation Image" className="mt-2 rounded-md max-w-xs" />
                      )}
                    </div>
                  )}

                  {question.hint && question.hint.length > 0 && (
                    <div className="prose">
                      <h4 className="font-semibold">Hint:</h4>
                      <QuillViewer content={question.hint[0].hint_text} />
                      {question.hint[0].hint_image_url && (
                        <img src={question.hint[0].hint_image_url} alt="Hint Image" className="mt-2 rounded-md max-w-xs" />
                      )}
                    </div>
                  )}
                  
                  {question.reference && (
                    <div className="prose">
                      <h4 className="font-semibold">Reference:</h4>
                      <QuillViewer content={question.reference} />
                    </div>
                  )}

                  {selectedQuestionForLogs?.id === question.id && (
                    <div>
                        <h4 className="font-semibold">QAC Logs:</h4>
                        {logsLoading ? (
                            <p>Loading logs...</p>
                        ) : qacLogs.length > 0 ? (
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">User</th>
                                        <th scope="col" className="px-6 py-3">Action</th>
                                        <th scope="col" className="px-6 py-3">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {qacLogs.map((log, index) => (
                                        <tr key={index} className="bg-white border-b">
                                            <td className="px-6 py-4">{log.user_name}</td>
                                            <td className="px-6 py-4">{log.action}</td>
                                            <td className="px-6 py-4">{new Date(log.timestamp).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No QAC logs found for this question.</p>
                        )}
                    </div>
                  )}

                  {question.difficulty_level && (
                    <p className="text-sm"><strong>Difficulty:</strong> {question.difficulty_level}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Hierarchy: {question.program_name} &gt; {question.class_name} &gt; {question.group_name} &gt; {question.subject_name} &gt; {question.chapter_name} &gt; {question.topic_name}
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )})}
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <p className="text-sm text-muted-foreground">
          {questions.length} of {totalPages * parseInt(selectedQuestionsPerPage ?? '50')} records found
        </p>
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select onValueChange={(value) => setValue('questionsPerPage', value)} value={selectedQuestionsPerPage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Questions per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
                <SelectItem value="1000">1000 / page</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </div>

      <EditQuestionModal
        question={editingQuestion}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveQuestion}
      />
    </main>
  );

}

export default withAdminAuth(QACPage);
