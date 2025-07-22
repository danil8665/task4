type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  priority: string;
};

export default function EventCard({
  event,
  onEdit,
  onDelete,
  priorityLabels,
}: {
  event: EventItem;
  onEdit: (event: EventItem) => void;
  onDelete: (id: string) => void;
  priorityLabels: Record<string, string>;
}) {
  return (
    <li className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-1 transition-transform duration-200 will-change-transform hover:scale-[1.025] cursor-pointer">
      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-800">Подія: {event.title}</span>
        <span
          className={`text-xs px-2 py-1 rounded font-semibold
            ${event.priority === 'normal' ? 'bg-gray-400 text-white' : ''}
            ${event.priority === 'important' ? 'bg-yellow-500 text-white' : ''}
            ${event.priority === 'critical' ? 'bg-red-500 text-white' : ''}
          `}
        >
          {priorityLabels[event.priority]}
        </span>
      </div>
      {event.description && (
        <div className="text-sm mt-1 text-gray-700">Опис: {event.description}</div>
      )}
      <div className="text-sm text-gray-500">
        Дата: {event.date} Час: {event.time}
      </div>
      <div className="flex gap-2 mt-2 self-end">
        <button
          onClick={() => onEdit(event)}
          className="text-blue-600 text-xs px-2 py-1 rounded hover:bg-blue-50 transition"
        >
          Редагувати
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 transition"
        >
          Видалити
        </button>
      </div>
    </li>
  );
}
