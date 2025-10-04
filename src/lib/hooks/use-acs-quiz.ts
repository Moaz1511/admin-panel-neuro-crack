import { useState, useCallback, useEffect } from 'react'
import { AcsQuizService, Course, Subject, Chapter, QuizModule, Class } from '../services/acs-quiz.service'
import { toast } from 'sonner'
import React from 'react'

import { CircleAlert } from 'lucide-react'

interface UseAcsQuizReturn {
  classes: Class[]
  courses: Course[]
  subjects: Subject[]
  chapters: Chapter[]
  quizModules: QuizModule[]
  isLoadingClasses: boolean
  isLoadingCourses: boolean
  isLoadingSubjects: boolean
  isLoadingChapters: boolean
  isLoadingQuizModules: boolean
  fetchCoursesByClass: (classId: number) => void
  fetchSubjectsByCourse: (courseId: number) => void
  fetchChaptersBySubject: (subjectId: number) => void
  fetchQuizModules: (chapterId: string) => Promise<void>
}

export function useAcsQuiz(): UseAcsQuizReturn {
  const [classes, setClasses] = useState<Class[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [quizModules, setQuizModules] = useState<QuizModule[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)
  const [isLoadingChapters, setIsLoadingChapters] = useState(false)
  const [isLoadingQuizModules, setIsLoadingQuizModules] = useState(false)

  const showErrorToast = (message: string) => {
    toast(message, {
      icon: React.createElement(CircleAlert, {
        className: "text-red-500",
        size: 20
      }),
      style: { color: 'black' }
    })
  }

  // Fetch all classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoadingClasses(true)
      try {
        const classesData = await AcsQuizService.getAllClasses()
        setClasses(classesData)
      } catch {
        showErrorToast('Failed to fetch classes')
      } finally {
        setIsLoadingClasses(false)
      }
    }
    fetchClasses()
  }, [])

  const fetchCoursesByClass = useCallback(async (classId: number) => {
    setIsLoadingCourses(true)
    try {
      const allCourses = await AcsQuizService.getAllCourses()
      const filteredCourses = allCourses.filter(course => course.class_id === classId)
      setCourses(filteredCourses)
    } catch {
      showErrorToast('Failed to fetch courses')
    } finally {
      setIsLoadingCourses(false)
    }
  }, [])

  const fetchSubjectsByCourse = useCallback(async (courseId: number) => {
    setIsLoadingSubjects(true)
    try {
      const allSubjects = await AcsQuizService.getAllSubjects()
      const filteredSubjects = allSubjects.filter(subject => subject.course_id === courseId)
      setSubjects(filteredSubjects)
    } catch {
      showErrorToast('Failed to fetch subjects')
    } finally {
      setIsLoadingSubjects(false)
    }
  }, [])

  const fetchChaptersBySubject = useCallback(async (subjectId: number) => {
    setIsLoadingChapters(true)
    try {
      const allChapters = await AcsQuizService.getAllChapters()
      const filteredChapters = allChapters.filter(chapter => chapter.subject_id === subjectId)
      setChapters(filteredChapters)
    } catch {
      showErrorToast('Failed to fetch chapters')
    } finally {
      setIsLoadingChapters(false)
    }
  }, [])

  const fetchQuizModules = useCallback(async (chapterId: string) => {
    setIsLoadingQuizModules(true)
    try {
      const modulesData = await AcsQuizService.getQuizModules(chapterId)
      setQuizModules(modulesData)
    } catch {
      showErrorToast('Failed to fetch quiz modules')
    } finally {
      setIsLoadingQuizModules(false)
    }
  }, [])

  return {
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
    fetchQuizModules
  }
}