import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

export const getUserEventsQuery = (userId: string) =>
  query(collection(db, 'events'), where('userId', '==', userId), orderBy('date', 'asc'));

export const addEvent = async (userId: string, values: any) => {
  return addDoc(collection(db, 'events'), {
    userId,
    title: values.title,
    date: values.date?.toISOString().slice(0, 10),
    time: values.time,
    description: values.description,
    priority: values.priority,
    createdAt: Timestamp.now(),
  });
};

export const updateEvent = async (eventId: string, values: any) => {
  const ref = doc(db, 'events', eventId);
  return updateDoc(ref, {
    title: values.title,
    date: values.date?.toISOString().slice(0, 10),
    time: values.time,
    description: values.description,
    priority: values.priority,
  });
};

export const deleteEvent = async (eventId: string) => {
  return deleteDoc(doc(db, 'events', eventId));
};
