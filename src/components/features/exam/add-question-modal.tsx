// E:\Developer\NeuroCrack\Work\admin-panel-neuro-crack-master\src\components\features\exam\add-question-modal.tsx

'use client'

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from '@/components/ui/input'; // 💡 Import Input for search
import { Skeleton } from '@/components/ui/skeleton'; // 💡 Import Skeleton for loading
import axios from 'axios';
import { Card } from '@/components/ui/card';
import QuillViewer from '@/components/shared/QuillViewer';
import { Question } from './types'; // 💡 Import shared types

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (questions: Question[]) => void;
  topicId: string;
  existingQuestions: Question[]; // 💡 Prop to check for duplicates
}

type AvailableQuestions = {
  mcq: Question[];
  cq: Question[];
  saq: Question[];
}

export function AddQuestionModal({ isOpen, onClose, onAdd, topicId, existingQuestions }: AddQuestionModalProps) {
  const [availableQuestions, setAvailableQuestions] = useState<AvailableQuestions>({ mcq: [], cq: [], saq: [] });
  // 💡 Use a single object for selections. Much cleaner.
  const [selectedToAdd, setSelectedToAdd] = useState<Record<string, Question>>({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const existingQuestionIds = useMemo(() => 
    new Set(existingQuestions.map(q => `${q.type}-${q.id}`))
  , [existingQuestions]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (topicId) {
        setLoading(true);
        try {
          const [mcqsRes, cqsRes, saqsRes] = await Promise.all([
            axios.get(`http://localhost:9000/api/questions/topic/${topicId}`),
            axios.get(`http://localhost:9000/api/cqs/topic/${topicId}`),
            axios.get(`http://localhost:9000/api/saqs/topic/${topicId}`),
          ]);
          setAvailableQuestions({
            mcq: mcqsRes.data.data.map((q: any) => ({ ...q, type: 'mcq' })),
            cq: cqsRes.data.data.map((q: any) => ({ ...q, type: 'cq' })),
            saq: saqsRes.data.data.map((q: any) => ({ ...q, type: 'saq' })),
          });
        } catch (error) {
          console.error('Error fetching questions:', error);
          // 💡 Consider adding a toast here
        } finally {
          setLoading(false);
        }
      }
    };
    if (isOpen) {
      fetchQuestions();
    }
  }, [topicId, isOpen]);

  // 💡 Memoize filtered questions for performance
  const filteredMcqs = useMemo(() =>
    availableQuestions.mcq.filter(q =>
      q.question_text?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [availableQuestions.mcq, searchTerm]);

  const filteredCqs = useMemo(() =>
    availableQuestions.cq.filter(q =>
      q.uddipok?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [availableQuestions.cq, searchTerm]);
  
  const filteredSaqs = useMemo(() =>
    availableQuestions.saq.filter(q =>
      q.question_text?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [availableQuestions.saq, searchTerm]);

  const handleAdd = () => {
    onAdd(Object.values(selectedToAdd));
    onClose();
    setSelectedToAdd({}); // Clear selection after adding
  };

  const handleToggleSelectAll = (type: 'mcq' | 'cq' | 'saq', checked: boolean) => {
    const filteredQuestions = { mcq: filteredMcqs, cq: filteredCqs, saq: filteredSaqs }[type];
    setSelectedToAdd(prev => {
      const next = { ...prev };
      for (const q of filteredQuestions) {
        const key = `${q.type}-${q.id}`;
        if (existingQuestionIds.has(key)) continue; // Don't select disabled items

        if (checked) {
          next[key] = q;
        } else {
          delete next[key];
        }
      }
      return next;
    });
  };

  const handleToggleQuestion = (q: Question, checked: boolean) => {
    const key = `${q.type}-${q.id}`;
    setSelectedToAdd(prev => {
      const next = { ...prev };
      if (checked) {
        next[key] = q;
      } else {
        delete next[key];
      }
      return next;
    });
  };

  const renderLoadingSkeletons = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-start space-x-4">
            <Skeleton className="h-6 w-6 rounded" />
            <div className="space-y-3 w-full">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderQuestionList = (questions: Question[]) => (
    <div className="space-y-4">
      {questions.map((q: Question) => {
        const key = `${q.type}-${q.id}`;
        const isSelected = !!selectedToAdd[key];
        const isExisting = existingQuestionIds.has(key);
        return (
          <Card key={key} className={`p-4 ${isExisting ? 'opacity-60 bg-muted/50' : ''}`}>
            <div className="flex items-start space-x-4">
              <Checkbox
                id={`add-${key}`}
                checked={isSelected || isExisting} // 💡 Check if selected or already exists
                disabled={isExisting} // 💡 Disable if already in exam
                onCheckedChange={(checked) => handleToggleQuestion(q, !!checked)}
              />
              <Collapsible className="w-full">
                <CollapsibleTrigger asChild>
                  <div className={`flex-grow cursor-pointer ${isExisting ? 'cursor-not-allowed' : ''}`}>
                    <QuillViewer content={q.type === 'cq' ? q.uddipok : q.question_text} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 space-y-2 text-sm text-muted-foreground">
                    <p><strong>Difficulty:</strong> {q.difficulty_level || q.difficulty}</p>
                    <p><strong>Reference:</strong></p>
                    <QuillViewer content={q.reference} />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Questions</DialogTitle>
          <DialogDescription>Select questions to add to the exam.</DialogDescription>
        </DialogHeader>
        
        <div className="mb-4">
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-grow overflow-y-auto pr-6 space-y-6">
          <Tabs defaultValue="mcq">
            <TabsList>
              <TabsTrigger value="mcq">MCQs ({filteredMcqs.length})</TabsTrigger>
              <TabsTrigger value="cq">CQs ({filteredCqs.length})</TabsTrigger>
              <TabsTrigger value="saq">SAQs ({filteredSaqs.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="mcq">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="select-all-mcq"
                  onCheckedChange={(checked) => handleToggleSelectAll('mcq', !!checked)}
                />
                <label htmlFor="select-all-mcq">Select All (Filtered)</label>
              </div>
              {loading ? renderLoadingSkeletons() : renderQuestionList(filteredMcqs)}
            </TabsContent>
            <TabsContent value="cq">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="select-all-cq"
                  onCheckedChange={(checked) => handleToggleSelectAll('cq', !!checked)}
                />
                <label htmlFor="select-all-cq">Select All (Filtered)</label>
              </div>
              {loading ? renderLoadingSkeletons() : renderQuestionList(filteredCqs)}
            </TabsContent>
            <TabsContent value="saq">
               <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="select-all-saq"
                  onCheckedChange={(checked) => handleToggleSelectAll('saq', !!checked)}
                />
                <label htmlFor="select-all-saq">Select All (Filtered)</label>
              </div>
              {loading ? renderLoadingSkeletons() : renderQuestionList(filteredSaqs)}
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd} disabled={Object.keys(selectedToAdd).length === 0}>
            Add {Object.keys(selectedToAdd).length} Selected Questions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}