import { QueryDocumentSnapshot } from "firebase/firestore";

export interface Subjects {
  name: string;
  desc: string;
  createdAt: number;
  teacher: string;
}

export const subjectConverter = {
  toFirestore: (data: Subjects) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Subjects,
};
