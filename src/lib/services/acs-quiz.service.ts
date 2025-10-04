import axios from 'axios'
import { ApiEndpoints } from '@/lib/api/api-endpoints'

export interface Class {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  name: string;
  class_id: number;
}

export interface Subject {
  id: number;
  name: string;
  class_id: number;
  course_id: number;
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

  getAllCourses: async (): Promise<Course[]> => {
    try {
      const response = await axios.get(`${ApiEndpoints.courses.getAll}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching courses:', error)
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

  getSubjectsByCourse: async (courseId: number): Promise<Subject[]> => {
    try {
      const response = await axios.get(`${ApiEndpoints.subjects.getByCourseId}${courseId}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching subjects by course:', error)
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
      // Assuming a new endpoint for quiz modules will be created or fetched differently
      // For now, returning an empty array or mock data
      return []
    } catch (error) {
      console.error('Error fetching quiz modules:', error)
      throw error
    }
  },
}