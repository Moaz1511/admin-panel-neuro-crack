'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileQuestion, Search, Loader2, Edit, Plus } from 'lucide-react'
import { useAcsQuiz } from '@/lib/hooks/use-acs-quiz'
import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useRouter } from 'next/navigation'

export default function SelectQuizPage() {
  const [selectedClass, setSelectedClass] = useState<number | ''>('')
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('')
  const [selectedSubject, setSelectedSubject] = useState<number | ''>('')
  const [selectedChapter, setSelectedChapter] = useState<string>('')
  const [hasSearched, setHasSearched] = useState(false)

  const {
    classes,
    courses,
    subjects,
    chapters,
    quizModules,
    isLoadingClasses,
    isLoadingCourses,
    isLoadingSubjects,
    isLoadingChapters,
    isLoadingQuizModules,
    fetchCoursesByClass,
    fetchSubjectsByCourse,
    fetchChaptersBySubject,
    fetchQuizModules,
  } = useAcsQuiz()

  const router = useRouter()

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = parseInt(e.target.value)
    setSelectedClass(classId)
    setSelectedCourse('')
    setSelectedSubject('')
    setSelectedChapter('')
    setHasSearched(false)
    fetchCoursesByClass(classId)
  }

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = parseInt(e.target.value)
    setSelectedCourse(courseId)
    setSelectedSubject('')
    setSelectedChapter('')
    setHasSearched(false)
    fetchSubjectsByCourse(courseId)
  }

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = parseInt(e.target.value)
    setSelectedSubject(subjectId)
    setSelectedChapter('')
    setHasSearched(false)
    fetchChaptersBySubject(subjectId)
  }

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChapter(e.target.value)
    setHasSearched(false) // Reset search when chapter changes
  }

  const handleSearch = async () => {
    if (selectedChapter) {
      await fetchQuizModules(selectedChapter)
      setHasSearched(true)
    }
  }

  const handleCreateNew = () => {
    if (selectedChapter) {
      // Navigate to the editor page with a 'new' identifier and the chapterId
      router.push(`/create-quiz/new?chapterId=${selectedChapter}`)
    }
  }

  // Filter for quiz-type modules
  const filteredQuizModules = quizModules.filter((module) => module.type === 3)

  return (
    <div className="w-full mx-auto px-4 py-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 rounded-xl bg-primary/10">
          <FileQuestion className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-md font-bold">Select Quiz Module</h1>
          <p className="text-muted-foreground text-xs">Find an existing quiz to edit or create a new one.</p>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Dropdowns */}
          <select onChange={handleClassChange} value={selectedClass} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="" disabled>{isLoadingClasses ? 'Loading...' : 'Select Class'}</option>
            {classes.map((cls) => (<option key={cls.id} value={cls.id}>{cls.name}</option>))}
          </select>
          <select onChange={handleCourseChange} value={selectedCourse} disabled={!selectedClass} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="" disabled>{isLoadingCourses ? 'Loading...' : 'Select Course'}</option>
            {courses.map((course) => (<option key={course.id} value={course.id}>{course.name}</option>))}
          </select>
          <select onChange={handleSubjectChange} value={selectedSubject} disabled={!selectedCourse} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="" disabled>{isLoadingSubjects ? 'Loading...' : 'Select Subject'}</option>
            {subjects.map((subject) => (<option key={subject.id} value={subject.id}>{subject.name}</option>))}
          </select>
          <select onChange={handleChapterChange} value={selectedChapter} disabled={!selectedSubject} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="" disabled>{isLoadingChapters ? 'Loading...' : 'Select Chapter'}</option>
            {chapters.map((chapter) => (<option key={chapter.id} value={chapter.id}>{chapter.name}</option>))}
          </select>

          <Button onClick={handleSearch} disabled={!selectedChapter || isLoadingQuizModules}>
            {isLoadingQuizModules ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
            Search
          </Button>
        </div>

        {selectedChapter && (
           <Button onClick={handleCreateNew} className="mt-4">
             <Plus className="h-4 w-4 mr-2" />
             Create New Quiz for this Chapter
           </Button>
        )}

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
                          <Button variant="outline" onClick={() => router.push(`/create-quiz/${module.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
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
                <DotLottieReact src="https://lottie.host/020000e5-1292-4f75-8ce9-66798f9fbe31/2wCk2ssV9m.lottie" loop autoplay />
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-4">No existing quiz found for this chapter.</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}