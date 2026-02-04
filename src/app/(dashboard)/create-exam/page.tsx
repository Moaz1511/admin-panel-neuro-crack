'use client'

import { useRouter } from 'next/navigation';
import { ExamSettingsForm } from '@/components/features/exam/exam-settings-form';
import withAdminAuth from '@/components/shared/withAdminAuth';

function CreateExamPage() {
  const router = useRouter();

  const handleNext = (id: string, newTopicIds: string[]) => {
    // Construct the URL without topicIds
    router.push(`/create-exam/${id}`);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 ease-in-out p-4 md:p-8 mt-0">
      <h1 className="text-2xl font-bold mb-4">Create Exam</h1>
      <div className="flex flex-col gap-8">
        <ExamSettingsForm onNext={handleNext} />
      </div>
    </main>
  );
}

export default withAdminAuth(CreateExamPage);