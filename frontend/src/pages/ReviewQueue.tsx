import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';

// Mock data for unreviewed submissions
const unreviewedSubmissions = [
  {
    id: 'sub-1',
    patientId: 'patient-1',
    patientName: 'Bryce Peterson',
    date: '2024-03-24',
    slot: 1,
    slotName: 'Morning',
    submittedAt: '2024-03-24T09:02:00Z',
    isOnTime: true,
    imageUrl: null,
  },
  {
    id: 'sub-2',
    patientId: 'patient-2',
    patientName: 'Emma Wilson',
    date: '2024-03-24',
    slot: 2,
    slotName: 'Midday',
    submittedAt: '2024-03-24T13:15:00Z',
    isOnTime: false,
    imageUrl: null,
  },
  {
    id: 'sub-3',
    patientId: 'patient-3',
    patientName: 'Jacob Martinez',
    date: '2024-03-24',
    slot: 3,
    slotName: 'Evening',
    submittedAt: '2024-03-24T19:45:00Z',
    isOnTime: true,
    imageUrl: null,
  },
  {
    id: 'sub-4',
    patientId: 'patient-1',
    patientName: 'Bryce Peterson',
    date: '2024-03-23',
    slot: 2,
    slotName: 'Midday',
    submittedAt: '2024-03-23T13:05:00Z',
    isOnTime: true,
    imageUrl: null,
  },
  {
    id: 'sub-5',
    patientId: 'patient-4',
    patientName: 'Sophia Chen',
    date: '2024-03-24',
    slot: 1,
    slotName: 'Morning',
    submittedAt: '2024-03-24T09:08:00Z',
    isOnTime: false,
    imageUrl: null,
  },
];

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReviewQueue() {
  const navigate = useNavigate();
  const [submissions] = useState(unreviewedSubmissions);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const handleMarkReviewed = (id: string, bandPresent: boolean) => {
    setReviewedIds(prev => new Set([...prev, id]));
    // In real app, this would call the API
    console.log(`Marked ${id} as reviewed, band present: ${bandPresent}`);
  };

  const pendingSubmissions = submissions.filter(s => !reviewedIds.has(s.id));

  const goToPatientReview = (patientId: string, date: string) => {
    navigate(`/patients/${patientId}/review?date=${date}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Review Queue</h1>
          <p className="text-white/60 mt-1">
            {pendingSubmissions.length} photo{pendingSubmissions.length !== 1 ? 's' : ''} awaiting review
          </p>
        </div>
      </div>

      {/* Submissions Grid */}
      {pendingSubmissions.length === 0 ? (
        <div className="bg-bg-secondary rounded-2xl p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-primary mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">All caught up!</h2>
          <p className="text-white/60">No photos awaiting review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-bg-secondary rounded-2xl overflow-hidden"
            >
              {/* Photo placeholder */}
              <div className="aspect-[4/3] bg-bg-tertiary flex items-center justify-center">
                <div className="text-white/40 text-sm">Photo placeholder</div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white">{submission.patientName}</h3>
                    <p className="text-white/60 text-sm">
                      {submission.slotName} • {formatDate(submission.date)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      submission.isOnTime
                        ? 'bg-green-primary/20 text-green-primary'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {submission.isOnTime ? 'On-time' : 'Late'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Clock size={14} />
                  <span>Received {formatTime(submission.submittedAt)}</span>
                </div>

                {/* Review Actions */}
                <div className="pt-2 border-t border-white/10">
                  <p className="text-white/70 text-sm mb-3">Rubber band present?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleMarkReviewed(submission.id, true)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-primary/20 text-green-primary hover:bg-green-primary/30 transition-colors"
                    >
                      <CheckCircle size={18} />
                      <span className="font-medium">Yes</span>
                    </button>
                    <button
                      onClick={() => handleMarkReviewed(submission.id, false)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <XCircle size={18} />
                      <span className="font-medium">No</span>
                    </button>
                  </div>
                </div>

                {/* Link to full review */}
                <button
                  onClick={() => goToPatientReview(submission.patientId, submission.date)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-white/60 hover:text-white text-sm transition-colors"
                >
                  <span>View full review</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
