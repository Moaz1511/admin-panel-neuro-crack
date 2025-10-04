'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileQuestion, Plus, Search, Loader2, Pencil, Check, Trash2, FilePenLine } from 'lucide-react'
import { useAcsQuiz } from '@/lib/hooks/use-acs-quiz'
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useRouter } from 'next/navigation'

type ClassValue = '6' | '7' | '8' | '9' | '10'

export default function CreateQuizPage() {
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }])
  const [selectedClass, setSelectedClass] = useState<ClassValue | ''>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedChapter, setSelectedChapter] = useState<string>('')
  const [hasSearched, setHasSearched] = useState(false)
  
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

  const router = useRouter();

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
      // Clear dependent selections and search state
      setSelectedCourse('')
      setSelectedSubject('')
      setSelectedChapter('')
      setHasSearched(false)
      fetchCoursesByClass(value)
    }
  }

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value) {
      setSelectedCourse(value)
      // Clear dependent selections and search state
      setSelectedSubject('')
      setSelectedChapter('')
      setHasSearched(false)
      fetchSubjectsByCourse(value)
    }
  }

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value) {
      setSelectedSubject(value)
      setSelectedChapter('')
      setHasSearched(false)
      fetchChaptersBySubject(value)
    }
  }

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedChapter(value)
    setHasSearched(false)
  }

  const handleSearch = async () => {
    if (selectedChapter) {
      await fetchQuizModules(selectedChapter)
      setHasSearched(true)
    }
  }

  // Filter quiz modules with type 3
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
              onChange={handleChapterChange}
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

        {/* Quiz Modules Table - Only show after search */}
        {hasSearched && (
          filteredQuizModules.length > 0 ? (
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
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-50 hover:bg-green-100"
                              title="Add quiz questions"
                              onClick={() => router.push(`/create-quiz/${module.id}`)}
                            >
                              <Plus className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 text-sm font-medium">Add Question</span>
                            </Button>
                            <Button
                              variant="ghost"
                              className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100"
                              title="Update quiz questions"
                              onClick={() => {/* TODO: Handle update */}}
                            >
                              <FilePenLine className="h-4 w-4 text-blue-600"/>
                              
                              <span className="text-blue-600 text-sm font-medium">Update</span>
                            </Button>
                            <Button
                              variant="ghost"
                              className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-50 hover:bg-red-100"
                              title="Delete quiz questions"
                              onClick={() => {/* TODO: Handle delete */}}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                              <span className="text-red-600 text-sm font-medium">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-8 py-12 flex flex-col items-center justify-center">
              <div className="w-64 h-64">
                <DotLottieReact
                  src="https://lottie.host/020000e5-1292-4f75-8ce9-66798f9fbe31/2wCk2ssV9m.lottie"
                  loop
                  autoplay
                />
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-4">No active quiz found!</p>
            </div>
          )
        )}
      </div>
    </div>
  )
} 