// E:\Developer\NeuroCrack\Work\admin-panel-neuro-crack-master\src\components\features\exam\sortable-question-item.tsx

'use client'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import QuillViewer from '@/components/shared/QuillViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Question } from './types'; // 💡 Import shared types

interface SortableQuestionItemProps {
  id: string;
  question: Question;
  index: number;
  onRemove: (type: string, id: number) => void;
  onEdit: (question: Question) => void; // 💡 Add onEdit prop
}

export function SortableQuestionItem({ id, question, index, onRemove, onEdit }: SortableQuestionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'cq':
        return (
          <div>
            <h4 className="font-semibold mb-2">Uddipok (Stimulus)</h4>
            <QuillViewer content={question.uddipok} />
          </div>
        );
      case 'saq':
        return (
          <div>
            <QuillViewer content={question.question_text} />
          </div>
        );
      case 'mcq':
      default:
        return (
          <div>
            <QuillViewer content={question.question_text} />
            <div className="space-y-2 mt-4">
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className={`flex items-start p-2 rounded-md ${option.is_correct ? 'bg-green-100 border-green-400 border' : 'bg-muted/50'}`}>
                  <span className="mr-2 font-semibold">{String.fromCharCode(97 + optionIndex)}.</span>
                  <QuillViewer content={option.option_text} />
                </div>
              ))}
            </div>
          </div>
        );
    }
  }

  return (
    <Card ref={setNodeRef} style={style} className="mb-4 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-muted/50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="p-2 cursor-grab rounded-md hover:bg-accent">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-base font-semibold">
            Question {index + 1} <span className="font-normal text-muted-foreground">({question.type.toUpperCase()})</span>
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => onEdit(question)}> {/* 💡 Hook up edit button */}
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => onRemove(question.type, question.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {renderQuestionContent()}
      </CardContent>
    </Card>
  );
}