// src/app/(dashboard)/create-quiz/[moduleId]/page.tsx

'use client'

import React from 'react';
import { QuizSettingsForm } from '@/components/features/quiz/quiz-settings-form'
import { QuestionManager } from '@/components/features/quiz/question-manager'
import { Separator } from '@/components/ui/separator'
import { useSearchParams } from 'next/navigation'

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

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <QuizSettingsForm moduleId={params.moduleId} chapterId={chapterId} />
        <Separator />
        {params.moduleId !== 'new' && <QuestionManager moduleId={params.moduleId} />}
      </div>
    </div>
  )
}