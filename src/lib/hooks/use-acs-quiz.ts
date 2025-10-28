import { useState, useCallback, useEffect } from 'react'
import { AcsQuizService, Program, Group, Subject, Chapter, QuizModule, Class } from '../services/acs-quiz.service'
import { toast } from 'sonner'
import React from 'react'

import { CircleAlert } from 'lucide-react'

interface UseAcsQuizReturn {
  classes: Class[]
  programs: Program[]
  groups: Group[]
  subjects: Subject[]
  chapters: Chapter[]
  quizModules: QuizModule[]
  isLoadingClasses: boolean
  isLoadingPrograms: boolean
  isLoadingGroups: boolean
  isLoadingSubjects: boolean
  isLoadingChapters: boolean
  isLoadingQuizModules: boolean
  fetchProgramsByClass: (classId: number) => void
  fetchGroupsByProgram: (programId: number) => void
  fetchSubjectsByGroup: (groupId: number) => void
  fetchChaptersBySubject: (subjectId: number) => void
  fetchQuizModules: (chapterId: string) => Promise<void>
}

export function useAcsQuiz(): UseAcsQuizReturn {
  const [classes, setClasses] = useState<Class[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [quizModules, setQuizModules] = useState<QuizModule[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false)
  const [isLoadingGroups, setIsLoadingGroups] = useState(false)
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

  const fetchProgramsByClass = useCallback(async (classId: number) => {
    setIsLoadingPrograms(true)
    try {
      const allPrograms = await AcsQuizService.getAllPrograms()
      const filteredPrograms = allPrograms.filter(program => program.class_id === classId)
      setPrograms(filteredPrograms)
    } catch {
      showErrorToast('Failed to fetch programs')
    } finally {
      setIsLoadingPrograms(false)
    }
  }, [])

  const fetchGroupsByProgram = useCallback(async (programId: number) => {
    setIsLoadingGroups(true)
    try {
      const allGroups = await AcsQuizService.getAllGroups()
      const filteredGroups = allGroups.filter(group => group.program_id === programId)
      setGroups(filteredGroups)
    } catch {
      showErrorToast('Failed to fetch groups')
    } finally {
      setIsLoadingGroups(false)
    }
  }, [])

  const fetchSubjectsByGroup = useCallback(async (groupId: number) => {
    setIsLoadingSubjects(true)
    try {
      const allSubjects = await AcsQuizService.getAllSubjects()
      const filteredSubjects = allSubjects.filter(subject => subject.group_id === groupId)
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
    programs,
    groups,
    subjects,
    chapters,
    quizModules,
    isLoadingClasses,
    isLoadingPrograms,
    isLoadingGroups,
    isLoadingSubjects,
    isLoadingChapters,
    isLoadingQuizModules,
    fetchProgramsByClass,
    fetchGroupsByProgram,
    fetchSubjectsByGroup,
    fetchChaptersBySubject,
    fetchQuizModules
  }
}