'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationCategory {
  id: string;
  label: string;
  enabled: boolean;
  email: boolean;
  push: boolean;
}

interface NotificationPreferencesContextType {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  pushEnabled: boolean;
  setPushEnabled: (value: boolean) => void;
  emailDigest: string;
  setEmailDigest: (value: string) => void;
  quietHoursEnabled: boolean;
  setQuietHoursEnabled: (value: boolean) => void;
  quietStart: string;
  setQuietStart: (value: string) => void;
  quietEnd: string;
  setQuietEnd: (value: string) => void;
  instantAlerts: boolean;
  setInstantAlerts: (value: boolean) => void;
  categories: NotificationCategory[];
  setCategories: (categories: NotificationCategory[]) => void;
  shouldShowNotification: (categoryId: string, time?: Date) => boolean;
}

const NotificationPreferencesContext = createContext<NotificationPreferencesContextType | undefined>(undefined);

export function NotificationPreferencesProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState('daily');
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('07:00');
  const [instantAlerts, setInstantAlerts] = useState(true);

  const [categories, setCategories] = useState<NotificationCategory[]>([
    { id: 'saude', label: 'Saúde', enabled: true, email: true, push: true },
    { id: 'financeiro', label: 'Financeiro', enabled: true, email: true, push: false },
    { id: 'servicos', label: 'Serviços', enabled: true, email: false, push: true },
    { id: 'reproducao', label: 'Reprodução', enabled: true, email: true, push: true },
    { id: 'geral', label: 'Geral', enabled: true, email: false, push: false },
  ]);

  const shouldShowNotification = (categoryId: string, time: Date = new Date()): boolean => {
    const category = categories.find(c => c.id === categoryId);
    if (!category || !category.enabled) return false;

    // Sempre mostrar alertas críticos de saúde
    if (categoryId === 'saude' && instantAlerts) return true;

    // Verificar horário de silêncio
    if (quietHoursEnabled) {
      const currentHour = time.getHours();
      const currentMinutes = time.getMinutes();
      const currentTime = currentHour * 60 + currentMinutes;

      const [startHour, startMin] = quietStart.split(':').map(Number);
      const [endHour, endMin] = quietEnd.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      if (startTime > endTime) {
        // Horário atravessa meia-noite
        if (currentTime >= startTime || currentTime <= endTime) {
          return false;
        }
      } else {
        if (currentTime >= startTime && currentTime <= endTime) {
          return false;
        }
      }
    }

    return true;
  };

  return (
    <NotificationPreferencesContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        pushEnabled,
        setPushEnabled,
        emailDigest,
        setEmailDigest,
        quietHoursEnabled,
        setQuietHoursEnabled,
        quietStart,
        setQuietStart,
        quietEnd,
        setQuietEnd,
        instantAlerts,
        setInstantAlerts,
        categories,
        setCategories,
        shouldShowNotification,
      }}
    >
      {children}
    </NotificationPreferencesContext.Provider>
  );
}

export function useNotificationPreferences() {
  const context = useContext(NotificationPreferencesContext);
  if (!context) {
    throw new Error('useNotificationPreferences must be used within NotificationPreferencesProvider');
  }
  return context;
}
