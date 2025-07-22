import { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { getUserEventsQuery, addEvent, updateEvent, deleteEvent } from '@/lib/eventService';

export function useEvents(userId?: string) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const q = getUserEventsQuery(userId);
    const unsub = onSnapshot(q, (snap) => {
      setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  return {
    events,
    loading,
    addEvent: (values: any) => addEvent(userId!, values),
    updateEvent,
    deleteEvent,
  };
}
