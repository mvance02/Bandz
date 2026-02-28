import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import LineChart from '../components/LineChart';
import DonutChart from '../components/DonutChart';
import { insightLineData, activityStats } from '../data/mockData';

const tabs = ['Time of Day', 'Tags', 'Demographics', 'Timeliness'];
const timeFilters = ['Morning', 'Noon', 'Night'];

export default function Insights() {
  const [activeTab, setActiveTab] = useState('Time of Day');
  const [activeFilters, setActiveFilters] = useState<string[]>(['Morning', 'Noon', 'Night']);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="grid grid-cols-12 gap-8 h-full min-h-[calc(100vh-8rem)]">
      {/* Left section */}
      <div className="col-span-9 flex flex-col gap-8">
        {/* Tab Navigation */}
        <div className="flex gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-7 py-3.5 rounded-xl font-medium transition-all text-[0.9375rem] whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-green-primary text-black'
                  : 'bg-bg-secondary border border-border text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Report and Analysis */}
        <div className="card flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-xl font-semibold">Report and Analysis</h2>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span>Sort by</span>
              <button className="flex items-center gap-2 text-text-primary font-medium hover:text-green-primary transition-colors">
                this month
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="h-72">
            <LineChart data={insightLineData} />
          </div>

          {/* Time Filter Buttons */}
          <div className="flex gap-4 mt-8">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`flex items-center gap-3 px-7 py-3 rounded-xl transition-all font-medium text-sm ${
                  activeFilters.includes(filter)
                    ? filter === 'Night'
                      ? 'bg-green-secondary text-black'
                      : 'bg-bg-tertiary text-text-primary border border-border'
                    : 'bg-bg-secondary text-text-muted border border-border'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  filter === 'Morning' ? 'bg-[#a7f3d0]' :
                  filter === 'Noon' ? 'bg-green-primary' : 'bg-green-secondary'
                }`} />
                {filter}
              </button>
            ))}
            <button className="px-7 py-3 rounded-xl bg-bg-tertiary text-text-primary border border-border font-medium text-sm hover:bg-border transition-colors">
              Details
            </button>
          </div>
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-display text-xl font-semibold mb-5">Top Performer Insights</h3>
            <ul className="space-y-4 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-green-primary mt-0.5 text-lg leading-none">•</span>
                <span className="leading-relaxed text-sm">Ages 12–14 showed a 23% increase in week-over-week capture rate</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-primary mt-0.5 text-lg leading-none">•</span>
                <span className="leading-relaxed text-sm">Patients tagged "Early Riser" averaged 94% morning compliance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-primary mt-0.5 text-lg leading-none">•</span>
                <span className="leading-relaxed text-sm">Evening window sees highest on-time submissions at 88%</span>
              </li>
            </ul>
          </div>

          <div className="card bg-teal-accent/10 border-teal-accent/20">
            <h3 className="font-display text-xl font-semibold mb-5">Low Performer Insights</h3>
            <ul className="space-y-4 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-teal-accent mt-0.5 text-lg leading-none">•</span>
                <span className="leading-relaxed text-sm">Patients tagged "Athlete" struggled with afternoon captures (61%)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-accent mt-0.5 text-lg leading-none">•</span>
                <span className="leading-relaxed text-sm">Ages 15–17 show a 12% drop in compliance over the last 30 days</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-accent mt-0.5 text-lg leading-none">•</span>
                <span className="leading-relaxed text-sm">Midday window has the lowest submission rate across all demographics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="col-span-3 flex flex-col gap-5">
        {/* Donut Chart */}
        <div className="card flex-shrink-0">
          <DonutChart
            activePercent={activityStats.activePercent}
            inactivePercent={activityStats.inactivePercent}
            size="lg"
          />
        </div>

        {/* Stats */}
        <div className="card">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-semibold text-[1.0625rem]">Active</h3>
                <span className="text-green-primary font-bold text-xl">{activityStats.activePatients}%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                <div className="h-full bg-green-primary rounded-full" style={{ width: `${activityStats.activePatients}%` }} />
              </div>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">{activityStats.activePatientsChange}</p>
            </div>

            <div className="border-t border-border pt-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-semibold text-[1.0625rem]">Inactive</h3>
                <span className="text-red-400 font-bold text-xl">{activityStats.inactivePatients}%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: `${activityStats.inactivePatients}%` }} />
              </div>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">{activityStats.inactivePatientsChange}</p>
            </div>

            <div className="border-t border-border pt-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-semibold text-[1.0625rem]">Revision</h3>
                <span className="text-text-primary font-bold text-xl">{activityStats.revision}%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                <div className="h-full bg-teal-accent rounded-full" style={{ width: `${activityStats.revision}%` }} />
              </div>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">{activityStats.revisionNote}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
