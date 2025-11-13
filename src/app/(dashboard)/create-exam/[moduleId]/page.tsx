// src/app/(dashboard)/create-exam/[moduleId]/page.tsx

'use client'

import React, { useState, useEffect } from 'react';
import { QuizSettingsForm } from '@/components/features/quiz/quiz-settings-form'
import { QuestionManager } from '@/components/features/quiz/question-manager'
import { Separator } from '@/components/ui/separator'
import { useSearchParams, useParams } from 'next/navigation'
import axios from 'axios';
import { ApiEndpoints } from '@/lib/api/api-endpoints';

// 2. Use the new interface
export default function CreateExamPage() {
  const params = useParams();
  const moduleId = params.moduleId as string;
  const searchParams = useSearchParams()
  const chapterId = searchParams.get('chapterId')
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [quizType, setQuizType] = useState('mcq');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (moduleId !== 'new') {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`${ApiEndpoints.quizzes.getById}${moduleId}`);
                setQuiz(response.data.data);
                setQuestions(response.data.data.questions || []);
                setQuizType(response.data.data.quiz_type || 'mcq');
            } catch (error) {
                console.error('Error fetching quiz:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    } else {
        setLoading(false);
    }
  }, [moduleId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <QuizSettingsForm moduleId={moduleId} chapterId={chapterId} initialQuizData={quiz} quizType={quizType} setQuizType={setQuizType} />
        <Separator />
        {moduleId !== 'new' && <QuestionManager moduleId={moduleId} />}
      </div>
    </div>
  )
}