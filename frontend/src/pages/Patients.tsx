import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal, X, ChevronUp, ChevronDown,
  UserPlus, Users,
} from 'lucide-react';
import { patients as initialPatients, BANDS_TYPES } from '../data/mockData';
import type { Patient } from '../data/mockData';
import { useToast } from '../components/Toast';

type SortField = 'name' | 'treatmentDays' | 'consistency';
type SortDir = 'asc' | 'desc';

const ALL_TAGS = ['Sports', 'Night Owl', 'Early Riser'];

export default function Patients() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [patientList, setPatientList] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterBands, setFilterBands] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);

  // Add patient modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('');
  const [newBands, setNewBands] = useState<typeof BANDS_TYPES[number]>('Triangle');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const toggleFilter = <T extends string>(
    list: T[], setList: (v: T[]) => void, value: T
  ) => {
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };

  const activeFilterCount = filterStatus.length + filterBands.length + filterTags.length;

  const clearFilters = () => {
    setFilterStatus([]);
    setFilterBands([]);
    setFilterTags([]);
  };

  const filtered = patientList
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => filterStatus.length === 0 || filterStatus.includes(p.status))
    .filter(p => filterBands.length === 0 || filterBands.includes(p.bandsType))
    .filter(p => filterTags.length === 0 || filterTags.some(t => p.tags.includes(t)));

  const sorted = sortField
    ? [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      })
    : filtered;

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown size={12} className="text-text-muted opacity-40" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-green-primary" />
      : <ChevronDown size={12} className="text-green-primary" />;
  };

  const handleAddPatient = () => {
    if (!newName.trim() || !newDob) return;
    const newPatient: Patient = {
      id: String(Date.now()),
      name: newName.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face`,
      treatmentDays: 0,
      bandsType: newBands,
      tags: newTags,
      captureUrl: null,
      consistency: 0,
      status: 'active',
      startDate: newStartDate,
      dob: newDob,
    };
    setPatientList(prev => [newPatient, ...prev]);
    toast(`${newName.trim()} added successfully`);
    setShowAddModal(false);
    setNewName('');
    setNewDob('');
    setNewBands('Triangle');
    setNewTags([]);
    setNewStartDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-8rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4" style={{ paddingTop: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className="flex items-center gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-11 bg-bg-secondary border border-border rounded-xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-green-primary/50 w-64 transition-all"
            style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
          />

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(v => !v)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-colors text-sm font-medium ${
                activeFilterCount > 0
                  ? 'bg-green-primary/10 border-green-primary/40 text-green-primary'
                  : 'bg-bg-secondary border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <SlidersHorizontal size={15} />
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-green-primary text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {showFilter && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowFilter(false)} />
                <div className="absolute left-0 top-full mt-2 z-40 w-64 bg-bg-secondary border border-border rounded-2xl shadow-2xl p-5">
                  {/* Status */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Status</p>
                    <div className="flex flex-col gap-2">
                      {['active', 'paused'].map(s => (
                        <label key={s} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterStatus.includes(s)}
                            onChange={() => toggleFilter(filterStatus, setFilterStatus, s)}
                            className="w-4 h-4 rounded accent-green-primary"
                          />
                          <span className="text-sm text-text-secondary capitalize">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Bands Type */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Bands Type</p>
                    <div className="flex flex-col gap-2">
                      {BANDS_TYPES.map(b => (
                        <label key={b} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterBands.includes(b)}
                            onChange={() => toggleFilter(filterBands, setFilterBands, b)}
                            className="w-4 h-4 rounded accent-green-primary"
                          />
                          <span className="text-sm text-text-secondary">{b}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Tags</p>
                    <div className="flex flex-col gap-2">
                      {ALL_TAGS.map(t => (
                        <label key={t} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterTags.includes(t)}
                            onChange={() => toggleFilter(filterTags, setFilterTags, t)}
                            className="w-4 h-4 rounded accent-green-primary"
                          />
                          <span className="text-sm text-text-secondary">{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="w-full text-sm text-text-muted hover:text-red-400 transition-colors text-center py-2 border-t border-border pt-4"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Add Patient */}
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={17} />
          Add Patient
        </button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden flex-1">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th
                className="text-left py-5 px-8 text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors select-none"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center gap-1.5">Name <SortIcon field="name" /></div>
              </th>
              <th
                className="text-left py-5 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors select-none"
                onClick={() => toggleSort('treatmentDays')}
              >
                <div className="flex items-center gap-1.5">Treatment Time <SortIcon field="treatmentDays" /></div>
              </th>
              <th className="text-left py-5 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Bands Type
              </th>
              <th className="text-left py-5 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Tags
              </th>
              <th className="text-center py-5 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Capture
              </th>
              <th
                className="text-right py-5 px-8 text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors select-none"
                onClick={() => toggleSort('consistency')}
              >
                <div className="flex items-center justify-end gap-1.5">Consistency <SortIcon field="consistency" /></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-text-muted">
                    <Users size={36} className="opacity-30" />
                    <p className="font-medium text-text-secondary">No patients found</p>
                    <p className="text-sm">
                      {searchQuery
                        ? `No results for "${searchQuery}"`
                        : 'Try adjusting your filters'}
                    </p>
                    {(searchQuery || activeFilterCount > 0) && (
                      <button
                        onClick={() => { setSearchQuery(''); clearFilters(); }}
                        className="text-green-primary text-sm hover:underline mt-1"
                      >
                        Clear search & filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map(patient => (
                <tr
                  key={patient.id}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  className="border-b border-border hover:bg-bg-tertiary/30 transition-colors cursor-pointer"
                >
                  {/* Name */}
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-border flex-shrink-0">
                        <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-text-primary font-medium">{patient.name}</p>
                        {patient.status === 'paused' && (
                          <span className="text-xs text-yellow-400 font-medium">Paused</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Treatment Time */}
                  <td className="py-5 px-6 text-text-secondary">{patient.treatmentDays} days</td>

                  {/* Bands Type */}
                  <td className="py-5 px-6">
                    <span className="text-sm text-text-secondary">
                      {patient.bandsType}
                    </span>
                  </td>

                  {/* Tags */}
                  <td className="py-5 px-6">
                    {patient.tags.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {patient.tags.map(tag => (
                          <span key={tag} className="text-sm text-green-primary font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>

                  {/* Capture */}
                  <td className="py-5 px-6">
                    <div className="flex justify-center">
                      {patient.captureUrl ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                          <img src={patient.captureUrl} alt="Capture" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <X size={18} style={{ color: '#b91c1c' }} />
                      )}
                    </div>
                  </td>

                  {/* Consistency with mini bar */}
                  <td className="py-5 px-8">
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`font-semibold text-base ${
                        patient.consistency >= 80 ? 'text-green-primary' :
                        patient.consistency >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {patient.consistency}%
                      </span>
                      <div className="w-20 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            patient.consistency >= 80 ? 'bg-green-primary' :
                            patient.consistency >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${patient.consistency}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-bg-secondary border border-border rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-7">
              <h2 className="font-display text-xl font-semibold">Add New Patient</h2>
              <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-text-secondary mb-2 font-medium">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-bg-tertiary border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-green-primary/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2 font-medium">Date of Birth</label>
                <input
                  type="date"
                  value={newDob}
                  onChange={e => setNewDob(e.target.value)}
                  className="w-full bg-bg-tertiary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-green-primary/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2 font-medium">Start Date</label>
                <input
                  type="date"
                  value={newStartDate}
                  onChange={e => setNewStartDate(e.target.value)}
                  className="w-full bg-bg-tertiary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-green-primary/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2 font-medium">Bands Type</label>
                <select
                  value={newBands}
                  onChange={e => setNewBands(e.target.value as typeof BANDS_TYPES[number])}
                  className="w-full bg-bg-tertiary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-green-primary/50 text-sm"
                >
                  {BANDS_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2 font-medium">Tags</label>
                <div className="flex gap-2 flex-wrap">
                  {ALL_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewTags(prev =>
                        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                      )}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        newTags.includes(tag)
                          ? 'bg-green-primary text-black border-green-primary'
                          : 'bg-bg-tertiary text-text-secondary border-border'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleAddPatient}
                disabled={!newName.trim() || !newDob}
                className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
