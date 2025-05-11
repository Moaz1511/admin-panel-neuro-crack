import { useState, useCallback } from 'react'
import { AcsQuizService, Course, Subject, Chapter, QuizModule } from '../services/acs-quiz.service'
import { AppConstants } from '../utils/app-constants'
import { toast } from 'sonner'
import React from 'react'
import { CircleAlert } from 'lucide-react'

// Define valid class values
type ClassValue = '6' | '7' | '8' | '9' | '10'

interface UseAcsQuizReturn {
  courses: Course[]
  subjects: Subject[]
  chapters: Chapter[]
  quizModules: QuizModule[]
  isLoadingCourses: boolean
  isLoadingSubjects: boolean
  isLoadingChapters: boolean
  isLoadingQuizModules: boolean
  error: string | null
  fetchCoursesByClass: (classValue: ClassValue) => Promise<void>
  fetchSubjectsByCourse: (courseId: string) => Promise<void>
  fetchChaptersBySubject: (subjectId: string) => Promise<void>
  fetchQuizModules: (chapterId: string) => Promise<void>
}

export function useAcsQuiz(): UseAcsQuizReturn {
  const [courses, setCourses] = useState<Course[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [quizModules, setQuizModules] = useState<QuizModule[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)
  const [isLoadingChapters, setIsLoadingChapters] = useState(false)
  const [isLoadingQuizModules, setIsLoadingQuizModules] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const showErrorToast = (message: string) => {
    toast(message, {
      icon: React.createElement(CircleAlert, {
        className: "text-red-500",
        size: 20
      }),
      style: { color: 'black' }
    })
  }

  const fetchCoursesByClass = useCallback(async (classValue: ClassValue) => {
    setIsLoadingCourses(true)
    setError(null)
    try {
      const classKey = `class${classValue}` as keyof typeof AppConstants.subjectIds
      const classId = AppConstants.subjectIds[classKey]
      console.log('classId', classId)
      const coursesData = await AcsQuizService.getCoursesByClass(classId)
      setCourses(coursesData)
    } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Failed to fetch courses')
      showErrorToast('Something went wrong!')
    } finally {
      setIsLoadingCourses(false)
    }
  }, [])

  const fetchSubjectsByCourse = useCallback(async (courseId: string) => {
    setIsLoadingSubjects(true)
    setError(null)
    try {
      const subjectsData = await AcsQuizService.getSubjectsByCourse(courseId)
      setSubjects(subjectsData)
    } catch (err) {
    //   const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subjects'
    //   setError(errorMessage)
      showErrorToast('Something went wrong!')
    } finally {
      setIsLoadingSubjects(false)
    }
  }, [])

  const fetchChaptersBySubject = useCallback(async (subjectId: string) => {
    setIsLoadingChapters(true)
    setError(null)
    try {
      const chaptersData = await AcsQuizService.getChaptersBySubject(subjectId)
      setChapters(chaptersData)
    } catch (err) {
    //   const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chapters'
    //   setError(errorMessage)
      showErrorToast('Something went wrong!')
    } finally {
      setIsLoadingChapters(false)
    }
  }, [])

  const fetchQuizModules = useCallback(async (chapterId: string) => {
    setIsLoadingQuizModules(true)
    setError(null)
    try {
      const modulesData = await AcsQuizService.getQuizModules(chapterId)
      setQuizModules(modulesData)
    } catch (err) {
    //   const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quiz modules'
    //   setError(errorMessage)
      showErrorToast('Something went wrong!')
    } finally {
      setIsLoadingQuizModules(false)
    }
  }, [])

  return {
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
  }
} 