import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Download,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Briefcase,
  Coffee,
  PartyPopper,
  Plane,
  Heart,
  Star,
  Circle,
  Edit,
  Trash2,
  Eye,
  Search
} from 'lucide-react';

type CalendarView = 'month' | 'week' | 'day' | 'agenda';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: 'leave' | 'training' | 'meeting' | 'holiday' | 'birthday' | 'event';
  description?: string;
  location?: string;
  attendees?: string[];
  color: string;
  allDay?: boolean;
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);

  const events: CalendarEvent[] = [
    // Malaysian Public Holidays
    {
      id: 1,
      title: 'Hari Raya Aidilfitri',
      date: '2024-12-25',
      type: 'holiday',
      color: 'bg-red-500',
      allDay: true,
      description: 'Public Holiday - Hari Raya Aidilfitri'
    },
    {
      id: 2,
      title: 'Christmas Day',
      date: '2024-12-25',
      type: 'holiday',
      color: 'bg-red-500',
      allDay: true,
      description: 'Public Holiday'
    },
    {
      id: 3,
      title: 'Maulidur Rasul',
      date: '2024-12-16',
      type: 'holiday',
      color: 'bg-red-500',
      allDay: true,
      description: 'Public Holiday'
    },
    // Leave Events
    {
      id: 4,
      title: 'Annual Leave - Ahmad Ibrahim',
      date: '2024-12-18',
      type: 'leave',
      color: 'bg-blue-500',
      allDay: true,
      description: 'Annual leave request approved'
    },
    {
      id: 5,
      title: 'Medical Leave - Siti Nurhaliza',
      date: '2024-12-19',
      type: 'leave',
      color: 'bg-blue-500',
      allDay: true,
      description: 'Medical leave'
    },
    {
      id: 6,
      title: 'Annual Leave - Lee Mei Ling',
      date: '2024-12-20',
      type: 'leave',
      color: 'bg-blue-500',
      allDay: true,
      description: 'Annual leave - Family trip'
    },
    // Training Sessions
    {
      id: 7,
      title: 'Workplace Safety & OSHA Compliance',
      date: '2024-12-20',
      startTime: '09:00',
      endTime: '12:00',
      type: 'training',
      color: 'bg-purple-500',
      location: 'Training Room A',
      attendees: ['15 participants'],
      description: 'Mandatory safety training'
    },
    {
      id: 8,
      title: 'AI & Machine Learning Fundamentals',
      date: '2024-12-22',
      startTime: '14:00',
      endTime: '17:00',
      type: 'training',
      color: 'bg-purple-500',
      location: 'Online - Zoom',
      attendees: ['42 participants'],
      description: 'Virtual training session'
    },
    {
      id: 9,
      title: 'Financial Planning & Budgeting',
      date: '2024-12-28',
      startTime: '10:00',
      endTime: '13:00',
      type: 'training',
      color: 'bg-purple-500',
      location: 'Conference Hall',
      attendees: ['28 participants'],
      description: 'Finance team training'
    },
    // Meetings
    {
      id: 10,
      title: 'Q4 Performance Review Meeting',
      date: '2024-12-17',
      startTime: '10:00',
      endTime: '12:00',
      type: 'meeting',
      color: 'bg-green-500',
      location: 'Board Room',
      attendees: ['Management Team'],
      description: 'Quarterly review with all department heads'
    },
    {
      id: 11,
      title: 'HR Department Sync',
      date: '2024-12-18',
      startTime: '14:00',
      endTime: '15:00',
      type: 'meeting',
      color: 'bg-green-500',
      location: 'HR Office',
      attendees: ['HR Team'],
      description: 'Weekly team sync'
    },
    {
      id: 12,
      title: 'Client Presentation',
      date: '2024-12-21',
      startTime: '15:00',
      endTime: '16:30',
      type: 'meeting',
      color: 'bg-green-500',
      location: 'Conference Room B',
      attendees: ['Sales Team', 'Client'],
      description: 'Product demo for new client'
    },
    // Birthdays
    {
      id: 13,
      title: 'Birthday - Kumar Selvam',
      date: '2024-12-19',
      type: 'birthday',
      color: 'bg-pink-500',
      allDay: true,
      description: 'Team celebration'
    },
    {
      id: 14,
      title: 'Birthday - Fatimah Zahra',
      date: '2024-12-24',
      type: 'birthday',
      color: 'bg-pink-500',
      allDay: true,
      description: 'Team celebration'
    },
    // Company Events
    {
      id: 15,
      title: 'Year-End Town Hall',
      date: '2024-12-23',
      startTime: '16:00',
      endTime: '18:00',
      type: 'event',
      color: 'bg-orange-500',
      location: 'Main Auditorium',
      attendees: ['All Staff'],
      description: 'Annual company-wide gathering'
    },
    {
      id: 16,
      title: 'Team Building Activity',
      date: '2024-12-27',
      startTime: '09:00',
      endTime: '17:00',
      type: 'event',
      color: 'bg-orange-500',
      location: 'Outdoor Park',
      attendees: ['All Staff'],
      description: 'Annual team building event'
    },
  ];

  const eventTypeConfig = {
    leave: { icon: Plane, label: 'Leave', color: 'blue' },
    training: { icon: BookOpen, label: 'Training', color: 'purple' },
    meeting: { icon: Briefcase, label: 'Meeting', color: 'green' },
    holiday: { icon: Star, label: 'Holiday', color: 'red' },
    birthday: { icon: Heart, label: 'Birthday', color: 'pink' },
    event: { icon: PartyPopper, label: 'Event', color: 'orange' },
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-gray-50 border border-gray-200" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      days.push(
        <div
          key={day}
          className={`min-h-[120px] border border-gray-200 p-2 ${
            isWeekend ? 'bg-gray-50' : 'bg-white'
          } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className={`text-sm mb-2 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
            {isToday && (
              <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full text-center leading-6 text-xs mr-1">
                {day}
              </span>
            )}
            {!isToday && day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  setShowEventModal(true);
                }}
                className={`w-full text-left text-xs px-2 py-1 rounded ${event.color} text-white truncate hover:opacity-80 transition-opacity`}
              >
                {event.startTime && `${event.startTime} `}
                {event.title}
              </button>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 px-2">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {weekDays.map((day) => (
            <div key={day} className="py-3 text-center text-sm text-gray-600">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    const upcomingEvents = events
      .filter(event => new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 20);

    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="divide-y divide-gray-200">
          {upcomingEvents.map((event) => {
            const EventIcon = eventTypeConfig[event.type].icon;
            return (
              <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-2xl text-gray-900">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                  <div className={`w-1 h-full ${event.color} rounded-full`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <EventIcon className="w-4 h-4 text-gray-400" />
                          <h3 className="text-gray-900">{event.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded bg-${eventTypeConfig[event.type].color}-100 text-${eventTypeConfig[event.type].color}-700`}>
                            {eventTypeConfig[event.type].label}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-500 mb-2">{event.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {event.startTime && event.endTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {event.startTime} - {event.endTime}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                          )}
                          {event.attendees && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.attendees.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-7 h-7 text-blue-600" />
              Calendar
            </h1>
            <p className="text-gray-500">Manage events, leave, training & holidays</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Event
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Current Date */}
            <h2 className="text-xl text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
          </div>

          {/* View Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {['month', 'week', 'day', 'agenda'].map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType as CalendarView)}
                  className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                    view === viewType
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {viewType}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {Object.entries(eventTypeConfig).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={`w-3 h-3 rounded bg-${config.color}-500`} />
                  <Icon className="w-4 h-4" />
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {view === 'month' && renderMonthView()}
        {view === 'agenda' && renderAgendaView()}
        {view === 'week' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
            <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Week view coming soon</p>
          </div>
        )}
        {view === 'day' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
            <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Day view coming soon</p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${selectedEvent.color} rounded-lg flex items-center justify-center`}>
                    {React.createElement(eventTypeConfig[selectedEvent.type].icon, {
                      className: 'w-6 h-6 text-white'
                    })}
                  </div>
                  <div>
                    <h2 className="text-xl text-gray-900">{selectedEvent.title}</h2>
                    <span className={`inline-block mt-1 text-xs px-2 py-1 rounded bg-${eventTypeConfig[selectedEvent.type].color}-100 text-${eventTypeConfig[selectedEvent.type].color}-700`}>
                      {eventTypeConfig[selectedEvent.type].label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-900">
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {selectedEvent.startTime && selectedEvent.endTime && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="text-gray-900">
                        {selectedEvent.startTime} - {selectedEvent.endTime}
                      </p>
                    </div>
                  </div>
                )}

                {selectedEvent.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-900">{selectedEvent.location}</p>
                    </div>
                  </div>
                )}

                {selectedEvent.attendees && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Attendees</p>
                      <p className="text-gray-900">{selectedEvent.attendees.join(', ')}</p>
                    </div>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5" /> {/* Spacer */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Description</p>
                      <p className="text-gray-900">{selectedEvent.description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Event
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
