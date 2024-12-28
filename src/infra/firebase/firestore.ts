
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./clientApp";

export const db = getFirestore(firebaseApp)