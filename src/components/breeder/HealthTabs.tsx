import { useState } from 'react';
import { HealthDashboard } from './HealthDashboard';
import { HealthTab } from './HealthTab';
import { VaccinationCalendarTab } from './VaccinationCalendarTab';
import { ExamsHistoryTab } from './ExamsHistoryTab';
import { NativeSelect } from '../ui/native-select';

interface HealthTabsProps {
  animalId: number;
  animalName: string;
  onRegisterProcedure: () => void;
  onRegisterVaccine: () => void;
  onRegisterExam: () => void;
}

export function HealthTabs({ animalId, animalName, onRegisterProcedure, onRegisterVaccine, onRegisterExam }: HealthTabsProps) {
  const [activeSubTab, setActiveSubTab] = useState('dashboard');

  const subTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'procedures', label: 'Procedimentos' },
    { id: 'vaccines', label: 'Vacinas' },
    { id: 'exams', label: 'Exames' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tabs - Desktop */}
      <div className="hidden md:block border-b border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex gap-1 overflow-x-auto mobile-scroll-hidden">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-6 py-3 font-medium transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'text-foreground dark:text-white border-b-2 border-primary dark:border-white'
                  : 'text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tabs - Mobile (Dropdown) */}
      <div className="md:hidden">
        <NativeSelect
          value={activeSubTab}
          onChange={(e) => setActiveSubTab(e.target.value)}
          className="w-full"
        >
          {subTabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {/* Sub-tab Content */}
      <div>
        {activeSubTab === 'dashboard' && (
          <HealthDashboard animalId={animalId} animalName={animalName} />
        )}

        {activeSubTab === 'procedures' && (
          <HealthTab 
            animalId={animalId} 
            onRegisterProcedure={onRegisterProcedure}
          />
        )}

        {activeSubTab === 'vaccines' && (
          <VaccinationCalendarTab animalId={animalId} onRegisterVaccine={onRegisterVaccine} />
        )}

        {activeSubTab === 'exams' && (
          <ExamsHistoryTab animalId={animalId} onRegisterExam={onRegisterExam} />
        )}
      </div>
    </div>
  );
}