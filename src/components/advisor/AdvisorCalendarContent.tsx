import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X, Clock } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';

export function AdvisorCalendarContent() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 18)); // Nov 18, 2024
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const events = [
    { id: 1, title: 'Vistoria ABCCMM', date: 23, time: '10:00', type: 'Administrativo', animal: 'Estrela Mangalarga' },
    { id: 2, title: 'Entrega de GIA - Bella Vista', date: 20, time: '14:00', type: 'Documentação', animal: 'Bella Vista' },
    { id: 3, title: 'Atualização de Registros', date: 25, time: '09:00', type: 'ABCCMM', animal: 'Vento Sul' },
  ];

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const getHeaderTitle = () => {
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    
    if (view === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} de ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else {
      return `${dayNames[currentDate.getDay()]}, ${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  };

  const openEventModal = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
    } else {
      setSelectedDate(null);
    }
    setShowNewEventModal(true);
  };

  const closeEventModal = () => {
    setShowNewEventModal(false);
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col-reverse lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <button 
              onClick={navigatePrevious}
              className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground dark:text-white" />
            </button>
            <h3 className="text-xl text-foreground dark:text-white min-w-[250px] text-center">
              {getHeaderTitle()}
            </h3>
            <button 
              onClick={navigateNext}
              className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground dark:text-white" />
            </button>
          </div>
          <div className="flex gap-2 justify-center lg:justify-start">
            {['month', 'week', 'day'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  view === v
                    ? 'bg-primary dark:bg-white text-white dark:text-black'
                    : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white'
                }`}
              >
                {v === 'month' ? 'Mês' : v === 'week' ? 'Semana' : 'Dia'}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={() => setShowNewEventModal(true)}
          className="w-full lg:w-auto px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Criar Serviço
        </button>
      </div>

      {/* Calendar Grid */}
      {view === 'month' && <MonthView currentDate={currentDate} events={events} onDayClick={openEventModal} />}
      {view === 'week' && <WeekView currentDate={currentDate} events={events} onDayClick={openEventModal} />}
      {view === 'day' && <DayView currentDate={currentDate} events={events} onTimeSlotClick={openEventModal} />}

      {/* Upcoming Events */}
      <div>
        <h3 className="text-xl text-foreground dark:text-white mb-4">Próximos Serviços</h3>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-card dark:bg-[#1a1a1a] rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)] flex items-center gap-4"
            >
              <div className="bg-blue-500 p-3 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-foreground dark:text-white mb-1">{event.title}</p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  {event.date}/11/2024 às {event.time}
                </p>
              </div>
              <span className="px-3 py-1 rounded text-xs bg-blue-500/20 text-blue-500">
                {event.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Criar Evento */}
      {showNewEventModal && (
        <NewEventModal onClose={closeEventModal} selectedDate={selectedDate} />
      )}
    </div>
  );
}

function MonthView({ currentDate, events, onDayClick }: { currentDate: Date, events: any[], onDayClick: (date: Date) => void }) {
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

  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
      {/* Days of week */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, idx) => (
          <div key={idx} className="text-center text-sm text-muted-foreground dark:text-[#99a1af] py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {getDaysInMonth().map((day, idx) => {
          const dayEvents = day ? events.filter(e => e.date === day) : [];
          const isToday = day === 18;
          
          return (
            <div
              key={idx}
              onClick={() => day && onDayClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
              className={`
                min-h-[100px] p-2 rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)]
                ${!day ? 'invisible' : 'hover:bg-muted dark:hover:bg-[#0d0d0d] cursor-pointer'}
                ${isToday ? 'bg-primary/10 dark:bg-white/10 border-primary dark:border-white' : ''}
              `}
            >
              {day && (
                <>
                  <div className={`text-sm mb-2 ${isToday ? 'text-primary dark:text-white' : 'text-foreground dark:text-white'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded truncate"
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ currentDate, events, onDayClick }: { currentDate: Date, events: any[], onDayClick: (date: Date) => void }) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8h às 19h

  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
      {/* Days of week header */}
      <div className="grid grid-cols-8 gap-2 mb-4">
        <div className="text-center text-sm text-muted-foreground dark:text-[#99a1af] py-2"></div>
        {weekDays.map((day, idx) => {
          const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
          const isToday = day.getDate() === 18 && day.getMonth() === 10;
          return (
            <div key={idx} className={`text-center py-2 rounded-lg ${isToday ? 'bg-primary/10 dark:bg-white/10' : ''}`}>
              <div className="text-sm text-muted-foreground dark:text-[#99a1af]">{dayNames[idx]}</div>
              <div className={`text-foreground dark:text-white ${isToday ? 'text-primary dark:text-white' : ''}`}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time slots */}
      <div className="space-y-2">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 gap-2">
            <div className="text-sm text-muted-foreground dark:text-[#99a1af] text-right py-2">
              {hour}:00
            </div>
            {weekDays.map((day, idx) => {
              const dayEvent = events.find(e => e.date === day.getDate() && e.time === `${hour}:00`);
              return (
                <div
                  key={idx}
                  onClick={() => onDayClick(day)}
                  className="border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg p-2 min-h-[60px] hover:bg-muted dark:hover:bg-[#0d0d0d] cursor-pointer"
                >
                  {dayEvent && (
                    <div className="text-xs p-1 bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded">
                      {dayEvent.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayView({ currentDate, events, onTimeSlotClick }: { currentDate: Date, events: any[], onTimeSlotClick: (date: Date) => void }) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8h às 19h
  const dayEvents = events.filter(e => e.date === currentDate.getDate());

  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
      <div className="space-y-2">
        {hours.map((hour) => {
          const hourEvent = dayEvents.find(e => e.time === `${hour}:00`);
          
          return (
            <div key={hour} className="flex gap-4">
              <div className="text-sm text-muted-foreground dark:text-[#99a1af] w-20 text-right py-3">
                {hour}:00
              </div>
              <div className="flex-1 border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg p-3 min-h-[80px] hover:bg-muted dark:hover:bg-[#0d0d0d] cursor-pointer"
                onClick={() => onTimeSlotClick(currentDate)}
              >
                {hourEvent && (
                  <div className="p-3 bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{hourEvent.time}</span>
                    </div>
                    <p className="mb-1">{hourEvent.title}</p>
                    <p className="text-xs opacity-80">{hourEvent.type} - {hourEvent.animal}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NewEventModal({ onClose, selectedDate }: { onClose: () => void, selectedDate: Date | null }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Serviço criado');
    onClose();
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-border dark:border-[#3a3a3a]">
        {/* Header */}
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl text-foreground dark:text-white mb-2">Criar Serviço</h3>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Preencha as informações do serviço
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Título do Evento */}
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white block">
                Título do Serviço *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Vistoria ABCCMM"
                className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Tipo de Evento */}
            <div className="space-y-3">
              <label className="text-sm text-foreground dark:text-white block">
                Tipo de Serviço *
              </label>
              <NativeSelect required>
                <option value="">Selecione o tipo</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Documentação">Documentação</option>
                <option value="ABCCMM">ABCCMM</option>
                <option value="Veterinário">Veterinário</option>
                <option value="Cobertura">Cobertura</option>
                <option value="Vistoria">Vistoria</option>
                <option value="Outros">Outros</option>
              </NativeSelect>
            </div>

            {/* Animal Relacionado */}
            <div className="space-y-3">
              <label className="text-sm text-foreground dark:text-white block">
                Animal Relacionado
              </label>
              <NativeSelect>
                <option value="">Selecione o animal</option>
                <option value="1">Estrela Mangalarga (MM-2020-1234)</option>
                <option value="2">Relâmpago Negro (MM-2018-5678)</option>
                <option value="3">Lua Dourada (MM-2019-9012)</option>
                <option value="4">Vento Sul (MM-2023-3456)</option>
                <option value="5">Bella Vista (MM-2021-7890)</option>
              </NativeSelect>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-foreground dark:text-white block">
                  Data *
                </label>
                <input
                  type="date"
                  required
                  defaultValue={selectedDate ? formatDate(selectedDate) : ''}
                  className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground dark:text-white block">
                  Hora *
                </label>
                <input
                  type="time"
                  required
                  className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            </div>

            {/* Cliente/Haras */}
            <div className="space-y-3">
              <label className="text-sm text-foreground dark:text-white block">
                Cliente/Haras
              </label>
              <NativeSelect>
                <option value="">Selecione o cliente</option>
                <option value="1">Haras Vale Verde</option>
                <option value="2">Haras Santa Fé</option>
                <option value="3">Fazenda Boa Vista</option>
                <option value="4">Haras Pedra Branca</option>
              </NativeSelect>
            </div>

            {/* Localização */}
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white block">
                Localização
              </label>
              <input
                type="text"
                placeholder="Ex: Escritório, Haras, ABCCMM"
                className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white block">
                Descrição
              </label>
              <textarea
                rows={4}
                placeholder="Adicione detalhes sobre o serviço..."
                className="w-full px-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
              />
            </div>

            {/* Lembrete */}
            <div className="space-y-3">
              <label className="text-sm text-foreground dark:text-white block">
                Lembrete
              </label>
              <NativeSelect>
                <option value="">Sem lembrete</option>
                <option value="15">15 minutos antes</option>
                <option value="30">30 minutos antes</option>
                <option value="60">1 hora antes</option>
                <option value="1440">1 dia antes</option>
              </NativeSelect>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)] flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-transparent border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Criar Serviço
          </button>
        </div>
      </div>
    </div>
  );
}