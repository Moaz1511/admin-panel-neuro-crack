// src/app/(dashboard)/create-exam/[moduleId]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { ExamQuestionManager } from '@/components/features/exam/exam-question-manager';
import withAdminAuth from '@/components/shared/withAdminAuth';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequest } from '@/lib/api/api-caller'; // Assuming you have a getRequest function
import { baseUrl } from '@/lib/api/api-endpoints';

interface ExamDetails {
  topicIds: string[];
  // Add other exam properties if needed
}

function ManageExamQuestionsPage() {
  const params = useParams();
  const examId = params.moduleId as string;
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (examId) {
      const fetchExamDetails = async () => {
        setIsLoading(true);
        try {
          const response = await getRequest<{ data: ExamDetails }>(`${baseUrl}/api/exams/${examId}`);
          if (response.data && response.data.topicIds) {
            setTopicIds(response.data.topicIds);
          } else {
            setError('Exam data is missing topic IDs.');
          }
        } catch (err) {
          console.error("Failed to fetch exam details:", err);
          setError('Failed to load exam details. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchExamDetails();
    }
  }, [examId]);

  if (!examId) {
    return (
        <Card>
            <CardHeader><CardTitle>Error</CardTitle></CardHeader>
            <CardContent><p>Exam ID is missing. Please go back and select an exam.</p></CardContent>
        </Card>
    );
  }

  if (isLoading) {
    return (
        <Card>
            <CardHeader><CardTitle>Loading...</CardTitle></CardHeader>
            <CardContent><p>Loading exam details...</p></CardContent>
        </Card>
    );
  }

  if (error) {
    return (
        <Card>
            <CardHeader><CardTitle>Error</CardTitle></CardHeader>
            <CardContent><p>{error}</p></CardContent>
        </Card>
    );
  }
  
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 ease-in-out p-4 md:p-8 mt-0">
      <h1 className="text-2xl font-bold mb-4">Manage Exam Questions</h1>
      <div className="flex flex-col gap-8">
        <ExamQuestionManager examId={examId} topicIds={topicIds} />
      </div>
    </main>
  )
}

export default withAdminAuth(ManageExamQuestionsPage);
