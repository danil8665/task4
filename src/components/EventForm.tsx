'use client';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

const priorities = [
  { value: 'normal', label: 'Звичайна' },
  { value: 'important', label: 'Важлива' },
  { value: 'critical', label: 'Критична' },
];

export type EventFormValues = {
  title: string;
  date: Date | undefined;
  time: string;
  description: string;
  priority: string;
};

export default function EventForm({
  initial,
  onSubmit,
  loading,
}: {
  initial?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => void;
  loading?: boolean;
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [date, setDate] = useState<Date | undefined>(initial?.date);
  const [time, setTime] = useState(initial?.time || '12:00');
  const [description, setDescription] = useState(initial?.description || '');
  const [priority, setPriority] = useState(initial?.priority || 'normal');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    onSubmit({ title, date, time, description, priority });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Назва події</label>
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Дата</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={
                'w-full justify-start text-left font-normal' +
                (!date ? ' text-muted-foreground' : '')
              }
              type="button"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? date.toLocaleDateString() : 'Оберіть дату'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setOpen(false);
              }}
              captionLayout="dropdown"
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <label className="block mb-1 font-medium">Час</label>
        <input
          type="time"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Опис</label>
        <textarea
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Важливість</label>
        <select
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {priorities.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" className="w-full" disabled={loading || !date}>
        {loading ? 'Збереження...' : 'Зберегти подію'}
      </Button>
    </form>
  );
}
