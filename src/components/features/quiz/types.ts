export interface Question {
  id?: string;
  type: 'mcq' | 'saq' | 'cq';
  title?: string;
  uddipok?: string;
  options?: string[];
  correctAnswerIndex?: number;
  explanation?: string;
  hint?: string;
  sub_questions?: { question_text: string; answer_text: string }[];
}
