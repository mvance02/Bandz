import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import { patients, photoWindows } from '../data/mockData';
import { useToast } from '../components/Toast';

interface SlotData {
  slot: number;
  slotName: string;
  submitted: boolean;
  imageUrl: string | null;
  submittedAt: string | null;
  isOnTime: boolean;
  bandPresent: boolean | null;
  reviewed: boolean;
}

const timeWindowMap: Record<string, { start: string; end: string }> = {
  Morning: photoWindows.morning,
  Midday: photoWindows.midday,
  Evening: photoWindows.evening,
};

export default function PatientReview() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const patient = patients.find(p => p.id === patientId);
  const patientIndex = patients.findIndex(p => p.id === patientId);
  const nextPatient = patientIndex < patients.length - 1 ? patients[patientIndex + 1] : null;

  const today = new Date().toISOString().split('T')[0];
  const [reviewDate, setReviewDate] = useState(today);

  const [slots, setSlots] = useState<SlotData[]>([
    {
      slot: 1, slotName: 'Morning', submitted: true,
      imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=400&fit=crop',
      submittedAt: '2024-02-27T09:02:00Z', isOnTime: true, bandPresent: null, reviewed: false,
    },
    {
      slot: 2, slotName: 'Midday', submitted: false,
      imageUrl: null, submittedAt: null, isOnTime: false, bandPresent: null, reviewed: false,
    },
    {
      slot: 3, slotName: 'Evening', submitted: true,
      imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=400&fit=crop',
      submittedAt: '2024-02-27T19:45:00Z', isOnTime: false, bandPresent: null, reviewed: false,
    },
  ]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-text-secondary text-lg">Patient not found.</p>
        <Link to="/patients" className="text-green-primary hover:underline">← Back to Patients</Link>
      </div>
    );
  }

  const formatTime = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handleBandPresent = (slotIndex: number, value: boolean) => {
    setSlots(prev =>
      prev.map((slot, i) =>
        i === slotIndex ? { ...slot, bandPresent: value, reviewed: true } : slot
      )
    );
  };

  const handleMarkAllReviewed = () => {
    setSlots(prev => prev.map(slot => ({ ...slot, reviewed: true, bandPresent: slot.submitted ? (slot.bandPresent ?? true) : null })));
    toast('All slots marked as reviewed');
  };

  const handleNextPatient = () => {
    if (nextPatient) {
      navigate(`/patients/${nextPatient.id}/review?date=${reviewDate}`);
    }
  };

  // All submitted slots have been reviewed
  const allReviewed = slots.every(slot => !slot.submitted || slot.bandPresent !== null);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/patients/${patientId}`}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">{patient.name}</span>
        </Link>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={reviewDate}
            onChange={e => setReviewDate(e.target.value)}
            className="bg-bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-green-primary/50"
          />
          <button onClick={handleMarkAllReviewed} className="btn-secondary text-sm">
            Mark all reviewed
          </button>
          {nextPatient && (
            <button onClick={handleNextPatient} className="btn-primary flex items-center gap-2 text-sm">
              Next patient
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Completion Banner */}
      {allReviewed && (
        <div className="flex items-center gap-3 bg-green-primary/10 border border-green-primary/30 rounded-xl px-5 py-4">
          <CheckCircle size={20} className="text-green-primary flex-shrink-0" />
          <div>
            <p className="text-green-primary font-semibold text-sm">All slots reviewed</p>
            <p className="text-text-secondary text-xs mt-0.5">Great work — review for this patient is complete.</p>
          </div>
        </div>
      )}

      {/* Slot Cards */}
      <div className="grid grid-cols-3 gap-6 flex-1">
        {slots.map((slot, index) => {
          const timeWindow = timeWindowMap[slot.slotName];
          const isReviewed = slot.reviewed || slot.bandPresent !== null;
          return (
            <div
              key={slot.slot}
              className={`card flex flex-col transition-all ${
                isReviewed ? 'border-green-primary/30' : ''
              }`}
            >
              {/* Slot Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold">{slot.slotName}</h3>
                {isReviewed && <CheckCircle size={16} className="text-green-primary" />}
              </div>

              {/* Photo Area */}
              <div className="aspect-square bg-bg-tertiary rounded-xl overflow-hidden mb-4 flex items-center justify-center border border-border">
                {slot.submitted && slot.imageUrl ? (
                  <img
                    src={slot.imageUrl}
                    alt={`${slot.slotName} submission`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-bg-secondary border border-border flex items-center justify-center">
                      <Clock size={22} className="text-text-muted" />
                    </div>
                    <div>
                      <p className="text-text-secondary font-medium text-sm">No Submission</p>
                      {timeWindow && (
                        <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                          Expected:<br />
                          <span className="text-text-secondary">{timeWindow.start} – {timeWindow.end}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="mb-4">
                {slot.submitted ? (
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-xs">
                      Received: {formatTime(slot.submittedAt)}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      slot.isOnTime
                        ? 'bg-green-primary/15 text-green-primary'
                        : 'bg-red-500/15 text-red-400'
                    }`}>
                      {slot.isOnTime ? 'On-time' : 'Late'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400/60" />
                    <p className="text-text-muted text-xs">Patient did not submit for this window</p>
                  </div>
                )}
              </div>

              {/* Review Buttons */}
              <div className="mt-auto">
                <p className="text-text-secondary text-xs mb-3 font-medium">Rubber band present?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleBandPresent(index, true)}
                    disabled={!slot.submitted}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      slot.bandPresent === true
                        ? 'bg-green-primary text-black'
                        : 'bg-bg-tertiary text-text-secondary border border-border hover:border-green-primary/50'
                    }`}
                  >
                    <Check size={16} />
                    Yes
                  </button>
                  <button
                    onClick={() => handleBandPresent(index, false)}
                    disabled={!slot.submitted}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      slot.bandPresent === false
                        ? 'bg-red-500 text-white'
                        : 'bg-bg-tertiary text-text-secondary border border-border hover:border-red-500/50'
                    }`}
                  >
                    <X size={16} />
                    No
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
