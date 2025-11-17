// src/components/features/quiz/quiz-settings-form.tsx

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Calendar } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // Import Datepicker styles
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRequest, postRequest, putRequest } from '@/lib/api/api-caller';
import { ApiEndpoints } from '@/lib/api/api-endpoints';

// CORRECT: Only import the custom dynamic wrapper component
import dynamic from 'next/dynamic'

// Dynamically import the TiptapEditor with SSR turned off
const TiptapEditor = dynamic(
  () => import('@/components/shared/tiptap-editor'),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>
  }
);

import { useRouter } from 'next/navigation'

interface QuizSettingsFormProps {
  moduleId: string;
  chapterId?: string | null;
  initialQuizData?: any;
  quizType: string;
  setQuizType: (type: string) => void;
}

export function QuizSettingsForm({ moduleId, chapterId, initialQuizData, quizType, setQuizType }: QuizSettingsFormProps) {
  const [isNew, setIsNew] = useState(moduleId === 'new');
  const [topics, setTopics] = useState<any[]>([]);
  const [topicId, setTopicId] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(new Date())
  const [syllabusContent, setSyllabusContent] = useState('')
  const [formKey, setFormKey] = useState(0);
  const router = useRouter()

  useEffect(() => {
    if (chapterId) {
        const fetchTopics = async () => {
            try {
                const response: any = await getRequest(`${ApiEndpoints.topics.getByChapterId}${chapterId}`);
                setTopics(response.data);
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };
        fetchTopics();
    }

    if (initialQuizData) {
        setTopicId(initialQuizData.topic_id);
        setStartDate(new Date(initialQuizData.start_date));
        setEndDate(new Date(initialQuizData.end_date));
        setSyllabusContent(initialQuizData.syllabus);
        setFormKey(prev => prev + 1); // Re-mount the form with new default values
    }
  }, [moduleId, chapterId, isNew, initialQuizData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const formJson: any = Object.fromEntries(formData.entries());
    formJson.topic_id = topicId;
    formJson.syllabus = syllabusContent;
    formJson.start_date = startDate;
    formJson.end_date = endDate;
    formJson.quiz_type = quizType;

    if (!topicId) {
        alert('Please select a topic');
        return;
    }
    try {
        if (isNew) {
            const response: any = await postRequest(ApiEndpoints.quizzes.create, formJson);
            const newModuleId = response.id;
            router.push(`/create-quiz/${newModuleId}${chapterId ? `?chapterId=${chapterId}` : ''}`);
        } else {
            await putRequest(`${ApiEndpoints.quizzes.update}${moduleId}`, formJson);
            // maybe show a toast notification
        }
    } catch (error) {
        console.error('Error saving quiz:', error);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Module &amp; Exam Settings</h1>
      <form key={formKey} className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Switch id="show-title" name="show_title" defaultChecked={initialQuizData?.show_title} />
              <Label htmlFor="show-title">Show title for students</Label>
            </div>
            <div className="flex items-center space-x-4">
              <Switch id="is-live" name="is_live" defaultChecked={initialQuizData?.is_live} />
              <Label htmlFor="is-live">Live</Label>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Selected Type</Label>
              <RadioGroup name="quiz_type" value={quizType} onValueChange={setQuizType} className="mt-2 flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="saq" id="type-saq" />
                  <Label htmlFor="type-saq">SAQ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cq" id="type-cq" />
                  <Label htmlFor="type-cq">CQ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mcq" id="type-mcq" />
                  <Label htmlFor="type-mcq">MCQ</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Right Column (Placeholder for Notification settings) */}
          <div className="grid gap-4 p-4 bg-muted/50 rounded-xl">
            <h3 className="font-semibold">Notification Settings</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="pre-class-notif">Pre-Class Notification</Label>
              <Switch id="pre-class-notif" name="pre_class_notification" defaultChecked={initialQuizData?.pre_class_notification} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ongoing-class-notif">Ongoing-Class Notification</Label>
              <Switch id="ongoing-class-notif" name="ongoing_class_notification" defaultChecked={initialQuizData?.ongoing_class_notification} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="post-class-notif">Post-Class Notification</Label>
              <Switch id="post-class-notif" name="post_class_notification" defaultChecked={initialQuizData?.post_class_notification} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="mb-4">
              <Label htmlFor="topic">Topic</Label>
              <Select onValueChange={setTopicId} defaultValue={topicId.toString()}>
                  <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                      {topics.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id.toString()}>{topic.name}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
          <div>
            <Label htmlFor="title">Module Title</Label>
            <Input id="title" name="title" type="text" placeholder="e.g., অধ্যায় ২: সেট ও ফাংশন" defaultValue={initialQuizData?.title} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Add a short description for this module" defaultValue={initialQuizData?.description} />
          </div>
          <div>
            <Label>Module Thumbnail</Label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <Label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary/80">
                    <span>Upload a file</span>
                    <Input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </Label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold pt-4">Exam Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <Label>Start Date and Time</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>End Date and Time</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Input id="instructions" name="instructions" placeholder="e.g., instruction1, instruction2, instruction3" defaultValue={initialQuizData?.instructions} />
            <p className="text-sm text-muted-foreground mt-1">Write in comma-separated format.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Switch id="negative-marking" name="negative_marking" defaultChecked={initialQuizData?.negative_marking} />
            <Label htmlFor="negative-marking">Negative Marking</Label>
          </div>
          <div className="flex items-center space-x-4">
            <Switch id="shuffle-questions" name="shuffle_questions" defaultChecked={initialQuizData?.shuffle_questions} />
            <Label htmlFor="shuffle-questions">Shuffle Questions</Label>
          </div>

          <div>
            <Label>Syllabus</Label>
            <div className="mt-1 bg-white">
              {/* This part remains the same, but it will now use the dynamic version */}
              <TiptapEditor content={syllabusContent} onUpdate={setSyllabusContent} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" name="duration" type="number" defaultValue={initialQuizData?.duration || 25} />
            </div>
            <div>
              <Label htmlFor="total-marks">Total Marks</Label>
              <Input id="total-marks" name="total_marks" type="number" defaultValue={initialQuizData?.total_marks || 25} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Settings</Button>
        </div>
      </form>
    </div>
  )
}