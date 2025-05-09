'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { FileQuestion, Plus, Trash2 } from 'lucide-react'

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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl bg-primary/10">
          <FileQuestion className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Create New Quiz</h1>
          <p className="text-muted-foreground">Add questions and configure your quiz settings</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input id="title" placeholder="Enter quiz title..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Enter quiz description..." />
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Questions</h2>
            <Button onClick={addQuestion} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="p-6 rounded-xl border bg-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 mr-4">
                  <Label htmlFor={`question-${questionIndex}`}>Question {questionIndex + 1}</Label>
                  <Input
                    id={`question-${questionIndex}`}
                    value={question.question}
                    onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                    placeholder="Enter your question..."
                    className="mt-2"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(questionIndex)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid gap-4">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-4">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                    />
                    <Button
                      variant={question.correctAnswer === optionIndex ? 'default' : 'outline'}
                      onClick={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                      className="w-24"
                    >
                      {question.correctAnswer === optionIndex ? 'Correct' : 'Mark'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button variant="outline">Save as Draft</Button>
          <Button>Publish Quiz</Button>
        </div>
      </div>
    </div>
  )
} 