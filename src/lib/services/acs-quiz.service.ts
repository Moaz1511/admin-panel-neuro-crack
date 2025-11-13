import axios from 'axios'
import { ApiEndpoints } from '@/lib/api/api-endpoints'

export interface Class {
  id: number;
  name: string;
}

export interface Program {
  id: number;
  name: string;
  class_id: number;
}

export interface Group {
  id: number;
  name: string;
  class_id: number;
  program_id: number;
}

export interface Subject {
  id: number;
  name: string;
  group_id: number;
}

export interface Chapter {
  id: number;
  name: string;
  subject_id: number;
}

export interface QuizModule {
  id: string
  name: string
  type: number
}

export const AcsQuizService = {
  getAllClasses: async (): Promise<Class[]> => {
    try {
      const response = await axios.get(`${ApiEndpoints.classes.getAll}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching classes:', error)
      throw error
    }
  },

  getAllPrograms: async (): Promise<Program[]> => {
    try {
      const response = await axios.get(`${ApiEndpoints.programs.getAll}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching programs:', error)
      throw error
    }
  },

  getAllGroups: async (): Promise<Group[]> => {
    try {
      const response = await axios.get(`${ApiEndpoints.groups.getAll}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching groups:', error)
      throw error
    }
  },

  getGroupsByClass: async (classId: number): Promise<Group[]> => {
    try {
      const response = await axios.get(`${ApiEndpoints.groups.getByClassId}${classId}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching groups by class:', error)
      throw error
    }
  },

  getAllSubjects: async (): Promise<Subject[]> => {
    try {
      const response = await axios.get(`${ApiEndpoints.subjects.getAll}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching subjects:', error)
      throw error
    }
  },

  getSubjectsByGroup: async (groupId: number): Promise<Subject[]> => {
    try {
      const response = await axios.get(`${ApiEndpoints.subjects.getByGroupId}${groupId}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching subjects by group:', error)
      throw error
    }
  },

  getAllChapters: async (): Promise<Chapter[]> => {
    try {
      const response = await axios.get(`${ApiEndpoints.chapters.getAll}`)
      return response.data.data || []
    }  catch (error) {
      console.error('Error fetching chapters:', error)
      throw error
    }
  },

  getQuizModules: async (chapterId: string): Promise<QuizModule[]> => {
    try {
      console.log('Fetching quiz modules for chapter:', chapterId)
      const response = await axios.get(`${ApiEndpoints.quizzes.getByChapterId}${chapterId}`)
      const quizzes = response.data.data || []
      return quizzes.map((quiz: any) => ({
        id: quiz.id.toString(),
        name: quiz.title,
        type: 3,
      }));
    } catch (error) {
      console.error('Error fetching quiz modules:', error)
      throw error
    }
  },
}