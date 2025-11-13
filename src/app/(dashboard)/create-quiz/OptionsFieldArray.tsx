import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileUpload } from '@/components/ui/file-upload';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const QuillEditor = dynamic(
  () => import('@/components/shared/QuillEditor'),
  { ssr: false }
);

export function OptionsFieldArray({ nestIndex }: { nestIndex: number }) {
  const { control, watch, setValue, register } = useFormContext();
  const { fields, remove, append } = useFieldArray({
    control,
    name: `questions.${nestIndex}.options`
  });

  return (
    <div>
      <Controller
        control={control}
        name={`questions.${nestIndex}.correctAnswerIndex`}
        render={({ field }) => (
          <RadioGroup onValueChange={field.onChange} value={field.value}>
            {fields.map((item, k) => {
              return (
                <div key={item.id} className="p-4 border rounded-md space-y-4">
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value={k.toString()} />
                    <div className="flex-grow">
                      <QuillEditor
                        content={watch(`questions.${nestIndex}.options.${k}.text`) as string}
                        onUpdate={(value) => setValue(`questions.${nestIndex}.options.${k}.text`, value)}
                      />
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(k)}>Remove Option</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label>Image</label>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value: "link" | "file") => setValue(`questions.${nestIndex}.options.${k}.image_type`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                        {watch(`questions.${nestIndex}.options.${k}.image_type`) === 'link' && (
                          <Input {...register(`questions.${nestIndex}.options.${k}.image_link`)} placeholder="Image Link" />
                        )}
                        {watch(`questions.${nestIndex}.options.${k}.image_type`) === 'file' && (
                          <FileUpload onUpload={(filePath) => setValue(`questions.${nestIndex}.options.${k}.image_file`, filePath)} />
                        )}
                      </div>
                    </div>
                    <div>
                      <label>Video</label>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value: "link" | "file") => setValue(`questions.${nestIndex}.options.${k}.video_type`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                        {watch(`questions.${nestIndex}.options.${k}.video_type`) === 'link' && (
                          <Input {...register(`questions.${nestIndex}.options.${k}.video_link`)} placeholder="Video Link" />
                        )}
                        {watch(`questions.${nestIndex}.options.${k}.video_type`) === 'file' && (
                          <FileUpload onUpload={(filePath) => setValue(`questions.${nestIndex}.options.${k}.video_file`, filePath)} />
                        )}
                      </div>
                    </div>
                    <div>
                      <label>Audio</label>
                      <div className="flex items-center space-x-2">
                        <Select onValueChange={(value: "link" | "file") => setValue(`questions.${nestIndex}.options.${k}.audio_type`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                        {watch(`questions.${nestIndex}.options.${k}.audio_type`) === 'link' && (
                          <Input {...register(`questions.${nestIndex}.options.${k}.audio_link`)} placeholder="Audio Link" />
                        )}
                        {watch(`questions.${nestIndex}.options.${k}.audio_type`) === 'file' && (
                          <FileUpload onUpload={(filePath) => setValue(`questions.${nestIndex}.options.${k}.audio_file`, filePath)} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        )}
      />
      <Button type="button" onClick={() => append({ text: '' })}>
        Add Option
      </Button>
    </div>
  );
}