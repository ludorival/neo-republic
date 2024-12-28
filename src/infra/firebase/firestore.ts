
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./clientApp";
import { FirebaseDatabase } from "./FirebaseDatabase";

export const db = new FirebaseDatabase(getFirestore(firebaseApp));
