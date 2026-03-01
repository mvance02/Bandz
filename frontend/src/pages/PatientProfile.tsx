import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Camera, Save } from 'lucide-react';
import { patients, practice, complianceHistory, BANDS_TYPES, BANDS_SIZES, type BandsType, type BandsSize } from '../data/mockData';
import ComplianceChart from '../components/ComplianceChart';
import { useToast } from '../components/Toast';

export default function PatientProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const patient = patients.find(p => p.id === patientId);
  const [status, setStatus] = useState(patient?.status || 'active');
  const [bandsType, setBandsType] = useState<BandsType>(patient?.bandsType || 'Class I');
  const [bandsSize, setBandsSize] = useState<BandsSize>(patient?.bandsSize || '1/4"');
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-text-secondary text-lg">Patient not found.</p>
        <Link to="/patients" className="text-green-primary hover:underline">← Back to Patients</Link>
      </div>
    );
  }

  const metrics = {
    last7: { compliancePct: 85, onTimePct: 92 },
    last30: { compliancePct: 78, onTimePct: 88, missingCount: 8 },
    overall: { compliancePct: patient?.consistency || 0, onTimePct: 86 },
  };

  const toggleStatus = () => {
    const next = status === 'active' ? 'paused' : 'active';
    setStatus(next);
    toast(`Patient ${next === 'active' ? 'activated' : 'paused'}`, next === 'active' ? 'success' : 'info');
  };

  const handleSaveNotes = () => {
    setSavedNotes(notes);
    toast('Notes saved');
  };

  const handleReviewPhotos = () => {
    navigate(`/patients/${patientId}/review`);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex flex-col gap-8 h-full">
      <Link
        to="/patients"
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors w-fit"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back to Patients</span>
      </Link>

      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* Left Column */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Profile Card */}
          <div className="card text-center">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-border mb-6">
              <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-text-primary">{patient.name}</h2>
            <p className="text-text-secondary mt-1 text-sm">{practice.name}</p>
            <div className="mt-6">
              <button
                onClick={toggleStatus}
                className={`font-semibold transition-all text-lg ${
                  status === 'active'
                    ? 'text-green-primary'
                    : 'text-yellow-500'
                }`}
              >
                {status === 'active' ? 'Active' : 'Paused'}
              </button>
            </div>
          </div>

          {/* Patient Details */}
          <div className="card">
            <h3 className="font-display text-xl font-semibold mb-5">Patient Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Start Date</span>
                <span className="text-text-primary font-medium text-sm">{formatDate(patient.startDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Date of Birth</span>
                <span className="text-text-primary font-medium text-sm">{formatDate(patient.dob)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Treatment Days</span>
                <span className="text-text-primary font-medium text-sm">{patient.treatmentDays} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Bands Type</span>
                <select
                  value={bandsType}
                  onChange={(e) => {
                    setBandsType(e.target.value as BandsType);
                    toast(`Bands type updated to ${e.target.value}`, 'success');
                  }}
                  className="bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-green-primary/50 cursor-pointer"
                >
                  {BANDS_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Bands Size</span>
                <select
                  value={bandsSize}
                  onChange={(e) => {
                    setBandsSize(e.target.value as BandsSize);
                    toast(`Bands size updated to ${e.target.value}`, 'success');
                  }}
                  className="bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-green-primary/50 cursor-pointer"
                >
                  {BANDS_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              {patient.tags.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-text-secondary text-sm">Tags</span>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {patient.tags.map(tag => (
                      <span key={tag} className="text-sm text-green-primary font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Review Photos Button */}
          <button
            onClick={handleReviewPhotos}
            className="btn-primary flex items-center justify-center gap-3"
          >
            <Camera size={20} />
            Review Photos
          </button>
        </div>

        {/* Right Column */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* Notes */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">Orthodontist Notes</h3>
              <button
                onClick={handleSaveNotes}
                disabled={notes === savedNotes}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-green-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Save size={15} />
                Save
              </button>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Quick notes about this patient..."
              rows={4}
              className="w-full bg-bg-tertiary border border-border rounded-xl p-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-green-primary/50 resize-none text-sm"
            />
          </div>

          {/* Performance Summary */}
          <div className="card">
            <h3 className="font-display text-xl font-semibold mb-6">Performance Summary</h3>
            <div className="grid grid-cols-4 gap-5">
              <div className="bg-bg-tertiary rounded-xl p-5 border border-border text-center">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Last 7 Days</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-text-muted text-xs mb-1">Compliance</p>
                    <p className="text-3xl font-bold text-green-primary">{metrics.last7.compliancePct}%</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-xs mb-1">On-time</p>
                    <p className="text-3xl font-bold text-text-primary">{metrics.last7.onTimePct}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-tertiary rounded-xl p-5 border border-border text-center">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Last 30 Days</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-text-muted text-xs mb-1">Compliance</p>
                    <p className="text-3xl font-bold text-green-primary">{metrics.last30.compliancePct}%</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-xs mb-1">On-time</p>
                    <p className="text-3xl font-bold text-text-primary">{metrics.last30.onTimePct}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-tertiary rounded-xl p-5 border border-border text-center">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Overall</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-text-muted text-xs mb-1">Compliance</p>
                    <p className={`text-3xl font-bold ${
                      metrics.overall.compliancePct >= 80 ? 'text-green-primary' :
                      metrics.overall.compliancePct >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{metrics.overall.compliancePct}%</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-xs mb-1">On-time</p>
                    <p className="text-3xl font-bold text-text-primary">{metrics.overall.onTimePct}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-tertiary rounded-xl p-5 border border-border text-center">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Missing (30d)</h4>
                <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
                  <p className="text-5xl font-bold text-red-400">{metrics.last30.missingCount}</p>
                  <p className="text-text-muted text-xs mt-2">submissions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Trend */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-semibold">Compliance Trend</h3>
              <span className={`text-2xl font-bold ${
                patient.consistency >= 80 ? 'text-green-primary' :
                patient.consistency >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {patient.consistency}%
              </span>
            </div>
            <ComplianceChart data={complianceHistory} />
            {/* Progress bar overall */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex-1 bg-bg-tertiary rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-primary to-green-secondary rounded-full transition-all"
                  style={{ width: `${patient.consistency}%` }}
                />
              </div>
              <span className="text-xs text-text-muted font-medium w-16 text-right">Overall avg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
