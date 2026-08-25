import React, { createContext, useContext, useState } from 'react';

export interface Child {
  id: string;
  name: string;
  grade: string;
  school: string;
  status: string; // e.g., 'Day off', 'Present (08:00 - 15:30)'
  avatar: any;
}

export interface UpcomingEvent {
  id: string;
  childId?: string;
  title: string;
  time: string;
  dateStr: string;
  type: 'absence' | 'event' | 'leave';
  color: string; // 'green' | 'purple' | 'blue'
}

export interface Message {
  id: string;
  sender: string;
  role: string;
  childName: string;
  text: string;
  time: string;
  unread: boolean;
}

export interface AbsenceRecord {
  id: string;
  childId: string;
  date: string;
  type: 'Full Day' | 'Partial Day';
  timeSlot?: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Excused';
  submittedAt: string;
}

export interface LeaveApplication {
  id: string;
  childId: string;
  leaveType: 'School' | 'Preschool/Leisure';
  startDate: string;
  endDate: string;
  reason: string;
  comment?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface ChildcareSchedule {
  childId: string;
  startDate: string;
  repeatPattern: string; // 'Every Week' | 'Every 2 Weeks'
  days: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'me' for parent, or contact id
  text: string;
  time: string;
  isMe: boolean;
}

export interface ChatThread {
  id: string;
  contactName: string;
  contactRole: string;
  contactInitial: string;
  contactColor: string;
  childName: string;
  childId: string;
  messages: ChatMessage[];
  unreadCount: number;
  lastMessageTime: string;
}

export interface SchoolContact {
  id: string;
  name: string;
  role: string;
  school: string;
  initial: string;
  color: string;
  threadId?: string; // links to existing chat thread if any
}

interface AppState {
  children: Child[];
  upcomingEvents: UpcomingEvent[];
  messages: Message[];
  absences: AbsenceRecord[];
  leaves: LeaveApplication[];
  schedules: ChildcareSchedule[];
  chatThreads: ChatThread[];
  schoolContacts: SchoolContact[];
  reportAbsence: (childId: string, type: 'Full Day' | 'Partial Day', date: string, timeSlot: string, reason: string) => void;
  applyForLeave: (application: Omit<LeaveApplication, 'id' | 'status' | 'submittedAt'>) => void;
  submitSchedule: (schedule: ChildcareSchedule) => void;
  sendMessage: (childId: string, recipient: string, topic: string, text: string) => void;
  sendChatMessage: (threadId: string, text: string) => void;
  updateChildStatus: (childId: string, status: string) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children: reactChildren }) => {
  const [children, setChildren] = useState<Child[]>([
    {
      id: 'peter',
      name: 'Peter Andersson',
      grade: 'Preschool',
      school: 'Pinewood Preschool',
      status: 'In class',
      avatar: require('../../assets/images/Kid1.png'),
    },
    {
      id: 'linda',
      name: 'Linda Andersson',
      grade: 'Preschool',
      school: 'Pinewood Preschool',
      status: 'Day off',
      avatar: require('../../assets/images/Kid2.png'),
    },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([
    {
      id: 'event-1',
      childId: 'peter',
      title: 'Peter day-off',
      time: '10:00-13:00',
      dateStr: 'Thu, 12 Aug',
      type: 'absence',
      color: '#00B074', // Green
    },
    {
      id: 'event-2',
      title: 'School family meet',
      time: '10:00-13:00',
      dateStr: 'Thu, 8 Oct',
      type: 'event',
      color: '#4E33D9', // Primary CUI Purple
    },
    {
      id: 'event-3',
      childId: 'linda',
      title: 'Linda day-off',
      time: '10:00-13:00',
      dateStr: 'Thu, 2 Aug',
      type: 'absence',
      color: '#3B82F6', // Blue
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'Mrs. Sarah Jenkins',
      role: 'Class Teacher',
      childName: 'Peter Andersson',
      text: 'Hello Tom, just wanted to check if Peter is attending the outdoor field trip next Tuesday.',
      time: '10:30 AM',
      unread: true,
    },
    {
      id: 'msg-2',
      sender: 'Mr. David Miller',
      role: 'Preschool Lead',
      childName: 'Linda Andersson',
      text: 'Hi, we notice Linda forgot her water bottle today. It is kept at the front reception desk.',
      time: 'Yesterday',
      unread: false,
    },
  ]);

  const [absences, setAbsences] = useState<AbsenceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [schedules, setSchedules] = useState<ChildcareSchedule[]>([
    {
      childId: 'peter',
      startDate: '2026-07-01',
      repeatPattern: 'Every Week',
      days: {
        monday: '08:00 - 15:30',
        tuesday: '08:00 - 15:30',
        wednesday: '08:00 - 15:30',
        thursday: '08:00 - 15:30',
        friday: '08:00 - 14:00',
      },
    },
    {
      childId: 'linda',
      startDate: '2026-07-01',
      repeatPattern: 'Every Week',
      days: {
        monday: '08:30 - 15:00',
        tuesday: '08:30 - 15:00',
        wednesday: '08:30 - 15:00',
        thursday: '08:30 - 15:00',
        friday: '08:30 - 14:30',
      },
    },
  ]);

  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      id: 'thread-sarah',
      contactName: 'Sarah Jenkins',
      contactRole: 'Class Teacher',
      contactInitial: 'S',
      contactColor: '#4E33D9',
      childName: 'Peter Andersson',
      childId: 'peter',
      lastMessageTime: '10:30 AM',
      unreadCount: 1,
      messages: [
        { id: 'cm-1', senderId: 'sarah', text: 'Good morning Tony! I wanted to check if Peter will be joining us for the outdoor field trip next Tuesday?', time: '9:15 AM', isMe: false },
        { id: 'cm-2', senderId: 'me', text: 'Hi Mrs. Jenkins! Yes, he is very excited about the trip. Do we need to pack anything special?', time: '9:22 AM', isMe: true },
        { id: 'cm-3', senderId: 'sarah', text: 'Great to hear! Please pack a rain jacket, water bottle, and a small snack. We will provide lunch at the farm. 🌿', time: '9:40 AM', isMe: false },
        { id: 'cm-4', senderId: 'me', text: 'Perfect, will do! What time should we drop him off that day?', time: '10:05 AM', isMe: true },
        { id: 'cm-5', senderId: 'sarah', text: "Please have him here by 8:00 AM sharp — the bus departs at 8:30. I'll send a reminder the day before!", time: '10:15 AM', isMe: false },
        { id: 'cm-6', senderId: 'me', text: 'Thank you! Looking forward to it. 😊', time: '10:30 AM', isMe: true },
      ],
    },
    {
      id: 'thread-david',
      contactName: 'David Miller',
      contactRole: 'Preschool Lead',
      contactInitial: 'D',
      contactColor: '#00B074',
      childName: 'Linda Andersson',
      childId: 'linda',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      messages: [
        { id: 'cm-7', senderId: 'david', text: 'Hi Tony, just a heads up — Linda forgot her water bottle at school today. We\'ve kept it safe at the front desk.', time: '2:45 PM', isMe: false },
        { id: 'cm-8', senderId: 'me', text: 'Oh thank you for letting me know! I\'ll pick it up tomorrow morning.', time: '3:10 PM', isMe: true },
        { id: 'cm-9', senderId: 'david', text: 'No problem at all. Also, Linda did really well during the painting activity today — she made a lovely landscape! 🎨', time: '3:15 PM', isMe: false },
        { id: 'cm-10', senderId: 'me', text: 'That\'s wonderful to hear! She loves painting. Can we see her work at pickup?', time: '3:30 PM', isMe: true },
        { id: 'cm-11', senderId: 'david', text: 'Absolutely! It\'s drying on the easel rack. We\'ll have it ready for you. See you tomorrow!', time: '3:35 PM', isMe: false },
      ],
    },
  ]);

  const [schoolContacts] = useState<SchoolContact[]>([
    { id: 'contact-sarah', name: 'Sarah Jenkins', role: 'Class Teacher', school: 'Pinewood Preschool', initial: 'S', color: '#4E33D9', threadId: 'thread-sarah' },
    { id: 'contact-david', name: 'David Miller', role: 'Preschool Lead', school: 'Pinewood Preschool', initial: 'D', color: '#00B074', threadId: 'thread-david' },
    { id: 'contact-anna', name: 'Anna Lindqvist', role: 'Class Teacher', school: 'Pinewood Preschool', initial: 'A', color: '#3B82F6' },
    { id: 'contact-erik', name: 'Erik Johansson', role: 'Head of School', school: 'Pinewood Preschool', initial: 'E', color: '#F97316' },
    { id: 'contact-maria', name: 'Maria Svensson', role: 'Administration', school: 'Pinewood Preschool', initial: 'M', color: '#EC4899' },
    { id: 'contact-karin', name: 'Karin Nilsson', role: 'School Nurse', school: 'Pinewood Preschool', initial: 'K', color: '#EF4444' },
  ]);

  const reportAbsence = (
    childId: string,
    type: 'Full Day' | 'Partial Day',
    date: string,
    timeSlot: string,
    reason: string
  ) => {
    const newAbsence: AbsenceRecord = {
      id: `abs-${Date.now()}`,
      childId,
      date,
      type,
      timeSlot: type === 'Partial Day' ? timeSlot : undefined,
      reason,
      status: 'Excused',
      submittedAt: new Date().toISOString(),
    };

    setAbsences((prev) => [newAbsence, ...prev]);

    // Format date for display
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

    const child = children.find((c) => c.id === childId);

    // Update child status to Excused / Day off
    setChildren((prev) =>
      prev.map((c) => (c.id === childId ? { ...c, status: 'Day off' } : c))
    );

    // Add to upcoming events
    const newEvent: UpcomingEvent = {
      id: `event-abs-${Date.now()}`,
      childId,
      title: `${child ? child.name.split(' ')[0] : 'Child'} day-off`,
      time: type === 'Full Day' ? 'All Day' : timeSlot,
      dateStr: formattedDate,
      type: 'absence',
      color: childId === 'peter' ? '#00B074' : '#3B82F6',
    };

    setUpcomingEvents((prev) => [newEvent, ...prev]);
  };

  const applyForLeave = (app: Omit<LeaveApplication, 'id' | 'status' | 'submittedAt'>) => {
    const newLeave: LeaveApplication = {
      ...app,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    setLeaves((prev) => [newLeave, ...prev]);

    // Format date range for upcoming events list
    const start = new Date(app.startDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
    const end = new Date(app.endDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
    
    const child = children.find((c) => c.id === app.childId);

    const newEvent: UpcomingEvent = {
      id: `event-leave-${Date.now()}`,
      childId: app.childId,
      title: `${child ? child.name.split(' ')[0] : 'Child'} Leave: ${app.reason}`,
      time: 'Planned Leave',
      dateStr: `${start} - ${end}`,
      type: 'leave',
      color: '#FF8A00', // Warning orange color
    };

    setUpcomingEvents((prev) => [newEvent, ...prev]);
  };

  const submitSchedule = (sched: ChildcareSchedule) => {
    setSchedules((prev) => {
      const filtered = prev.filter((s) => s.childId !== sched.childId);
      return [sched, ...filtered];
    });

    // Update child status to show schedule active
    setChildren((prev) =>
      prev.map((c) =>
        c.id === sched.childId
          ? { ...c, status: 'Present (Schedule Updated)' }
          : c
      )
    );
  };

  const sendMessage = (childId: string, recipient: string, topic: string, text: string) => {
    const child = children.find((c) => c.id === childId);
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: recipient,
      role: 'Staff / Topic: ' + topic,
      childName: child ? child.name : 'All Children',
      text,
      time: 'Just now',
      unread: false,
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const sendChatMessage = (threadId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: `cm-${Date.now()}`,
      senderId: 'me',
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      isMe: true,
    };
    setChatThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              messages: [...thread.messages, newMessage],
              lastMessageTime: 'Just now',
            }
          : thread
      )
    );
  };

  const updateChildStatus = (childId: string, status: string) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === childId ? { ...c, status } : c))
    );
  };

  return (
    <AppStateContext.Provider
      value={{
        children,
        upcomingEvents,
        messages,
        absences,
        leaves,
        schedules,
        chatThreads,
        schoolContacts,
        reportAbsence,
        applyForLeave,
        submitSchedule,
        sendMessage,
        sendChatMessage,
        updateChildStatus,
      }}
    >
      {reactChildren}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
