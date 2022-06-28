export interface Feedback {
  data: {
    title: string;
    content: string;
  };
  is_bug: number;
  type: string;
}
