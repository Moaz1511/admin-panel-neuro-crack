'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { FileQuestion, Plus, Search, Trash2, Loader2 } from 'lucide-react'
import { useAcsQuiz } from '@/lib/hooks/use-acs-quiz'
import { QuizModule } from '@/lib/services/acs-quiz.service'

type ClassValue = '6' | '7' | '8' | '9' | '10'

export default function CreateQuizPage() {
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }])
  const [selectedClass, setSelectedClass] = useState<ClassValue | ''>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedChapter, setSelectedChapter] = useState<string>('')
  
  const {
    courses,
    subjects,
    chapters,
    quizModules,
    isLoadingCourses,
    isLoadingSubjects,
    isLoadingChapters,
    isLoadingQuizModules,
    error,
    fetchCoursesByClass,
    fetchSubjectsByCourse,
    fetchChaptersBySubject,
    fetchQuizModules
  } = useAcsQuiz()

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: string, value: string | number) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ClassValue
    if (value) {
      setSelectedClass(value)
      // Clear dependent selections
      setSelectedCourse('')
      setSelectedSubject('')
      setSelectedChapter('')
      fetchCoursesByClass(value)
    }
  }

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value) {
      setSelectedCourse(value)
      // Clear dependent selections
      setSelectedSubject('')
      setSelectedChapter('')
      fetchSubjectsByCourse(value)
    }
  }

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value) {
      setSelectedSubject(value)
      setSelectedChapter('')
      fetchChaptersBySubject(value)
    }
  }

  const handleSearch = async () => {
    if (selectedChapter) {
      await fetchQuizModules(selectedChapter)
    }
  }

  // Filter quiz modules with tagtype 4
  const filteredQuizModules = quizModules.filter(module => module.type === 3)

  return (
    <div className="w-full mx-auto px-4 py-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 rounded-xl bg-primary/10">
          <FileQuestion className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-md font-bold">Create New Quiz</h1>
          <p className="text-muted-foreground text-xs">Add questions and configure your quiz settings</p>
        </div>
      </div>

      {/* dropdown selection area */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-3">
          {/* Class Selection */}
          <div className="relative flex-1">
            <select 
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedClass}
              onChange={handleClassChange}
            >
              <option value="" disabled>Select Class</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>
          </div>
          
          {/* Course Selection */}
          <div className="relative flex-1">
            <select 
              id="course-select"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCourse}
              onChange={handleCourseChange}
              disabled={!selectedClass}
            >
              <option value="">{isLoadingCourses ? 'Loading courses...' : 'Select Course'}</option>
              {!isLoadingCourses && courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Subject Selection */}
          <div className="relative flex-1">
            <select 
              id="subject-select"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedSubject}
              onChange={handleSubjectChange}
              disabled={!selectedCourse}
            >
              <option value="">{isLoadingSubjects ? 'Loading subjects...' : 'Select Subject'}</option>
              {!isLoadingSubjects && subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Chapter Selection */}
          <div className="relative flex-1">
            <select 
              id="chapter-select"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              disabled={!selectedSubject}
            >
              <option value="">{isLoadingChapters ? 'Loading chapters...' : 'Select Chapter'}</option>
              {!isLoadingChapters && chapters.map(chapter => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1">
            <Button 
              className={`h-10 w-full ${!selectedChapter ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'} text-white`}
              onClick={handleSearch}
              disabled={!selectedChapter || isLoadingQuizModules}
            >
              {isLoadingQuizModules ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching quiz...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Quiz
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Quiz Modules Table */}
        {filteredQuizModules.length > 0 ? (
          <div className="mt-8">
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium">Serial No</th>
                    <th className="py-3 px-4 text-left font-medium">Quiz Title</th>
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuizModules.map((module, index) => (
                    <tr key={module.id} className="border-t">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{module.name}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => {/* TODO: Handle add questions */}}
                        >
                          <Plus className="h-4 w-4" />
                          Add Questions
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-8 py-12 flex items-center justify-center">
            <div className="text-center p-6 rounded-lg bg-muted/30">
              <p className="text-lg font-medium text-muted-foreground">No active quiz found!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 