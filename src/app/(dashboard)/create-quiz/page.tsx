'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { FileQuestion, Plus, Search, Trash2 } from 'lucide-react'

export default function CreateQuizPage() {
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }])

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
          <div className="relative flex-1">
            <select 
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue=""
              onChange={(e) => {
                // Update the selected class and enable the course dropdown
                const selectedClass = e.target.value;
                if (selectedClass) {
                  const courseSelect = document.getElementById('course-select') as HTMLSelectElement;
                  if (courseSelect) courseSelect.disabled = false;
                }
              }}
            >
              <option value="" disabled>Select Class</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>
          </div>
          
          <div className="relative flex-1">
            <select 
              id="course-select"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue=""
              disabled
              onChange={(e) => {
                // Update the selected course and enable the subject dropdown
                const selectedCourse = e.target.value;
                if (selectedCourse) {
                  const subjectSelect = document.getElementById('subject-select') as HTMLSelectElement;
                  if (subjectSelect) subjectSelect.disabled = false;
                }
              }}
            >
              <option value="" disabled>Select Course</option>
              <option value="science">Science</option>
              <option value="math">Mathematics</option>
              <option value="english">English</option>
              <option value="social">Social Studies</option>
            </select>
          </div>
          
          <div className="relative flex-1">
            <select 
              id="subject-select"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue=""
              disabled
              onChange={(e) => {
                // Update the selected subject and enable the chapter dropdown
                const selectedSubject = e.target.value;
                if (selectedSubject) {
                  const chapterSelect = document.getElementById('chapter-select') as HTMLSelectElement;
                  if (chapterSelect) chapterSelect.disabled = false;
                }
              }}
            >
              <option value="" disabled>Select Subject</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
            </select>
          </div>
          
          <div className="relative flex-1">
            <select 
              id="chapter-select"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue=""
              disabled
            >
              <option value="" disabled>Select Chapter</option>
              <option value="chapter1">Chapter 1</option>
              <option value="chapter2">Chapter 2</option>
              <option value="chapter3">Chapter 3</option>
            </select>
          </div>

          <div className="relative flex-1">
            <Button 
              className="h-10 w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Quiz
            </Button>
          </div>
        </div>
      </div>
      
{/* add sections */}
    
      
    </div>
  )
} 