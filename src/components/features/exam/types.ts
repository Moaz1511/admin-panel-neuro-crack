// E:\Developer\NeuroCrack\Work\admin-panel-neuro-crack-master\src\components\features\exam\types.ts

export interface McqOption {
  option_text: string;
  is_correct: boolean;
}

export interface BaseQuestion {
  id: number;
  reference: string;
  difficulty_level?: string; // For MCQ
  difficulty?: string;     // For CQ/SAQ
}

export interface McqQuestion extends BaseQuestion {
  type: 'mcq';
  question_text: string;
  options: McqOption[];
}

export interface CqQuestion extends BaseQuestion {
  type: 'cq';
  uddipok: string;
  // cqs usually have sub-questions (a, b, c, d)
  // You might want to add them here
}

export interface SaqQuestion extends BaseQuestion {
  type: 'saq';
  question_text: string;
}

// A union type for any question
export type Question = McqQuestion | CqQuestion | SaqQuestion;