import { useState } from 'react';
import { ChevronDown, Pencil, Save } from 'lucide-react';
import { generateScheduleData } from '../data/mockData';
import { useToast } from '../components/Toast';

export default function Schedule() {
  const { toast } = useToast();

  const [weekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    return monday;
  });

  const [scheduleData, setScheduleData] = useState(() => generateScheduleData(weekStart));
  const [editMode, setEditMode] = useState(false);
  const [editedTimes, setEditedTimes] = useState<Record<string, string>>({});

  const getTimeSlotColor = (rowIndex: number, isEdit: boolean): string => {
    if (isEdit) return 'bg-bg-tertiary border border-green-primary/40';
    return rowIndex % 2 === 0 ? 'bg-green-primary' : 'bg-teal-accent';
  };

  const handleRandomize = () => {
    setScheduleData(generateScheduleData(weekStart));
    setEditedTimes({});
    toast('Schedule randomized');
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Save — apply edits back to scheduleData
      const updated = scheduleData.map(day => ({
        ...day,
        times: day.times.map((t, rowIndex) => {
          const key = `${day.day}-${rowIndex}`;
          return editedTimes[key] ?? t;
        }),
      }));
      setScheduleData(updated);
      setEditedTimes({});
      setEditMode(false);
      toast('Schedule saved');
    } else {
      setEditMode(true);
    }
  };

  const getDisplayTime = (day: string, rowIndex: number, original: string) => {
    const key = `${day}-${rowIndex}`;
    return editedTimes[key] ?? original;
  };

  const handleTimeChange = (day: string, rowIndex: number, value: string) => {
    const key = `${day}-${rowIndex}`;
    setEditedTimes(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-8 h-full min-h-[calc(100vh-8rem)]">
      {/* Header with Sort */}
      <div className="flex justify-between items-center">
        {editMode && (
          <p className="text-sm text-green-primary font-medium">
            Editing — click any time slot to change it
          </p>
        )}
        <div className={`flex items-center gap-3 text-sm text-text-secondary ${editMode ? '' : 'ml-auto'}`}>
          <span>Sort Audience:</span>
          <button className="flex items-center gap-2 text-text-primary font-medium hover:text-green-primary transition-colors">
            all
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Schedule Card */}
      <div className="card flex-1">
        {/* Week Header */}
        <div className="grid grid-cols-7 gap-6 mb-8">
          {scheduleData.map((day) => (
            <div key={day.day} className="text-center">
              <p className="text-xs text-text-muted uppercase tracking-wider font-medium">{day.day}</p>
              <p className="text-3xl font-light text-text-primary mt-2">{day.date}</p>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="space-y-5">
          {[0, 1, 2].map((rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-7 gap-6">
              {scheduleData.map((day) => {
                const key = `${day.day}-${rowIndex}`;
                const displayTime = getDisplayTime(day.day, rowIndex, day.times[rowIndex]);
                return (
                  <div
                    key={key}
                    className={`${getTimeSlotColor(rowIndex, editMode)} rounded-xl p-4 relative transition-all`}
                  >
                    {editMode ? (
                      <input
                        type="text"
                        value={displayTime}
                        onChange={e => handleTimeChange(day.day, rowIndex, e.target.value)}
                        className="w-full bg-transparent text-text-primary font-semibold text-center text-[0.875rem] focus:outline-none placeholder-text-muted"
                        placeholder="e.g. 8:30 AM"
                      />
                    ) : (
                      <p className={`font-semibold text-center text-[0.9375rem] ${
                        rowIndex % 2 === 0 ? 'text-black' : 'text-black'
                      }`}>
                        {displayTime}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        {!editMode && (
          <button onClick={handleRandomize} className="btn-secondary px-8">
            Randomize
          </button>
        )}
        <button
          onClick={handleEditToggle}
          className="btn-primary px-10 flex items-center gap-2"
        >
          {editMode ? <><Save size={16} /> Save</> : <><Pencil size={16} /> Edit</>}
        </button>
      </div>
    </div>
  );
}
