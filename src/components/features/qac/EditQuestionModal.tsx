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
import { uploadService } from '@/lib/api/services/uploadService';

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
    option_text: z.string().optional().or(z.literal('')),
    is_correct: z.boolean(),
    image_type: z.enum(["link", "file"]).optional(),
    option_image_url: z.string().optional().nullable(),
    image_file: z.any().optional(),
    video_type: z.enum(["link", "file"]).optional(),
    option_video_url: z.string().optional().nullable(),
    video_file: z.any().optional(),
    audio_type: z.enum(["link", "file"]).optional(),
    option_audio_url: z.string().optional().nullable(),
    audio_file: z.any().optional(),
});

const editSchema = z.object({
  question_text: z.string().optional().nullable(),
  uddipok: z.string().optional().nullable(),
  question_image_type: z.enum(["link", "file"]).optional(),
  question_image_url: z.union([z.string(), z.any()]).optional().nullable(),
  question_video_type: z.enum(["link", "file"]).optional(),
  question_video_url: z.union([z.string(), z.any()]).optional().nullable(),
  question_audio_type: z.enum(["link", "file"]).optional(),
  question_audio_url: z.union([z.string(), z.any()]).optional().nullable(),
  difficulty_level: z.string().optional().nullable(),
  reference: z.string().optional().nullable(),
  explanation: z.string().optional().nullable(),
  explanation_image_type: z.enum(["link", "file"]).optional(),
  explanation_image_url: z.union([z.string(), z.any()]).optional().nullable(),
  explanation_video_type: z.enum(["link", "file"]).optional(),
  explanation_video_url: z.union([z.string(), z.any()]).optional().nullable(),
  explanation_audio_type: z.enum(["link", "file"]).optional(),
  explanation_audio_url: z.union([z.string(), z.any()]).optional().nullable(),
  hint: z.string().optional().nullable(),
  hint_image_type: z.enum(["link", "file"]).optional(),
  hint_image_url: z.union([z.string(), z.any()]).optional().nullable(),
  hint_video_type: z.enum(["link", "file"]).optional(),
  hint_video_url: z.union([z.string(), z.any()]).optional().nullable(),
  hint_audio_type: z.enum(["link", "file"]).optional(),
  hint_audio_url: z.union([z.string(), z.any()]).optional().nullable(),
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
        if (!isOpen) {
            methods.reset();
        }
    }, [isOpen]);

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
          question_image_url: question.question_image_url,
          question_video_url: question.question_video_url,
          question_audio_url: question.question_audio_url,
          explanation_image_url: question.explanation?.[0]?.explanation_image_url,
          explanation_video_url: question.explanation?.[0]?.explanation_video_url,
          explanation_audio_url: question.explanation?.[0]?.explanation_audio_url,
          hint_image_url: question.hint?.[0]?.hint_image_url,
          hint_video_url: question.hint?.[0]?.hint_video_url,
          hint_audio_url: question.hint?.[0]?.hint_audio_url,
        });

        if (question.question_image_url) {
          methods.setValue('question_image_type', 'link');
        }
        if (question.question_video_url) {
          methods.setValue('question_video_type', 'link');
        }
        if (question.question_audio_url) {
          methods.setValue('question_audio_type', 'link');
        }

        if (question.explanation?.[0]?.explanation_image_url) {
          methods.setValue('explanation_image_type', 'link');
        }
        if (question.explanation?.[0]?.explanation_video_url) {
          methods.setValue('explanation_video_type', 'link');
        }
        if (question.explanation?.[0]?.explanation_audio_url) {
          methods.setValue('explanation_audio_type', 'link');
        }

        if (question.hint?.[0]?.hint_image_url) {
          methods.setValue('hint_image_type', 'link');
        }
        if (question.hint?.[0]?.hint_video_url) {
          methods.setValue('hint_video_type', 'link');
        }
        if (question.hint?.[0]?.hint_audio_url) {
          methods.setValue('hint_audio_type', 'link');
        }

        if (question.type === 'mcq') {
          (question.options as QuestionOption[]).forEach((option, index) => {
            if (option.option_image_url) {
              methods.setValue(`options.${index}.image_type`, 'link');
            }
            if (option.option_video_url) {
                methods.setValue(`options.${index}.video_type`, 'link');
            }
            if (option.option_audio_url) {
                methods.setValue(`options.${index}.audio_type`, 'link');
            }
          });
        }
      }
    }, [question, isOpen]);

  const handleFormSubmit = async (data: EditFormValues) => {
    try {
        const questionType = question?.type || 'mcq'; // Get context from question type

        let questionImageUrl = data.question_image_url;
        if (data.question_image_type === 'file') {
             if (data.question_image_url && data.question_image_url.length > 0 && data.question_image_url[0]) {
                questionImageUrl = await uploadService.uploadFile(data.question_image_url[0], questionType);
             } else {
                // If type is file but no file selected, keeping the old value might be risky if the user intended to clear it, 
                // but usually in this UI flow it implies replacing. 
                // However, if the field value is NOT a string (i.e. it's a FileList), we shouldn't send it.
                if (typeof data.question_image_url !== 'string') {
                    questionImageUrl = null; // Or undefined, to not update? But here we overwrite.
                }
             }
        }
        
        let questionVideoUrl = data.question_video_url;
        if (data.question_video_type === 'file') {
             if (data.question_video_url && data.question_video_url.length > 0 && data.question_video_url[0]) {
                questionVideoUrl = await uploadService.uploadFile(data.question_video_url[0], questionType);
             } else if (typeof data.question_video_url !== 'string') {
                 questionVideoUrl = null;
             }
        }

        let questionAudioUrl = data.question_audio_url;
         if (data.question_audio_type === 'file') {
             if (data.question_audio_url && data.question_audio_url.length > 0 && data.question_audio_url[0]) {
                questionAudioUrl = await uploadService.uploadFile(data.question_audio_url[0], questionType);
             } else if (typeof data.question_audio_url !== 'string') {
                 questionAudioUrl = null;
             }
        }

        let explanationImageUrl = data.explanation_image_url;
         if (data.explanation_image_type === 'file') {
             if (data.explanation_image_url && data.explanation_image_url.length > 0 && data.explanation_image_url[0]) {
                explanationImageUrl = await uploadService.uploadFile(data.explanation_image_url[0], questionType);
             } else if (typeof data.explanation_image_url !== 'string') {
                 explanationImageUrl = null;
             }
        }

        let explanationVideoUrl = data.explanation_video_url;
         if (data.explanation_video_type === 'file') {
             if (data.explanation_video_url && data.explanation_video_url.length > 0 && data.explanation_video_url[0]) {
                explanationVideoUrl = await uploadService.uploadFile(data.explanation_video_url[0], questionType);
             } else if (typeof data.explanation_video_url !== 'string') {
                 explanationVideoUrl = null;
             }
        }

        let explanationAudioUrl = data.explanation_audio_url;
         if (data.explanation_audio_type === 'file') {
             if (data.explanation_audio_url && data.explanation_audio_url.length > 0 && data.explanation_audio_url[0]) {
                explanationAudioUrl = await uploadService.uploadFile(data.explanation_audio_url[0], questionType);
             } else if (typeof data.explanation_audio_url !== 'string') {
                 explanationAudioUrl = null;
             }
        }

        let hintImageUrl = data.hint_image_url;
         if (data.hint_image_type === 'file') {
             if (data.hint_image_url && data.hint_image_url.length > 0 && data.hint_image_url[0]) {
                hintImageUrl = await uploadService.uploadFile(data.hint_image_url[0], questionType);
             } else if (typeof data.hint_image_url !== 'string') {
                 hintImageUrl = null;
             }
        }

        let hintVideoUrl = data.hint_video_url;
         if (data.hint_video_type === 'file') {
             if (data.hint_video_url && data.hint_video_url.length > 0 && data.hint_video_url[0]) {
                hintVideoUrl = await uploadService.uploadFile(data.hint_video_url[0], questionType);
             } else if (typeof data.hint_video_url !== 'string') {
                 hintVideoUrl = null;
             }
        }

        let hintAudioUrl = data.hint_audio_url;
         if (data.hint_audio_type === 'file') {
             if (data.hint_audio_url && data.hint_audio_url.length > 0 && data.hint_audio_url[0]) {
                hintAudioUrl = await uploadService.uploadFile(data.hint_audio_url[0], questionType);
             } else if (typeof data.hint_audio_url !== 'string') {
                 hintAudioUrl = null;
             }
        }


        const { correctAnswerIndex, ...restData } = data;
        
        // Process options to upload files if needed
        const processedOptions = await Promise.all(data.options?.map(async (opt, index) => {
            let optionImageUrl = opt.option_image_url;
             if (opt.image_type === 'file') {
                if (opt.image_file && opt.image_file.length > 0 && opt.image_file[0]) {
                    optionImageUrl = await uploadService.uploadFile(opt.image_file[0], questionType);
                } else if (typeof opt.image_file !== 'string') {
                    optionImageUrl = null;
                }
             }

            let optionVideoUrl = opt.option_video_url;
             if (opt.video_type === 'file') {
                if (opt.video_file && opt.video_file.length > 0 && opt.video_file[0]) {
                    optionVideoUrl = await uploadService.uploadFile(opt.video_file[0], questionType);
                } else if (typeof opt.video_file !== 'string') {
                    optionVideoUrl = null;
                }
             }

            let optionAudioUrl = opt.option_audio_url;
             if (opt.audio_type === 'file') {
                if (opt.audio_file && opt.audio_file.length > 0 && opt.audio_file[0]) {
                    optionAudioUrl = await uploadService.uploadFile(opt.audio_file[0], questionType);
                } else if (typeof opt.audio_file !== 'string') {
                    optionAudioUrl = null;
                }
             }

            return {
                ...opt,
                is_correct: String(index) === correctAnswerIndex,
                option_image_url: optionImageUrl,
                option_video_url: optionVideoUrl,
                option_audio_url: optionAudioUrl,
            };
        }) || []);

        const saveData = {
            id: question?.id,
            type: question?.type,
            topic_id: question?.topic_id,
            ...restData,
            question_image_url: questionImageUrl,
            question_video_url: questionVideoUrl,
            question_audio_url: questionAudioUrl,
            explanation_image_url: explanationImageUrl,
            explanation_video_url: explanationVideoUrl,
            explanation_audio_url: explanationAudioUrl,
            hint_image_url: hintImageUrl,
            hint_video_url: hintVideoUrl,
            hint_audio_url: hintAudioUrl,
            options: processedOptions,
            explanation: data.explanation ? [{ 
                explanation_text: data.explanation,
                explanation_image_url: explanationImageUrl,
                explanation_video_url: explanationVideoUrl,
                explanation_audio_url: explanationAudioUrl,
            }] : [],
            hint: data.hint ? [{ 
                hint_text: data.hint,
                hint_image_url: hintImageUrl,
                hint_video_url: hintVideoUrl,
                hint_audio_url: hintAudioUrl,
            }] : [],
        };
        onSave(saveData);
        onClose();
    } catch (error) {
        console.error("Error preparing form data:", error);
        // You might want to show a toast here
    }
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
          <form onSubmit={methods.handleSubmit(handleFormSubmit, (errors) => console.error("Validation Errors:", errors))} className="max-h-[80vh] overflow-y-auto p-1">
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
                                    <Input {...methods.register(`question_image_url`)} placeholder="Image Link" />
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
                                    <Input {...methods.register(`question_video_url`)} placeholder="Video Link" />
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
                                    <Input {...methods.register(`question_audio_url`)} placeholder="Audio Link" />
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
                                                    <Input {...methods.register(`options.${index}.option_image_url`)} placeholder="Image Link" />
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
                                                    <Input {...methods.register(`options.${index}.option_video_url`)} placeholder="Video Link" />
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
                                                    <Input {...methods.register(`options.${index}.option_audio_url`)} placeholder="Audio Link" />
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
                                    {methods.watch(`explanation_image_type`) === 'link' && (<Input {...methods.register(`explanation_image_url`)} placeholder="Image Link" />)}
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
                                    {methods.watch(`explanation_video_type`) === 'link' && (<Input {...methods.register(`explanation_video_url`)} placeholder="Video Link" />)}
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
                                    {methods.watch(`explanation_audio_type`) === 'link' && (<Input {...methods.register(`explanation_audio_url`)} placeholder="Audio Link" />)}
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
                                    {methods.watch(`hint_image_type`) === 'link' && (<Input {...methods.register(`hint_image_url`)} placeholder="Image Link" />)}
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
                                    {methods.watch(`hint_video_type`) === 'link' && (<Input {...methods.register(`hint_video_url`)} placeholder="Video Link" />)}
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
                                    {methods.watch(`hint_audio_type`) === 'link' && (<Input {...methods.register(`hint_audio_url`)} placeholder="Audio Link" />)}
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



