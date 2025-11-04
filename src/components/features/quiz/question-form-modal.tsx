// src/components/features/quiz/question-form-modal.tsx

'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import TiptapEditor from '@/components/shared/tiptap-editor';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming you have a Checkbox component from shadcn-ui
import { Trash2, PlusCircle } from 'lucide-react';

// Define a more specific type for a question
interface Question {
  id?: string; // Optional for new questions
  type: 'mcq' | 'saq' | 'cq';
  title?: string; // For MCQ/SAQ
  uddipok?: string; // For CQ
  options?: string[]; // For MCQ
  correctAnswerIndex?: number; // For MCQ
  explanation?: string;
  hint?: string;
  sub_questions?: { question_text: string; answer_text: string }[]; // For CQ
}

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
  initialQuestion?: Question | null;
  quizType: string;
}

export function QuestionFormModal({ isOpen, onClose, onSave, initialQuestion, quizType }: QuestionFormModalProps) {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [explanation, setExplanation] = useState('');
  const [hint, setHint] = useState('');
  const [uddipok, setUddipok] = useState('');
  const [subQuestions, setSubQuestions] = useState([{ question_text: '', answer_text: '' }]);

  useEffect(() => {
    if (initialQuestion) {
        if (initialQuestion.type === 'cq') {
            setUddipok(initialQuestion.uddipok);
            setSubQuestions(initialQuestion.sub_questions.length ? initialQuestion.sub_questions : [{ question_text: '', answer_text: '' }]);
        } else {
            setTitle(initialQuestion.title);
            setOptions(initialQuestion.options.length ? initialQuestion.options : ['', '', '', '']);
            setCorrectAnswerIndex(initialQuestion.correctAnswerIndex);
            setExplanation(initialQuestion.explanation);
            setHint(initialQuestion.hint);
        }
    } else {
      // Reset form for new question
      setTitle('');
      setOptions(['', '', '', '']);
      setCorrectAnswerIndex(null);
      setExplanation('');
      setHint('');
      setUddipok('');
      setSubQuestions([{ question_text: '', answer_text: '' }]);
    }
  }, [initialQuestion, isOpen]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  }

  const removeOption = (indexToRemove: number) => {
    if (options.length <= 2) return; // Prevent removing options below a minimum
    setOptions(options.filter((_, index) => index !== indexToRemove));
  }

  const handleSubQuestionChange = (index: number, field: string, value: string) => {
    const newSubQuestions = [...subQuestions];
    newSubQuestions[index][field] = value;
    setSubQuestions(newSubQuestions);
  };

  const addSubQuestion = () => {
    setSubQuestions([...subQuestions, { question_text: '', answer_text: '' }]);
  }

  const removeSubQuestion = (indexToRemove: number) => {
    setSubQuestions(subQuestions.filter((_, index) => index !== indexToRemove));
  }

  const handleSave = () => {
    let questionData: Question;
    if (quizType === 'cq') {
        questionData = {
            ...(initialQuestion || {}),
            type: 'cq',
            uddipok,
            sub_questions: subQuestions,
        };
    } else {
        questionData = {
            ...(initialQuestion || {}),
            type: quizType as 'mcq' | 'saq',
            title,
            options: quizType === 'mcq' ? options : [],
            correctAnswerIndex: quizType === 'mcq' ? (correctAnswerIndex ?? 0) : -1,
            explanation,
            hint,
        };
    }
    onSave(questionData);
    onClose(); // Close the modal after saving
  };

  const renderMCQForm = () => (
    <>
        <div>
            <Label className="font-semibold">Question Title</Label>
            <TiptapEditor content={title} onUpdate={setTitle} />
        </div>
        <div>
            <Label className="font-semibold">Options</Label>
            <div className="space-y-4 mt-2">
            {options.map((option, index) => (
                <div key={index}>
                <div className="flex items-center gap-3 mb-2">
                    <Checkbox
                    id={`option-checkbox-${index}`}
                    checked={correctAnswerIndex === index}
                    onCheckedChange={() => setCorrectAnswerIndex(index)}
                    />
                    <Label htmlFor={`option-checkbox-${index}`}>Option {index + 1} (Correct Answer)</Label>
                    <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={() => removeOption(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
                <TiptapEditor content={option} onUpdate={(value) => handleOptionChange(index, value)} />
                </div>
            ))}
            </div>
            <Button variant="outline" size="sm" onClick={addOption} className="mt-4">
            Add Option
            </Button>
        </div>
        <div>
            <Label className="font-semibold">Explanation</Label>
            <TiptapEditor content={explanation} onUpdate={setExplanation} />
        </div>
        <div>
            <Label className="font-semibold">Hint</Label>
            <TiptapEditor content={hint} onUpdate={setHint} />
        </div>
    </>
  );

  const renderCQForm = () => (
    <>
        <div>
            <Label className="font-semibold">Uddipok (Stimulus)</Label>
            <TiptapEditor content={uddipok} onUpdate={setUddipok} />
        </div>
        <div>
            <Label className="font-semibold">Sub-questions</Label>
            <div className="space-y-4 mt-2">
                {subQuestions.map((sq, index) => (
                    <div key={index} className="border p-4 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <Label>Sub-question {index + 1}</Label>
                            <Button variant="ghost" size="icon" onClick={() => removeSubQuestion(index)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                        <Label className="font-semibold">Question</Label>
                        <TiptapEditor content={sq.question_text} onUpdate={(value) => handleSubQuestionChange(index, 'question_text', value)} />
                        <Label className="font-semibold mt-2">Answer</Label>
                        <TiptapEditor content={sq.answer_text} onUpdate={(value) => handleSubQuestionChange(index, 'answer_text', value)} />
                    </div>
                ))}
            </div>
            <Button variant="outline" size="sm" onClick={addSubQuestion} className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Sub-question
            </Button>
        </div>
    </>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{initialQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
          <DialogDescription>
            Use the rich text editor to add questions, options, and explanations, including mathematical formulas.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-6 space-y-6">
            {quizType === 'cq' ? renderCQForm() : renderMCQForm()}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Question</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}