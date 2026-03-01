import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, Save } from 'lucide-react';
import { generateScheduleData } from '../data/mockData';
import { useToast } from '../components/Toast';

export default function Schedule() {
  const { toast } = useToast();

  const getMonday = (date: Date) => {
    const d = new Date(date);
    const dayOfWeek = d.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    d.setDate(d.getDate() + diff);
    return d;
  };

  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [scheduleData, setScheduleData] = useState(() => generateScheduleData(weekStart));

  const goToPreviousWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
    setScheduleData(generateScheduleData(newStart));
    setEditedTimes({});
  };

  const goToNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
    setScheduleData(generateScheduleData(newStart));
    setEditedTimes({});
  };

  const formatWeekRange = () => {
    const endOfWeek = new Date(weekStart);
    endOfWeek.setDate(weekStart.getDate() + 6);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${weekStart.toLocaleDateString('en-US', options)} - ${endOfWeek.toLocaleDateString('en-US', options)}, ${endOfWeek.getFullYear()}`;
  };
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
      {/* Header with Week Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousWeek}
            className="w-10 h-10 rounded-md bg-bg-secondary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-lg font-medium text-text-primary min-w-[200px] text-center">
            {formatWeekRange()}
          </span>
          <button
            onClick={goToNextWeek}
            className="w-10 h-10 rounded-md bg-bg-secondary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {editMode && (
          <p className="text-sm text-green-primary font-medium">
            Editing — click any time slot to change it
          </p>
        )}
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <span>Sort Audience:</span>
          <button className="flex items-center gap-2 text-text-primary font-medium hover:text-green-primary transition-colors">
            all
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Schedule Card */}
      <div className="card" style={{ minHeight: '65vh' }}>
        {/* Week Header */}
        <div className="grid grid-cols-7 gap-6 mb-10">
          {scheduleData.map((day) => (
            <div key={day.day} className="text-center">
              <p className="text-sm text-text-muted uppercase tracking-wider font-medium">{day.day}</p>
              <p className="text-5xl font-light text-text-primary mt-3">{day.date}</p>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="space-y-6">
          {[0, 1, 2].map((rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-7 gap-6">
              {scheduleData.map((day) => {
                const key = `${day.day}-${rowIndex}`;
                const displayTime = getDisplayTime(day.day, rowIndex, day.times[rowIndex]);
                return (
                  <div
                    key={key}
                    className={`${getTimeSlotColor(rowIndex, editMode)} rounded-md p-6 relative transition-all`}
                  >
                    {editMode ? (
                      <input
                        type="text"
                        value={displayTime}
                        onChange={e => handleTimeChange(day.day, rowIndex, e.target.value)}
                        className="w-full bg-transparent text-text-primary font-semibold text-center text-base focus:outline-none placeholder-text-muted"
                        placeholder="e.g. 8:30 AM"
                      />
                    ) : (
                      <p className={`font-semibold text-center text-lg ${
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
