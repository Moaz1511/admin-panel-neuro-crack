'use client'

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';
import { ExamSettingsForm } from '@/components/features/exam/exam-settings-form';
import { ExamQuestionManager } from '@/components/features/exam/exam-question-manager';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  // ... schema for exam settings
});

export default function CreateExamPage() {
  const [step, setStep] = useState(1);
  const [examId, setExamId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);

  const handleNext = (id: string, topicId: string) => {
    setExamId(id);
    setTopicId(topicId);
    setStep(2);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 ease-in-out p-4 md:p-8 mt-0">
      <h1 className="text-2xl font-bold mb-4">Create Exam</h1>
      <div className="flex flex-col gap-8">
        {step === 1 && <ExamSettingsForm onNext={handleNext} />}
        {step === 2 && examId && topicId && <ExamQuestionManager examId={examId} topicId={topicId} />}
      </div>
    </main>
  );
}

