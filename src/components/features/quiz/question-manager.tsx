// src/components/features/quiz/question-manager.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, GripVertical, Pencil, Trash2 } from 'lucide-react'

// Imports for the new drag-and-drop library
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

// Define the types for our question structure
type Option = string;
interface Question {
  id: string;
  title: string;
  options: Option[];
  correctAnswerIndex: number;
  explanation: string;
}

// Dummy data to simulate existing questions
const initialQuestions: Question[] = [
    { id: 'q1', title: '<p>Q = { 1,a} হলে P(Q) নিচের কোনটি?</p>', options: ['{ 1,a}', '{ 1},{ a},{ 1,a}', '{{1}, {a}, {1,a}, ∅}', '{{1}, {a}, {1,a} {∅}}'], correctAnswerIndex: 2, explanation: '<p>The power set includes all subsets, including the empty set.</p>' },
    { id: 'q2', title: '<p>A = { 1,2,3}  হলে,  P(A)  এর উপাদান সংখ্যা কত?</p>', options: ['3', '7', '8', '9'], correctAnswerIndex: 2, explanation: '<p>The number of elements in the power set is 2^n, where n is the number of elements in the original set.</p>' },
];

// A new component for a single sortable question item
function SortableQuestionItem({ q, index }: { q: Question; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: q.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <div className="flex items-center bg-muted/50 rounded-t-lg p-2 border-b">
        <div {...attributes} {...listeners} className="p-2 cursor-grab">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <span className="font-semibold text-sm">Question {index + 1}</span>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="text-lg font-semibold" dangerouslySetInnerHTML={{ __html: q.title }} />
          <div className="flex gap-2">
            <Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
            <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="space-y-3">
          {q.options.map((option, optionIndex) => (
            <div
              key={optionIndex}
              className={`flex items-center p-3 rounded-md ${q.correctAnswerIndex === optionIndex ? 'bg-green-100 border-green-400 border' : 'bg-muted/50'}`}
            >
              <span className="mr-3 font-semibold">{optionIndex + 1}</span>
              <div dangerouslySetInnerHTML={{ __html: option }} />
            </div>
          ))}
        </div>
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <h4 className="font-semibold mb-2">Explanation</h4>
          <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: q.explanation }} />
        </div>
      </div>
    </div>
  );
}

export function QuestionManager({ moduleId: _moduleId }: { moduleId: string }) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  // TODO: Use moduleId to fetch actual questions for the module
  // For example:
  // useEffect(() => {
  //   if (moduleId) {
  //     fetchQuestions(moduleId).then(setQuestions);
  //   }
  // }, [moduleId]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
  
  const addQuestion = () => {
    const newQuestion: Question = {
        id: `q${new Date().getTime()}`,
        title: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
    };
    setQuestions([...questions, newQuestion]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Exam Questions</h1>
        <div className="flex gap-4">
          <Button onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Question
          </Button>
          <Button variant="outline">Import Questions</Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {questions.map((q, index) => (
              <SortableQuestionItem key={q.id} q={q} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}