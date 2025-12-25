import { create } from "zustand";

export type InterviewState = {
  questions: { question: string; difficulty?: string }[];
  currentQuestionIndex: number;
  responses: Record<string, string>;
};

export type InterviewActions = {
  setQuestions: (questions: { question: string; difficulty?: string }[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setResponse: (questionId: string, response: string) => void;
};

export const useInterviewStore = create<InterviewState & InterviewActions>((set) => ({
  questions: [],
  currentQuestionIndex: 0,
  responses: {},
  setQuestions: (questions) => set({ questions, currentQuestionIndex: 0 }),
  setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex }),
  setResponse: (questionId, response) =>
    set((state) => ({
      responses: {
        ...state.responses,
        [questionId]: response,
      },
    })),
}));
