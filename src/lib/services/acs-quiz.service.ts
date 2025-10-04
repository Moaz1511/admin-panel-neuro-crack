import { ApiEndpoints } from '../api/api-endpoints'
import axios from 'axios'

export interface Course {
  id: string
  name: string
}

export interface Subject {
  id: string
  tagid: number
  name: string
  devremarks: string
  serial: number
  data: {
    iconUrl: string
  }
  parent_id: null | string
  description: null | string
  is_active: boolean
  month: null | string
  status: null | string
  free_content_available: boolean
  tagtype: number
  type: string
}

export interface Chapter {
  id: string
  name: string
  description?: string
}

export interface QuizModule {
  id: string
  name: string
  createdat: string
  updatedat: string
  courseid: string
  isActive: boolean
  data: {
    thumbnail?: string
    notesPdfLink?: string
    numberOfPages?: string
  } | null
  type: number
  show_title: boolean
  course_id_2: string | null
  is_locked: boolean
  demo_course_only: boolean | null
  tagtype: number
  moduleTagId: string
  serial: number | null
}

export class AcsQuizService {
  private static readonly headers = {
    'x-api-key': process.env.NEXT_PUBLIC_PARTNER_API_KEY || ''
  }

  static async getCoursesByClass(classId: string): Promise<Course[]> {
    try {
      console.log('Debug Info:', {
        classId,
        apiKey: process.env.NEXT_PUBLIC_PARTNER_API_KEY,
        baseUrl: ApiEndpoints.acsQuiz.getCourses,
        fullUrl: `${ApiEndpoints.acsQuiz.getCourses}${classId}`,
        headers: this.headers
      })

      const response = await axios.get(
        `${ApiEndpoints.acsQuiz.getCourses}${classId}`,
        { 
          headers: { 
            'x-api-key': process.env.NEXT_PUBLIC_PARTNER_API_KEY
          }
        }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  static async getSubjectsByCourse(courseId: string): Promise<Subject[]> {
    try {
      const response = await axios.get(
        `${ApiEndpoints.acsQuiz.getSubjects}${courseId}`,
        { 
          headers: { 
            'x-api-key': process.env.NEXT_PUBLIC_PARTNER_API_KEY 
          }
        }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  static async getChaptersBySubject(subjectId: string): Promise<Chapter[]> {
    try {
      const response = await axios.get(
        `${ApiEndpoints.acsQuiz.getChapters}${subjectId}`,
        { 
          headers: { 
            'x-api-key': process.env.NEXT_PUBLIC_PARTNER_API_KEY 
          }
        }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  static async getQuizModules(chapterId: string): Promise<QuizModule[]> {
    try {
      const response = await axios.get(
        `${ApiEndpoints.acsQuiz.getQuizModules}${chapterId}`,
        { 
          headers: { 
            'x-api-key': process.env.NEXT_PUBLIC_PARTNER_API_KEY 
          }
        }
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private static handleError(error: any): Error {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      headers: error.config?.headers,
      url: error.config?.url
    })

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return new Error('Invalid or missing API key. Please check your environment configuration.')
      }
      return new Error(error.response?.data?.message || 'An error occurred while fetching data')
    }
    return new Error('An unexpected error occurred')
  }
}