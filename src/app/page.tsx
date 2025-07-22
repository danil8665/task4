'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import EventForm, { EventFormValues } from '@/components/EventForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEvents } from '@/hooks/useEvents';
import EventCard from '@/components/EventCard';
import { filterEvents } from '@/lib/utils';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [formDate, setFormDate] = useState<Date | undefined>(undefined);
  const [editEvent, setEditEvent] = useState<any | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');

  const displayName = user?.displayName || 'Користувач';
  const initials = getInitials(displayName);

  const {
    events,
    loading: eventsLoading,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useEvents(user?.uid);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  const handleAddEvent = async (values: EventFormValues) => {
    if (!user) return;
    setSaving(true);
    try {
      if (editEvent) {
        await updateEvent(editEvent.id, values);
        setEditEvent(null);
      } else {
        await addEvent(values);
        setFormOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteEventId) return;
    await deleteEvent(deleteEventId);
    setDeleteEventId(null);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/auth');
  };

  const priorityLabels: Record<string, string> = {
    normal: 'Звичайна',
    important: 'Важлива',
    critical: 'Критична',
  };

  const eventDates: Record<string, string> = {};
  events.forEach((ev) => {
    if (ev.date) eventDates[ev.date] = ev.priority;
  });

  const modifiers = {
    normal: Object.keys(eventDates)
      .filter((date) => eventDates[date] === 'normal')
      .map((date) => new Date(date)),
    important: Object.keys(eventDates)
      .filter((date) => eventDates[date] === 'important')
      .map((date) => new Date(date)),
    critical: Object.keys(eventDates)
      .filter((date) => eventDates[date] === 'critical')
      .map((date) => new Date(date)),
  };
  const modifiersClassNames = {
    normal: 'bg-gray-200 text-gray-700 border border-gray-300 rounded-md',
    important: 'bg-yellow-200 text-yellow-900 border border-yellow-400 rounded-md',
    critical: 'bg-red-200 text-red-900 border border-red-400 rounded-md',
    today: 'opacity-60',
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-16 w-full max-w-lg mb-8" />
        <Skeleton className="h-40 w-full max-w-lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="sticky top-0 w-full z-20 bg-gradient-to-br from-gray-50 to-gray-200 shadow flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4 py-3 md:px-4 md:py-4">
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="cursor-pointer hover:opacity-80 transition">
                <AvatarImage src={user.photoURL || undefined} alt={user.email || ''} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-44 p-2">
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition text-red-600 font-medium"
              >
                Вийти з аккаунту
              </button>
            </PopoverContent>
          </Popover>
          <div>
            <div className="font-bold text-lg text-gray-800">Вітаємо, {displayName}!</div>
          </div>
        </div>
        <div className="flex gap-2 w-full max-w-md md:w-auto">
          <Input
            placeholder="Пошук подій..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/80 w-full"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36 bg-white/80">
              <SelectValue placeholder="Всі статуси" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі статуси</SelectItem>
              <SelectItem value="normal">Звичайна</SelectItem>
              <SelectItem value="important">Важлива</SelectItem>
              <SelectItem value="critical">Критична</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start gap-8 w-full max-w-5xl mx-auto pt-16 px-2 sm:px-4 md:px-8">
        <div className="w-full md:w-1/2">
          <div className="text-2xl font-bold mb-8 text-center text-gray-800 md:text-left">
            Ваш персональний кабінет
          </div>
          <div className="bg-white/90 rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={(date) => {
                setFormDate(date);
                setFormOpen(true);
              }}
              className="w-full rounded-md border-none shadow-none mb-8"
              captionLayout="dropdown"
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              classNames={{
                week: 'flex w-full mt-2 gap-1',
              }}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-0">
          <h2
            className="text-xl font-semibold mb-9
           text-gray-800"
          >
            Ваші події
          </h2>
          {eventsLoading ? (
            <>
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
            </>
          ) : filterEvents({ events, search, status }).length === 0 ? (
            <div className="text-gray-500">Подій не знайдено</div>
          ) : (
            <ul className="space-y-4">
              {filterEvents({ events, search, status }).map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onEdit={setEditEvent}
                  onDelete={setDeleteEventId}
                  priorityLabels={priorityLabels}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
      <Dialog
        open={formOpen || !!editEvent}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEditEvent(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editEvent ? 'Редагувати подію' : 'Додати подію'}</DialogTitle>
          </DialogHeader>
          <EventForm
            onSubmit={handleAddEvent}
            loading={saving}
            initial={
              editEvent
                ? {
                    title: editEvent.title,
                    date: editEvent.date ? new Date(editEvent.date) : undefined,
                    time: editEvent.time,
                    description: editEvent.description,
                    priority: editEvent.priority,
                  }
                : { date: formDate }
            }
          />
          <DialogClose asChild>
            <button className="mt-4 text-gray-500 hover:text-black">Закрити</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteEventId} onOpenChange={(v) => !v && setDeleteEventId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Видалити подію?</DialogTitle>
          </DialogHeader>
          <div>Ви дійсно хочете видалити цю подію? Цю дію не можна скасувати.</div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Видалити
            </button>
            <DialogClose asChild>
              <button className="px-4 py-2 rounded border hover:bg-gray-100 transition">
                Скасувати
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
