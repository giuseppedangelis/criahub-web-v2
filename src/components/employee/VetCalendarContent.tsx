import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

export function VetCalendarContent() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 18)); // Nov 18, 2024
  const [selectedDate, setSelectedDate] = useState(18);

  const events = [
    { id: 1, title: 'Ultrassom - Bella Vista', type: 'Reprodução', time: '09:00', date: 18, color: 'bg-pink-500' },
    { id: 2, title: 'Vacinação em Lote', type: 'Saúde', time: '14:00', date: 18, color: 'bg-green-500' },
    { id: 3, title: 'Consulta - Estrela M.', type: 'Consulta', time: '10:00', date: 23, color: 'bg-blue-500' },
    { id: 4, title: 'Coleta de Sêmen', type: 'Reprodução', time: '08:00', date: 25, color: 'bg-pink-500' },
  ];

  const selectedEvents = events.filter(e => e.date === selectedDate);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <div>
        <h2 className="text-2xl text-foreground dark:text-white mb-1">Agenda</h2>
        <p className="text-muted-foreground dark:text-[#99a1af]">Eventos e procedimentos</p>
      </div>

      {/* Calendar */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-foreground dark:text-white" />
          </button>
          <h3 className="text-lg text-foreground dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg"
          >
            <ChevronRight className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, idx) => (
            <div key={idx} className="text-center text-xs text-muted-foreground dark:text-[#99a1af] py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth().map((day, idx) => {
            const hasEvents = day && events.some(e => e.date === day);
            const isSelected = day === selectedDate;
            const isToday = day === 18;
            
            return (
              <button
                key={idx}
                onClick={() => day && setSelectedDate(day)}
                disabled={!day}
                className={`
                  aspect-square p-1 rounded-lg text-sm transition-all relative
                  ${!day ? 'invisible' : ''}
                  ${isSelected ? 'bg-primary dark:bg-white text-white dark:text-black' : 'hover:bg-muted dark:hover:bg-[#0d0d0d]'}
                  ${isToday && !isSelected ? 'border-2 border-primary dark:border-white' : ''}
                `}
              >
                {day && (
                  <>
                    <span className={`${isSelected ? 'text-white dark:text-black' : 'text-foreground dark:text-white'}`}>
                      {day}
                    </span>
                    {hasEvents && !isSelected && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-1 h-1 bg-primary dark:bg-white rounded-full"></div>
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg text-foreground dark:text-white">
            Dia {selectedDate}
          </h3>
          <button className="p-2 bg-primary dark:bg-white rounded-lg hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5 text-white dark:text-black" />
          </button>
        </div>

        {selectedEvents.length > 0 ? (
          <div className="space-y-2">
            {selectedEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-card dark:bg-[#1a1a1a] rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)]"
              >
                <div className="flex items-start gap-3">
                  <div className={`${event.color} w-1 h-full rounded-full`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${event.color} text-white text-xs px-2 py-1 rounded`}>
                        {event.type}
                      </span>
                      <span className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        {event.time}
                      </span>
                    </div>
                    <p className="text-foreground dark:text-white">{event.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-muted-foreground dark:text-[#99a1af] mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground dark:text-[#99a1af]">
              Nenhum evento neste dia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
