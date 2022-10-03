import { QueryDocumentSnapshot } from "firebase/firestore";

export interface Attendees {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  idNumber: string;
  timestamp: number;
}

export const attendeeConverter = {
  toFirestore: (data: Attendees) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Attendees,
};
