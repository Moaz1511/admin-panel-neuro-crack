// E:\Developer\NeuroCrack\Work\admin-panel-neuro-crack-master\src\components\features\exam\exam-question-manager.tsx

'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, GripVertical, Pencil, Trash2, Inbox } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableQuestionItem } from './sortable-question-item';
import { AddQuestionModal } from './add-question-modal';
import axios from 'axios';
import { toast } from 'sonner'; // 💡 Use toast for feedback, not alert
import { Question } from './types'; // 💡 Import shared types

interface ExamQuestionManagerProps {
  examId: string;
  topicId: string;
}

export function ExamQuestionManager({ examId, topicId }: ExamQuestionManagerProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // You would also fetch existing exam questions here on mount
    // e.g., fetchExamQuestions();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelectedQuestions((items) => {
        // 💡 **CRITICAL FIX**: Find index using the *same string ID* as dnd-kit
        const oldIndex = items.findIndex((item) => `${item.type}-${item.id}` === active.id);
        const newIndex = items.findIndex((item) => `${item.type}-${item.id}` === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleAddQuestions = (questions: Question[]) => {
    // Prevent adding duplicates
    const newQuestions = questions.filter(q => 
      !selectedQuestions.some(sq => sq.id === q.id && sq.type === q.type)
    );
    setSelectedQuestions([...selectedQuestions, ...newQuestions]);
  };

  const handleRemoveQuestion = (type: string, id: number) => {
    setSelectedQuestions(selectedQuestions.filter(q => !(q.type === type && q.id === id)));
  };

  const handleEditQuestion = (question: Question) => {
    // 💡 Implement your edit logic (e.g., open a different modal)
    console.log("Editing question:", question);
    toast.info(`Editing Question (${question.type.toUpperCase()} ID: ${question.id})`);
  };

  const handleSave = async () => {
    const data = {
      selected_mcqs: selectedQuestions.filter(q => q.type === 'mcq').map(q => q.id),
      selected_cqs: selectedQuestions.filter(q => q.type === 'cq').map(q => q.id),
      selected_saqs: selectedQuestions.filter(q => q.type === 'saq').map(q => q.id),
      // 💡 Send the ordered list of IDs for saving the order
      ordered_questions: selectedQuestions.map(q => ({ id: q.id, type: q.type })),
    };
    setIsSubmitting(true);
    try {
      await axios.put(`http://localhost:9000/api/exams/${examId}/questions`, data);
      toast.success('Exam questions updated successfully!'); // 💡 Better UX
    } catch (error) {
      console.error('Error updating exam questions:', error);
      toast.error('Error updating exam questions.'); // 💡 Better UX
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Exam Questions</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsModalOpen(true)}><Plus className="h-4 w-4 mr-2" /> Add New Question</Button>
          <Button variant="outline">Import Questions</Button>
        </div>
      </div>

      {isMounted && selectedQuestions.length > 0 && ( // 💡 Only show DND context if items exist
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={selectedQuestions.map(q => `${q.type}-${q.id}`)} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {selectedQuestions.map((q, index) => (
                <SortableQuestionItem
                  key={`${q.type}-${q.id}`}
                  id={`${q.type}-${q.id}`}
                  question={q}
                  index={index}
                  onRemove={handleRemoveQuestion}
                  onEdit={handleEditQuestion} // 💡 Pass edit handler
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* 💡 Empty State for better UX */}
      {isMounted && selectedQuestions.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
          <Inbox className="h-16 w-16 mb-4" />
          <h3 className="text-xl font-semibold">No questions added yet</h3>
          <p className="mb-4">Click "Add New Question" to get started.</p>
          <Button onClick={() => setIsModalOpen(true)}><Plus className="h-4 w-4 mr-2" /> Add New Question</Button>
        </div>
      )}

      <AddQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddQuestions}
        topicId={topicId}
        existingQuestions={selectedQuestions} // 💡 Pass existing questions to prevent duplicates
      />

      <div className="flex justify-end mt-8">
        <Button onClick={handleSave} disabled={isSubmitting || selectedQuestions.length === 0}>
          {isSubmitting ? 'Saving...' : 'Save Exam Questions'}
        </Button>
      </div>
    </Card>
  );
}