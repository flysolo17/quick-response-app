import { QueryDocumentSnapshot, serverTimestamp } from "firebase/firestore";
import { Attendees } from "./Attendees";
import { Users } from "./Users";

export interface Attendance {
  subjectID: string;
  teacher: string;
  attendees: Attendees[];
  createdAt: Date;
}

export const subjectConverter = {
  toFirestore: (data: Attendance) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Attendance,
};
