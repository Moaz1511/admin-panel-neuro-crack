// src/components/features/quiz/quiz-settings-form.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Calendar } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // Import Datepicker styles

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
}

export function QuizSettingsForm({ moduleId: _moduleId, chapterId }: QuizSettingsFormProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(new Date())
  const [syllabusContent, setSyllabusContent] = useState('')
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const formJson = Object.fromEntries(formData.entries());
    console.log('Form Data:', formJson);

    // Simulate API call to create a new quiz/module
    // In a real application, this would be an actual API call (e.g., axios.post('/api/quizzes', formJson))
    const newModuleId = `quiz-${Date.now()}`;

    router.push(`/create-quiz/${newModuleId}${chapterId ? `?chapterId=${chapterId}` : ''}`)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Module &amp; Exam Settings</h1>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Switch id="show-title" defaultChecked />
              <Label htmlFor="show-title">Show title for students</Label>
            </div>
            <div className="flex items-center space-x-4">
              <Switch id="is-live" defaultChecked />
              <Label htmlFor="is-live">Live</Label>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Selected Type</Label>
              <RadioGroup defaultValue="quiz" className="mt-2 flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="live" id="type-live" disabled />
                  <Label htmlFor="type-live">LIVE</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="type-pdf" disabled />
                  <Label htmlFor="type-pdf">PDF</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quiz" id="type-quiz" />
                  <Label htmlFor="type-quiz">QUIZ</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Right Column (Placeholder for Notification settings) */}
          <div className="grid gap-4 p-4 bg-muted/50 rounded-xl">
            <h3 className="font-semibold">Notification Settings</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="pre-class-notif">Pre-Class Notification</Label>
              <Switch id="pre-class-notif" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ongoing-class-notif">Ongoing-Class Notification</Label>
              <Switch id="ongoing-class-notif" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="post-class-notif">Post-Class Notification</Label>
              <Switch id="post-class-notif" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Module Title</Label>
            <Input id="title" name="title" type="text" placeholder="e.g., অধ্যায় ২: সেট ও ফাংশন" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Add a short description for this module" />
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
            <Input id="instructions" placeholder="e.g., instruction1, instruction2, instruction3" />
            <p className="text-sm text-muted-foreground mt-1">Write in comma-separated format.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Switch id="negative-marking" />
            <Label htmlFor="negative-marking">Negative Marking</Label>
          </div>
          <div className="flex items-center space-x-4">
            <Switch id="shuffle-questions" />
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
              <Input id="duration" type="number" defaultValue={25} />
            </div>
            <div>
              <Label htmlFor="total-marks">Total Marks</Label>
              <Input id="total-marks" type="number" defaultValue={25} />
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