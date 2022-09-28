import { QueryDocumentSnapshot } from "firebase/firestore";

export interface Users {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  idNumber: string;
  type: string;
  email: string;
}
export const userConverter = {
  toFirestore: (data: Users) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Users,
};
