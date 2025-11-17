// src/components/features/quiz/question-manager.tsx

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { QuestionFormModal } from './question-form-modal'
import { getRequest, postRequest, putRequest, deleteRequest } from '@/lib/api/api-caller';
import { ApiEndpoints } from '@/lib/api/api-endpoints';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ... dnd-kit imports ...
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Question } from './types';

function hasId(q: Question): q is Question & { id: string } {
    return q.id !== undefined;
}


// A new component for a single sortable question item
function SortableQuestionItem({ q, index, onEdit, onDelete }: { q: Question; index: number; onEdit: (question: Question) => void; onDelete: (id: string, type: string) => void; }) {
  if (!q.id) {
    return null;
  }
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: q.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const renderQuestionContent = () => {
    switch (q.type) {
      case 'cq':
        return (
          <div>
            <div className="text-lg font-semibold" dangerouslySetInnerHTML={{ __html: q.uddipok || '' }} />
            {/* Render sub-questions here */}
          </div>
        );
      default:
        return (
          <div>
            <div className="text-lg font-semibold" dangerouslySetInnerHTML={{ __html: q.title || '' }} />
            <div className="space-y-3 mt-4">
              {q.options?.map((option, optionIndex) => (
                <div key={optionIndex} className={`flex items-center p-3 rounded-md ${q.correctAnswerIndex === optionIndex ? 'bg-green-100 border-green-400 border' : 'bg-muted/50'}`}>
                  <span className="mr-3 font-semibold">{optionIndex + 1}</span>
                  <div dangerouslySetInnerHTML={{ __html: option || '' }} />
                </div>
              ))}
            </div>
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h4 className="font-semibold mb-2">Explanation</h4>
              <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: q.explanation || '' }} />
            </div>
          </div>
        );
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center bg-muted/50 rounded-t-lg p-2 border-b">
        <div {...attributes} {...listeners} className="p-2 cursor-grab">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <span className="font-semibold text-sm">Question {index + 1} ({q.type.toUpperCase()})</span>
        <div className="ml-auto flex gap-2">
            <Button variant="outline" size="icon" onClick={() => onEdit(q)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="destructive" size="icon" onClick={() => onDelete(q.id!, q.type)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="p-6">
        {renderQuestionContent()}
      </div>
    </div>
  );
}


export function QuestionManager({ moduleId }: { moduleId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestionType, setNewQuestionType] = useState('mcq');
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    if (moduleId !== 'new') {
        const fetchQuestions = async () => {
            try {
                const response: any = await getRequest(`${ApiEndpoints.quizzes.getById}${moduleId}`);
                const quizData = response.data;
                const mcqs = (quizData.questions || []).map((q: any) => ({ ...q, type: 'mcq' }));
                const cqs = (quizData.cqs || []).map((c: any) => ({ ...c, type: 'cq' }));
                setQuestions([...mcqs, ...cqs]);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }
  }, [moduleId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = async (id: string, type: string) => {
    try {
        if (type === 'cq') {
            await deleteRequest(`${ApiEndpoints.quizzes.base}/${moduleId}/cqs/${id}`);
        } else {
            await deleteRequest(`${ApiEndpoints.quizzes.base}/${moduleId}/questions/${id}`);
        }
        setQuestions(questions.filter(q => q.id !== id));
    } catch (error) {
        console.error('Error deleting question:', error);
    }
  };

  const handleSaveQuestion = async (savedQuestion: Question) => {
    savedQuestion.type = editingQuestion ? editingQuestion.type : newQuestionType as any;
    if (savedQuestion.id) {
        // Update
        try {
            let response: any;
            if (savedQuestion.type === 'cq') {
                response = await putRequest(`${ApiEndpoints.quizzes.base}/${moduleId}/cqs/${savedQuestion.id}`, savedQuestion);
            } else {
                response = await putRequest(`${ApiEndpoints.quizzes.base}/${moduleId}/questions/${savedQuestion.id}`, savedQuestion);
            }
            setQuestions(questions.map(q => q.id === savedQuestion.id ? response : q));
        } catch (error) {
            console.error('Error updating question:', error);
        }
    } else {
        // Create
        try {
            let response: any;
            if (savedQuestion.type === 'cq') {
                response = await postRequest(`${ApiEndpoints.quizzes.base}/${moduleId}/cqs`, savedQuestion);
            } else {
                response = await postRequest(`${ApiEndpoints.quizzes.base}/${moduleId}/questions`, savedQuestion);
            }
            setQuestions([...questions, response]);
        } catch (error) {
            console.error('Error creating question:', error);
        }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Exam Questions</h1>
        <div className="flex gap-4">
            <Select onValueChange={setNewQuestionType} defaultValue="mcq">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="mcq">MCQ</SelectItem>
                    <SelectItem value="saq">SAQ</SelectItem>
                    <SelectItem value="cq">CQ</SelectItem>
                </SelectContent>
            </Select>
          <Button onClick={handleAddQuestion}><Plus className="h-4 w-4 mr-2" /> Add New Question</Button>
          <Button variant="outline">Import Questions</Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.filter(hasId)} strategy={verticalListSortingStrategy}>
          <div className="space-y-6">
            {questions.map((q, index) => (
              q.id ? <SortableQuestionItem 
                key={q.id} 
                q={q} 
                index={index} 
                onEdit={handleEditQuestion} 
                onDelete={handleDeleteQuestion} 
              /> : null
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <QuestionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        initialQuestion={editingQuestion}
        quizType={editingQuestion ? editingQuestion.type : newQuestionType}
      />
    </div>
  );
}