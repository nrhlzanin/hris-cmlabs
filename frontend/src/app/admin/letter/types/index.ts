type HistoryItem = {
  date: string;
  status: 'Approved' | 'Accepted' | 'Decline' | 'Waiting Reviewed' | 'Done' | string;
  description?: string;
  actor?: string; 
};

export type Letter = {
  id: number;
  name:string;
  letterName: string;
  letterType: string;
  validUntil: string;
  status: 'Waiting Reviewed' | 'Approved' | 'Decline';
  history: HistoryItem[];
};

export type LetterType = {
    id: number;
    name: string;
    content: string;
}