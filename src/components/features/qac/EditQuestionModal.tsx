'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Question, Option as QuestionOption } from '@/app/(dashboard)/qac/page'; // Renamed to avoid conflict
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const NewQuillEditor = dynamic(
  () => import('@/components/shared/NewQuillEditor'),
  { ssr: false }
);

interface EditQuestionModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const optionSchema = z.object({
    id: z.number().optional(),
    option_text: z.string().min(1, "Option text cannot be empty"),
    is_correct: z.boolean(),
    image_type: z.enum(["link", "file"]).optional(),
    image_link: z.string().optional(),
    image_file: z.any().optional(),
    video_type: z.enum(["link", "file"]).optional(),
    video_link: z.string().optional(),
    video_file: z.any().optional(),
    audio_type: z.enum(["link", "file"]).optional(),
    audio_link: z.string().optional(),
    audio_file: z.any().optional(),
});

const editSchema = z.object({
  question_text: z.string().optional().nullable(),
  uddipok: z.string().optional().nullable(),
  question_image_type: z.enum(["link", "file"]).optional(),
  question_image_link: z.string().optional().nullable(),
  question_image_url: z.string().optional().nullable(),
  question_video_type: z.enum(["link", "file"]).optional(),
  question_video_link: z.string().optional().nullable(),
  question_video_url: z.string().optional().nullable(),
  question_audio_type: z.enum(["link", "file"]).optional(),
  question_audio_link: z.string().optional().nullable(),
  question_audio_url: z.string().optional().nullable(),
  difficulty_level: z.string().optional().nullable(),
  reference: z.string().optional().nullable(),
  explanation: z.string().optional().nullable(),
  explanation_image_type: z.enum(["link", "file"]).optional(),
  explanation_image_link: z.string().optional().nullable(),
  explanation_image_url: z.string().optional().nullable(),
  explanation_video_type: z.enum(["link", "file"]).optional(),
  explanation_video_link: z.string().optional().nullable(),
  explanation_video_url: z.string().optional().nullable(),
  explanation_audio_type: z.enum(["link", "file"]).optional(),
  explanation_audio_link: z.string().optional().nullable(),
  explanation_audio_url: z.string().optional().nullable(),
  hint: z.string().optional().nullable(),
  hint_image_type: z.enum(["link", "file"]).optional(),
  hint_image_link: z.string().optional().nullable(),
  hint_image_url: z.string().optional().nullable(),
  hint_video_type: z.enum(["link", "file"]).optional(),
  hint_video_link: z.string().optional().nullable(),
  hint_video_url: z.string().optional().nullable(),
  hint_audio_type: z.enum(["link", "file"]).optional(),
  hint_audio_link: z.string().optional().nullable(),
  hint_audio_url: z.string().optional().nullable(),
  options: z.array(optionSchema).optional(),
  correctAnswerIndex: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

export function EditQuestionModal({
  question,
  isOpen,
  onClose,
  onSave,
}: EditQuestionModalProps) {
  const methods = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "options",
  });

    useEffect(() => {
      if (question) {
        const correctIndex = question.type === 'mcq' ? (question.options as QuestionOption[])?.findIndex(opt => opt.is_correct) : -1;

        methods.reset({
          ...question,
          uddipok: question.uddipok || '',
          explanation: question.explanation?.[0]?.explanation_text || '',
          hint: question.hint?.[0]?.hint_text || '',
          options: question.type === 'mcq' ? (question.options as QuestionOption[]) : [],
          correctAnswerIndex: correctIndex !== -1 ? String(correctIndex) : undefined,
        });

        if (question.question_image_link) {
          methods.setValue('question_image_type', 'link');
        }
      }
    }, [question, methods, question?.id]);

  const handleFormSubmit = (data: EditFormValues) => {
    const { correctAnswerIndex, ...restData } = data;
    const processedOptions = data.options?.map((opt, index) => ({
        ...opt,
        is_correct: String(index) === correctAnswerIndex,
    }));

    const saveData = {
        id: question?.id,
        type: question?.type,
        ...restData,
        options: processedOptions,
        explanation: data.explanation ? [{ explanation_text: data.explanation }] : [],
        hint: data.hint ? [{ hint_text: data.hint }] : [],
        question_image_link: data.question_image_link,
    };
    delete (saveData as any).question_image_url;
    onSave(saveData);
    onClose();
  };

  if (!question) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit {question.type.toUpperCase()} Question (ID: {question.id})</DialogTitle>
          <DialogDescription>
            Make changes to the question details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleFormSubmit, (errors) => console.error(errors))} className="max-h-[80vh] overflow-y-auto p-1">
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Question</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Controller
                            name={question.type === 'cq' ? 'uddipok' : 'question_text'}
                            control={methods.control}
                            render={({ field }) => (
                                <NewQuillEditor
                                    onUpdate={(value) => {
                                        if (typeof value === 'object' && value !== null) {
                                            field.onChange(JSON.stringify(value));
                                        } else {
                                            field.onChange(value);
                                        }
                                    }}
                                    content={field.value || ''}
                                />
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label>Question Image</label>
                                <div className="flex items-center space-x-2">
                                    <Select onValueChange={(value: "link" | "file") => methods.setValue(`question_image_type`, value)}>
                                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="link">Link</SelectItem>
                                        <SelectItem value="file">File</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    {methods.watch(`question_image_type`) === 'link' && (
                                    <Input {...methods.register(`question_image_link`)} placeholder="Image Link" />
                                    )}
                                    {methods.watch(`question_image_type`) === 'file' && (
                                    <Input type="file" {...methods.register(`question_image_url`)} />
                                    )}
                                </div>
                            </div>
                             <div>
                                <label>Question Video</label>
                                <div className="flex items-center space-x-2">
                                    <Select onValueChange={(value: "link" | "file") => methods.setValue(`question_video_type`, value)}>
                                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="link">Link</SelectItem>
                                        <SelectItem value="file">File</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    {methods.watch(`question_video_type`) === 'link' && (
                                    <Input {...methods.register(`question_video_link`)} placeholder="Video Link" />
                                    )}
                                    {methods.watch(`question_video_type`) === 'file' && (
                                    <Input type="file" {...methods.register(`question_video_url`)} />
                                    )}
                                </div>
                            </div>
                             <div>
                                <label>Question Audio</label>
                                <div className="flex items-center space-x-2">
                                    <Select onValueChange={(value: "link" | "file") => methods.setValue(`question_audio_type`, value)}>
                                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="link">Link</SelectItem>
                                        <SelectItem value="file">File</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    {methods.watch(`question_audio_type`) === 'link' && (
                                    <Input {...methods.register(`question_audio_link`)} placeholder="Audio Link" />
                                    )}
                                    {methods.watch(`question_audio_type`) === 'file' && (
                                    <Input type="file" {...methods.register(`question_audio_url`)} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="difficulty_level" className="font-semibold">Difficulty</label>
                                <Controller
                                    name="difficulty_level"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                                            <SelectTrigger><SelectValue placeholder="Select Difficulty" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Easy">Easy</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div>
                                <label htmlFor="reference" className="font-semibold">Reference</label>
                                <Controller name="reference" control={methods.control} render={({ field }) => (<NewQuillEditor onUpdate={(value) => {
                                    if (typeof value === 'object' && value !== null) {
                                        field.onChange(JSON.stringify(value));
                                    } else {
                                        field.onChange(value);
                                    }
                                }} content={field.value || ''} />)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

              {question.type === 'mcq' && (
                <Card>
                    <CardHeader><CardTitle>Options</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <RadioGroup value={methods.watch('correctAnswerIndex')} onValueChange={(value) => methods.setValue('correctAnswerIndex', value)}>
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-md space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Option {index + 1}</Label>
                                        <div className="flex items-center gap-x-2">
                                            <RadioGroupItem value={String(index)} id={`correct-opt-${index}`} />
                                            <Label htmlFor={`correct-opt-${index}`}>Correct</Label>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Controller
                                        name={`options.${index}.option_text`}
                                        control={methods.control}
                                        render={({ field }) => (
                                            <NewQuillEditor onUpdate={field.onChange} content={field.value || ''} />
                                        )}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label>Image</label>
                                            <div className="flex items-center space-x-2">
                                                <Select onValueChange={(value: "link" | "file") => methods.setValue(`options.${index}.image_type`, value)}>
                                                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="link">Link</SelectItem>
                                                        <SelectItem value="file">File</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {methods.watch(`options.${index}.image_type`) === 'link' && (
                                                    <Input {...methods.register(`options.${index}.image_link`)} placeholder="Image Link" />
                                                )}
                                                {methods.watch(`options.${index}.image_type`) === 'file' && (
                                                    <Input type="file" {...methods.register(`options.${index}.image_file`)} />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label>Video</label>
                                            <div className="flex items-center space-x-2">
                                                <Select onValueChange={(value: "link" | "file") => methods.setValue(`options.${index}.video_type`, value)}>
                                                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="link">Link</SelectItem>
                                                        <SelectItem value="file">File</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {methods.watch(`options.${index}.video_type`) === 'link' && (
                                                    <Input {...methods.register(`options.${index}.video_link`)} placeholder="Video Link" />
                                                )}
                                                {methods.watch(`options.${index}.video_type`) === 'file' && (
                                                    <Input type="file" {...methods.register(`options.${index}.video_file`)} />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label>Audio</label>
                                            <div className="flex items-center space-x-2">
                                                <Select onValueChange={(value: "link" | "file") => methods.setValue(`options.${index}.audio_type`, value)}>
                                                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="link">Link</SelectItem>
                                                        <SelectItem value="file">File</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {methods.watch(`options.${index}.audio_type`) === 'link' && (
                                                    <Input {...methods.register(`options.${index}.audio_link`)} placeholder="Audio Link" />
                                                )}
                                                {methods.watch(`options.${index}.audio_type`) === 'file' && (
                                                    <Input type="file" {...methods.register(`options.${index}.audio_file`)} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                        <Button type="button" variant="outline" onClick={() => append({ option_text: '', is_correct: false })}>
                            Add Option
                        </Button>
                    </CardContent>
                </Card>
              )}

                <Card>
                    <CardHeader><CardTitle>Additional Information</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label htmlFor="explanation" className="font-semibold">Explanation</label>
                            <Controller name="explanation" control={methods.control} render={({ field }) => (<NewQuillEditor onUpdate={(value) => {
                                if (typeof value === 'object' && value !== null) {
                                    field.onChange(JSON.stringify(value));
                                } else {
                                    field.onChange(value);
                                }
                            }} content={field.value || ''} />)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label>Explanation Image</label>
                                <div className="flex items-center space-x-2">
                                    <Select onValueChange={(value: "link" | "file") => methods.setValue(`explanation_image_type`, value)}>
                                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                        <SelectContent><SelectItem value="link">Link</SelectItem><SelectItem value="file">File</SelectItem></SelectContent>
                                    </Select>
                                    {methods.watch(`explanation_image_type`) === 'link' && (<Input {...methods.register(`explanation_image_link`)} placeholder="Image Link" />)}
                                    {methods.watch(`explanation_image_type`) === 'file' && (<Input type="file" {...methods.register(`explanation_image_url`)} />)}
                                </div>
                            </div>
                            <div>
                                <label>Explanation Video</label>
                                <div className="flex items-center space-x-2">
                                     <Select onValueChange={(value: "link" | "file") => methods.setValue(`explanation_video_type`, value)}>
                                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                        <SelectContent><SelectItem value="link">Link</SelectItem><SelectItem value="file">File</SelectItem></SelectContent>
                                    </Select>
                                    {methods.watch(`explanation_video_type`) === 'link' && (<Input {...methods.register(`explanation_video_link`)} placeholder="Video Link" />)}
                                    {methods.watch(`explanation_video_type`) === 'file' && (<Input type="file" {...methods.register(`explanation_video_url`)} />)}
                                </div>
                            </div>
                            <div>
                                <label>Explanation Audio</label>
                                <div className="flex items-center space-x-2">
                                     <Select onValueChange={(value: "link" | "file") => methods.setValue(`explanation_audio_type`, value)}>
                                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                        <SelectContent><SelectItem value="link">Link</SelectItem><SelectItem value="file">File</SelectItem></SelectContent>
                                    </Select>
                                    {methods.watch(`explanation_audio_type`) === 'link' && (<Input {...methods.register(`explanation_audio_link`)} placeholder="Audio Link" />)}
                                    {methods.watch(`explanation_audio_type`) === 'file' && (<Input type="file" {...methods.register(`explanation_audio_url`)} />)}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="hint" className="font-semibold">Hint</label>
                            <Controller name="hint" control={methods.control} render={({ field }) => (<NewQuillEditor onUpdate={(value) => {
                                if (typeof value === 'object' && value !== null) {
                                    field.onChange(JSON.stringify(value));
                                } else {
                                    field.onChange(value);
                                }
                            }} content={field.value || ''} />)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label>Hint Image</label>
                                <div className="flex items-center space-x-2">
                                    <Select onValueChange={(value: "link" | "file") => methods.setValue(`hint_image_type`, value)}>
                                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                        <SelectContent><SelectItem value="link">Link</SelectItem><SelectItem value="file">File</SelectItem></SelectContent>
                                    </Select>
                                    {methods.watch(`hint_image_type`) === 'link' && (<Input {...methods.register(`hint_image_link`)} placeholder="Image Link" />)}
                                    {methods.watch(`hint_image_type`) === 'file' && (<Input type="file" {...methods.register(`hint_image_url`)} />)}
                                </div>
                            </div>
                            <div>
                                <label>Hint Video</label>
                                <div className="flex items-center space-x-2">
                                     <Select onValueChange={(value: "link" | "file") => methods.setValue(`hint_video_type`, value)}>
                                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                        <SelectContent><SelectItem value="link">Link</SelectItem><SelectItem value="file">File</SelectItem></SelectContent>
                                    </Select>
                                    {methods.watch(`hint_video_type`) === 'link' && (<Input {...methods.register(`hint_video_link`)} placeholder="Video Link" />)}
                                    {methods.watch(`hint_video_type`) === 'file' && (<Input type="file" {...methods.register(`hint_video_url`)} />)}
                                </div>
                            </div>
                            <div>
                                <label>Hint Audio</label>
                                <div className="flex items-center space-x-2">
                                     <Select onValueChange={(value: "link" | "file") => methods.setValue(`hint_audio_type`, value)}>
                                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                        <SelectContent><SelectItem value="link">Link</SelectItem><SelectItem value="file">File</SelectItem></SelectContent>
                                    </Select>
                                    {methods.watch(`hint_audio_type`) === 'link' && (<Input {...methods.register(`hint_audio_link`)} placeholder="Audio Link" />)}
                                    {methods.watch(`hint_audio_type`) === 'file' && (<Input type="file" {...methods.register(`hint_audio_url`)} />)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            
            </div>
            <DialogFooter className="mt-6">
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}



