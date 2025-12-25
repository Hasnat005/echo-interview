export type RoleEnum = "candidate" | "recruiter";
export type InterviewStatusEnum = "pending" | "in_progress" | "completed";

type Json = Record<string, any>;

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          role: RoleEnum;
          organization_id: string | null;
        };
        Insert: {
          id: string;
          role: RoleEnum;
          organization_id?: string | null;
        };
        Update: {
          id?: string;
          role?: RoleEnum;
          organization_id?: string | null;
        };
      };
      jobs: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          description: string | null;
          requirements: Json | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          description?: string | null;
          requirements?: Json | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          title?: string;
          description?: string | null;
          requirements?: Json | null;
        };
      };
      interviews: {
        Row: {
          id: string;
          job_id: string;
          candidate_id: string;
          status: InterviewStatusEnum;
          overall_score: number | null;
        };
        Insert: {
          id?: string;
          job_id: string;
          candidate_id: string;
          status: InterviewStatusEnum;
          overall_score?: number | null;
        };
        Update: {
          id?: string;
          job_id?: string;
          candidate_id?: string;
          status?: InterviewStatusEnum;
          overall_score?: number | null;
        };
      };
      questions: {
        Row: {
          id: string;
          job_id: string;
          text: string;
          difficulty: string | null;
        };
        Insert: {
          id?: string;
          job_id: string;
          text: string;
          difficulty?: string | null;
        };
        Update: {
          id?: string;
          job_id?: string;
          text?: string;
          difficulty?: string | null;
        };
      };
      responses: {
        Row: {
          id: string;
          interview_id: string;
          question_id: string;
          response_text: string | null;
          ai_feedback: Json | null;
        };
        Insert: {
          id?: string;
          interview_id: string;
          question_id: string;
          response_text?: string | null;
          ai_feedback?: Json | null;
        };
        Update: {
          id?: string;
          interview_id?: string;
          question_id?: string;
          response_text?: string | null;
          ai_feedback?: Json | null;
        };
      };
    };
  };
};

// Convenience row types
export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type Interview = Database["public"]["Tables"]["interviews"]["Row"];
export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type Response = Database["public"]["Tables"]["responses"]["Row"];
