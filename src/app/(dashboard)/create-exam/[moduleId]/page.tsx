// src/app/(dashboard)/create-quiz/[moduleId]/page.tsx

'use client'

import React, { useState, useEffect } from 'react';
import { QuizSettingsForm } from '@/components/features/quiz/quiz-settings-form'
import { QuestionManager } from '@/components/features/quiz/question-manager'
import { Separator } from '@/components/ui/separator'
import { useSearchParams } from 'next/navigation'
import axios from 'axios';
import { ApiEndpoints } from '@/lib/api/api-endpoints';

// 1. Define a clear interface for the page's props
interface EditQuizPageProps {
  params: {
    moduleId: string;
  };
}

// 2. Use the new interface and ensure there is NO 'async' keyword
export default function EditQuizPage({ params: initialParams }: EditQuizPageProps) {
  const params = React.use(initialParams);
  const searchParams = useSearchParams()
  const chapterId = searchParams.get('chapterId')
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [quizType, setQuizType] = useState('mcq');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.moduleId !== 'new') {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`${ApiEndpoints.quizzes.getById}${params.moduleId}`);
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
  }, [params.moduleId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <QuizSettingsForm moduleId={params.moduleId} chapterId={chapterId} initialQuizData={quiz} quizType={quizType} setQuizType={setQuizType} />
        <Separator />
        {params.moduleId !== 'new' && <QuestionManager moduleId={params.moduleId} initialQuestions={questions} setQuestions={setQuestions} quizType={quizType} />}
      </div>
    </div>
  )
}