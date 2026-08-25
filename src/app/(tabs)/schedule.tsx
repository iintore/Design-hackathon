import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppState } from '@/context/AppStateContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '@/components/BottomSheet';

const parseTimeToMinutes = (timeStr: string) => {
  if (!timeStr || timeStr.toLowerCase() === 'all day') return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export default function ScheduleScreen() {
  const router = useRouter();
  const { children, schedules, absences, leaves } = useAppState();
  const [selectedChildId, setSelectedChildId] = useState(children[0].id);
  const [selectedDate, setSelectedDate] = useState('2025-01-06'); 
  const [calendarMode, setCalendarMode] = useState<'month' | 'week'>('month');
  const [selectedEventForSheet, setSelectedEventForSheet] = useState<any | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0];

  const weeks = [
    [null, null, null, '2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04'],
    ['2025-01-05', '2025-01-06', '2025-01-07', '2025-01-08', '2025-01-09', '2025-01-10', '2025-01-11'],
    ['2025-01-12', '2025-01-13', '2025-01-14', '2025-01-15', '2025-01-16', '2025-01-17', '2025-01-18'],
    ['2025-01-19', '2025-01-20', '2025-01-21', '2025-01-22', '2025-01-23', '2025-01-24', '2025-01-25'],
    ['2025-01-26', '2025-01-27', '2025-01-28', '2025-01-29', '2025-01-30', '2025-01-31', null],
  ];

  const getActiveWeekIndex = (date: string) => {
    const idx = weeks.findIndex((w) => w.includes(date));
    return idx === -1 ? 1 : idx;
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 30 && calendarMode === 'month') {
      setCalendarMode('week');
    } else if (offsetY < 10 && calendarMode === 'week') {
      setCalendarMode('month');
    }
  };

  // Calendar dates for the week of Jan 5 - Jan 11, 2025
  const weekDays = [
    { dayName: 'M', dateStr: '2025-01-05', dateNum: '5' },
    { dayName: 'T', dateStr: '2025-01-06', dateNum: '6', label: 'TODAY' },
    { dayName: 'W', dateStr: '2025-01-07', dateNum: '7' },
    { dayName: 'T', dateStr: '2025-01-08', dateNum: '8' },
    { dayName: 'F', dateStr: '2025-01-09', dateNum: '9' },
    { dayName: 'S', dateStr: '2025-01-10', dateNum: '10' },
    { dayName: 'S', dateStr: '2025-01-11', dateNum: '11' },
  ];

  // Actual school class timetable data
  const classTimetable = {
    monday: [
      { time: '08:00 AM', title: 'Registration & Warm-up', sub: 'Morning registration and warm-up storytelling', color: 'green', rightTime: '08:00 AM' },
      { time: '08:45 AM', title: 'Advanced Mathematics', sub: 'Calculus concepts and algebraic reasoning puzzles', color: 'blue', rightTime: '08:45 AM', rightTimeSub: '10:00 AM' },
      { time: '10:00 AM', title: 'Chemistry Lab & Volcanoes', sub: 'Fun safe chemical reaction experiments', color: 'orange', rightTime: '10:00 AM', rightTimeSub: '11:30 AM' },
      { time: '11:30 AM', title: 'Reading Comprehension', sub: 'Vocabulary quizzes and literary discussion circle', color: 'blue', rightTime: '11:30 AM', rightTimeSub: '12:15 PM' },
      { time: '12:15 PM', title: 'School Cafeteria Lunch', sub: 'Hot meal served at school dining hall', color: 'blue', rightTime: '12:15 PM', rightTimeSub: '01:00 PM' },
      { time: '01:00 PM', title: 'Quiet Rest Time', sub: 'Relaxing music on mats', color: 'purple', rightTime: '01:00 PM', rightTimeSub: '02:00 PM' },
      { time: '02:00 PM', title: 'Athletics & Soccer', sub: 'Field training and team match play', color: 'red', rightTime: '02:00 PM', rightTimeSub: '03:00 PM' },
      { time: '03:00 PM', title: 'Crafting & Pickup', sub: 'Handmade origami and parent checkout', color: 'purple', rightTime: '03:00 PM', rightTimeSub: '03:30 PM' },
    ],
    tuesday: [
      { time: '08:00 AM', title: 'Assembly & Morning Greeting', sub: 'School-wide announcements and warm-up', color: 'green', rightTime: '08:00 AM' },
      { time: '08:30 AM', title: 'Physics & Gravity Experiments', sub: 'Measuring falling velocities and drop tests', color: 'teal', rightTime: '08:30 AM', rightTimeSub: '10:00 AM' },
      { time: '10:00 AM', title: 'Outdoor Recess & Play', sub: 'Supervised playground activities and outdoor play', color: 'blue', rightTime: '10:00 AM', rightTimeSub: '10:30 AM' },
      { time: '10:30 AM', title: 'Historical Stories & Writing', sub: 'Biographies of ancient innovators and writing logs', color: 'yellow', rightTime: '10:30 AM', rightTimeSub: '11:30 AM' },
      { time: '11:30 AM', title: 'Creative Easel Sketching', sub: 'Still-life drawing with charcoal and pastels', color: 'blue', rightTime: '11:30 AM', rightTimeSub: '12:30 PM' },
      { time: '12:30 PM', title: 'School Cafeteria Lunch', sub: 'Hot meal served at school dining hall', color: 'blue', rightTime: '12:30 PM', rightTimeSub: '01:30 PM' },
      { time: '01:30 PM', title: 'Geometry Puzzles', sub: 'Tangram matching and 3D shape construction', color: 'purple', rightTime: '01:30 PM', rightTimeSub: '02:30 PM' },
      { time: '02:30 PM', title: 'Drama Class & Pickup', sub: 'Creative costume play and pickup from class', color: 'purple', rightTime: '02:30 PM', rightTimeSub: '03:30 PM' },
    ],
    wednesday: [
      { time: '08:00 AM', title: 'Arrival & Balance Beam Gym', sub: 'Physical coordination and balance beam gym', color: 'green', rightTime: '08:00 AM' },
      { time: '09:00 AM', title: 'Spanish Language Basics', sub: 'Learning common phrases and vocabulary matching', color: 'pink', rightTime: '09:00 AM', rightTimeSub: '10:00 AM' },
      { time: '10:00 AM', title: 'English Phonics Practice', sub: 'Letter pronunciation and spelling blocks', color: 'blue', rightTime: '10:00 AM', rightTimeSub: '11:00 AM' },
      { time: '11:00 AM', title: 'Outdoor Playground Play', sub: 'Supervised playground activities and outdoor play', color: 'blue', rightTime: '11:00 AM', rightTimeSub: '11:30 AM' },
      { time: '11:30 AM', title: 'Biology & Plant Growing', sub: 'Examining plant roots under magnifiers', color: 'blue', rightTime: '11:30 AM', rightTimeSub: '12:30 PM' },
      { time: '12:30 PM', title: 'School Cafeteria Lunch', sub: 'Hot meal served at school dining hall', color: 'blue', rightTime: '12:30 PM', rightTimeSub: '01:30 PM' },
      { time: '01:30 PM', title: 'Cookie Baking & Kitchen Safety', sub: 'Baking and decorating oatmeal cookies safely', color: 'purple', rightTime: '01:30 PM', rightTimeSub: '02:30 PM' },
      { time: '02:30 PM', title: 'Puppet Show & Parent Checkout', sub: 'Teacher-led puppet play and parent pickup', color: 'purple', rightTime: '02:30 PM', rightTimeSub: '03:30 PM' },
    ],
    thursday: [
      { time: '08:00 AM', title: 'Morning Discussion Circle', sub: 'Sharing weekend plans and show-and-tell', color: 'green', rightTime: '08:00 AM' },
      { time: '08:45 AM', title: 'Geography & Maps Study', sub: 'Locating continents and coloring world maps', color: 'blue', rightTime: '08:45 AM', rightTimeSub: '10:00 AM' },
      { time: '10:00 AM', title: 'Outdoor Playground Play', sub: 'Supervised playground activities and outdoor play', color: 'blue', rightTime: '10:00 AM', rightTimeSub: '10:30 AM' },
      { time: '10:30 AM', title: 'Art: Clay Modeling', sub: 'Sculpting animal figurines with air-dry clay', color: 'orange', rightTime: '10:30 AM', rightTimeSub: '11:30 AM' },
      { time: '11:30 AM', title: 'Group Singing & Vocal Practice', sub: 'Choir practice and learning high notes', color: 'blue', rightTime: '11:30 AM', rightTimeSub: '12:30 PM' },
      { time: '12:30 PM', title: 'School Cafeteria Lunch', sub: 'Hot meal served at school dining hall', color: 'blue', rightTime: '12:30 PM', rightTimeSub: '01:30 PM' },
      { time: '01:30 PM', title: 'Lego Robotics Assembly', sub: 'Building motorized Lego cars in pairs', color: 'purple', rightTime: '01:30 PM', rightTimeSub: '02:30 PM' },
      { time: '02:30 PM', title: 'Sketchbook Drawing & Checkout', sub: 'Student sketchbooks and parent checkout', color: 'purple', rightTime: '02:30 PM', rightTimeSub: '03:30 PM' },
    ],
    friday: [
      { time: '08:00 AM', title: 'Arrival & Weekly Recap Circle', sub: 'Reflecting on what we learned this week', color: 'green', rightTime: '08:00 AM' },
      { time: '09:00 AM', title: 'Indoor Obstacle Course Gym', sub: 'Group relay races and coordination tracks', color: 'red', rightTime: '09:00 AM', rightTimeSub: '10:00 AM' },
      { time: '10:00 AM', title: 'Spelling Bee Championship', sub: 'Fun friendly classroom spelling competition', color: 'blue', rightTime: '10:00 AM', rightTimeSub: '11:00 AM' },
      { time: '11:00 AM', title: 'Outdoor Playground Play', sub: 'Supervised playground activities and outdoor play', color: 'blue', rightTime: '11:00 AM', rightTimeSub: '11:30 AM' },
      { time: '11:30 AM', title: 'Animal Kingdom Video Screening', sub: 'Nature documentary about polar bear cubs', color: 'blue', rightTime: '11:30 AM', rightTimeSub: '12:30 PM' },
      { time: '12:30 PM', title: 'School Cafeteria Lunch', sub: 'Hot meal served at school dining hall', color: 'blue', rightTime: '12:30 PM', rightTimeSub: '01:30 PM' },
      { time: '01:30 PM', title: 'Board Games & Puzzles', sub: 'Playing checkers and simple puzzle assemblies', color: 'purple', rightTime: '01:30 PM', rightTimeSub: '02:00 PM' },
      { time: '02:00 PM', title: 'Early Friday Pickup', sub: 'Early dismissal checkout', color: 'purple', rightTime: '02:00 PM', rightTimeSub: '02:30 PM' },
    ],
  };

  const lindaClassTimetable = {
    monday: [
      { time: '08:15 AM', title: 'Warm Greeting & Free Play', sub: 'Morning registration and warm greeting', color: 'green', rightTime: '08:15 AM' },
      { time: '09:00 AM', title: 'Painting & Watercoloring', sub: 'Creative easel work and watercolor blends', color: 'pink', rightTime: '09:00 AM', rightTimeSub: '10:15 AM' },
      { time: '10:15 AM', title: 'Vocabulary Flashcards', sub: 'Fun card matching vocabulary games', color: 'blue', rightTime: '10:15 AM', rightTimeSub: '11:00 AM' },
      { time: '11:00 AM', title: 'Sandpit & Mud Kitchen', sub: 'Supervised sand and mud kitchen play', color: 'blue', rightTime: '11:00 AM', rightTimeSub: '11:30 AM' },
      { time: '11:30 AM', title: 'French Songs & Nursery Rhymes', sub: 'Learning nursery tunes in French', color: 'teal', rightTime: '11:30 AM', rightTimeSub: '12:15 PM' },
      { time: '12:15 PM', title: 'Preschool Picnic Lunch', sub: 'Outdoors picnic lunch provided by school kitchen', color: 'orange', rightTime: '12:15 PM', rightTimeSub: '01:00 PM' },
      { time: '01:00 PM', title: 'Sleeping Mat Rest Time', sub: 'Resting period with soft background music', color: 'purple', rightTime: '01:00 PM', rightTimeSub: '02:00 PM' },
      { time: '02:00 PM', title: 'Finger Puppets & Drama', sub: 'Interactive finger puppets story circle', color: 'yellow', rightTime: '02:00 PM', rightTimeSub: '02:45 PM' },
      { time: '02:45 PM', title: 'Cleanup & Dismissal', sub: 'Cleaning the tables and checkout', color: 'purple', rightTime: '02:45 PM', rightTimeSub: '03:15 PM' },
    ],
    tuesday: [
      { time: '08:30 AM', title: 'Morning Soft Blocks Play', sub: 'Soft building block assemblies and puzzles', color: 'green', rightTime: '08:30 AM' },
      { time: '09:15 AM', title: 'Insects & Butterflies Walk', sub: ' Botany observation in school yard', color: 'blue', rightTime: '09:15 AM', rightTimeSub: '10:30 AM' },
      { time: '10:30 AM', title: 'Playdough Shaping Workshop', sub: 'Sculpting structures with colored playdough', color: 'pink', rightTime: '10:30 AM', rightTimeSub: '11:15 AM' },
      { time: '11:15 AM', title: 'Outdoor Swings & Slides', sub: 'Supervised playground activities and outdoor play', color: 'blue', rightTime: '11:15 AM', rightTimeSub: '12:00 PM' },
      { time: '12:00 PM', title: 'Preschool Picnic Lunch', sub: 'Outdoors picnic lunch provided by school kitchen', color: 'orange', rightTime: '12:00 PM', rightTimeSub: '12:45 PM' },
      { time: '12:45 PM', title: 'Sleep & Relaxation Music', sub: 'Calming sounds and nap time', color: 'purple', rightTime: '12:45 PM', rightTimeSub: '01:45 PM' },
      { time: '01:45 PM', title: 'Sound Instruments Exploration', sub: 'Drums, triangles, and coordination', color: 'teal', rightTime: '01:45 PM', rightTimeSub: '02:30 PM' },
      { time: '02:30 PM', title: 'Storybook Circle & Checkout', sub: 'Interactive teacher reading and checkout', color: 'purple', rightTime: '02:30 PM', rightTimeSub: '03:00 PM' },
    ],
    wednesday: [
      { time: '08:30 AM', title: 'Welcome Song & Circle Time', sub: 'Singing welcome songs and daily layout', color: 'green', rightTime: '08:30 AM' },
      { time: '09:00 AM', title: 'Shape Sorting & Colors Game', sub: 'Sorting geometric shapes and color matching', color: 'blue', rightTime: '09:00 AM', rightTimeSub: '10:00 AM' },
      { time: '10:00 AM', title: 'Soft Gymnastics Mat Play', sub: 'Forward rolls and soft padding tumbling', color: 'red', rightTime: '10:00 AM', rightTimeSub: '10:45 AM' },
      { time: '10:45 AM', title: 'Outdoor Sand Castle Building', sub: 'Supervised playground activities and outdoor play', color: 'blue', rightTime: '10:45 AM', rightTimeSub: '11:30 AM' },
      { time: '11:30 AM', title: 'Flower Watering & Gardening', sub: 'Planting and watering school flowerpots', color: 'blue', rightTime: '11:30 AM', rightTimeSub: '12:15 PM' },
      { time: '12:15 PM', title: 'Preschool Picnic Lunch', sub: 'Outdoors picnic lunch provided by school kitchen', color: 'orange', rightTime: '12:15 PM', rightTimeSub: '01:00 PM' },
      { time: '01:00 PM', title: 'Rest Time', sub: 'Quiet rest on sleeping mats', color: 'purple', rightTime: '01:00 PM', rightTimeSub: '02:00 PM' },
      { time: '02:00 PM', title: 'Storytelling Theater & Checkout', sub: 'Dramatic reading and parent checkout', color: 'purple', rightTime: '02:00 PM', rightTimeSub: '02:30 PM' },
    ],
    thursday: [
      { time: '08:30 AM', title: 'Morning Block Construction', sub: 'Building tall towers and tunnels', color: 'green', rightTime: '08:30 AM' },
      { time: '09:00 AM', title: 'Magnets & Mechanics', sub: 'Learning magnetic fields and shapes attraction', color: 'teal', rightTime: '09:00 AM', rightTimeSub: '10:30 AM' },
      { time: '10:30 AM', title: 'Collage Crafting', sub: 'Making paper collage art with safe glue', color: 'pink', rightTime: '10:30 AM', rightTimeSub: '11:30 AM' },
      { time: '11:30 AM', title: 'Outdoor Swings & Slides', sub: 'Supervised playground activities and outdoor play', color: 'blue', rightTime: '11:30 AM', rightTimeSub: '12:15 PM' },
      { time: '12:15 PM', title: 'Preschool Picnic Lunch', sub: 'Outdoors picnic lunch provided by school kitchen', color: 'orange', rightTime: '12:15 PM', rightTimeSub: '01:00 PM' },
      { time: '01:00 PM', title: 'Audiobooks & Rest Time', sub: 'Listening to tales and quiet resting', color: 'purple', rightTime: '01:00 PM', rightTimeSub: '02:00 PM' },
      { time: '02:00 PM', title: 'Wooden Blocks Play & Checkout', sub: 'Creative block building and checkout', color: 'purple', rightTime: '02:00 PM', rightTimeSub: '02:30 PM' },
    ],
    friday: [
      { time: '08:30 AM', title: 'Friday Welcome & Highlights', sub: 'Highlights of the weekly preschool classes', color: 'green', rightTime: '08:30 AM' },
      { time: '09:00 AM', title: 'Costume Dress-up Party', sub: 'Playing dress-up as astronauts, animals, and doctors', color: 'yellow', rightTime: '09:00 AM', rightTimeSub: '10:00 AM' },
      { time: '10:00 AM', title: 'Rhythm Clapping & Drums', sub: 'Coordination games with plastic hand drums', color: 'teal', rightTime: '10:00 AM', rightTimeSub: '11:00 AM' },
      { time: '11:00 AM', title: 'Outdoor Swings & Slides', sub: 'Supervised playground activities and outdoor play', color: 'blue', rightTime: '11:00 AM', rightTimeSub: '11:45 AM' },
      { time: '11:45 AM', title: 'Animal Puppets Show', sub: 'Interactive animal puppets reading show', color: 'blue', rightTime: '11:45 AM', rightTimeSub: '12:30 PM' },
      { time: '12:30 PM', title: 'Preschool Picnic Lunch', sub: 'Outdoors picnic lunch provided by school kitchen', color: 'orange', rightTime: '12:30 PM', rightTimeSub: '01:15 PM' },
      { time: '01:15 PM', title: 'Quiet Reading Corner', sub: 'Reviewing picture books in reading space', color: 'purple', rightTime: '01:15 PM', rightTimeSub: '02:00 PM' },
      { time: '02:00 PM', title: 'Weekend Checkout', sub: 'Early checkout checkout', color: 'purple', rightTime: '02:00 PM', rightTimeSub: '02:30 PM' },
    ],
  };

  const getDateGridInfo = (dateStr: string) => {
    for (let weekIdx = 0; weekIdx < weeks.length; weekIdx++) {
      const dayIdx = weeks[weekIdx].indexOf(dateStr);
      if (dayIdx !== -1) {
        const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayInitials = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        const dayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        return {
          dayKey: dayNames[dayIdx],
          dayInitial: dayInitials[dayIdx],
          dayLabel: dayLabels[dayIdx],
        };
      }
    }
    return { dayKey: 'monday', dayInitial: 'M', dayLabel: 'MON' };
  };

  const getDayOfWeekKey = (dateStr: string): string => {
    return getDateGridInfo(dateStr).dayKey;
  };

  const getTomorrowDateStr = (dateStr: string): string => {
    const mapping: Record<string, string> = {
      '2025-01-05': '2025-01-06',
      '2025-01-06': '2025-01-07',
      '2025-01-07': '2025-01-08',
      '2025-01-08': '2025-01-09',
      '2025-01-09': '2025-01-10',
      '2025-01-10': '2025-01-11',
      '2025-01-11': '2025-01-05',
    };
    return mapping[dateStr] || '2025-01-07';
  };

  const getTomorrowLabel = (dateStr: string): string => {
    const tomorrowStr = getTomorrowDateStr(dateStr);
    const info = getDateGridInfo(tomorrowStr);
    const dateNum = String(parseInt(tomorrowStr.split('-')[2], 10));
    return `${dateNum} ${info.dayLabel}`;
  };

  const getDayNameLabel = (date: string) => {
    return getDateGridInfo(date).dayLabel;
  };

  const getDayLabelString = (date: string) => {
    if (date === '2025-01-06') return 'TODAY';
    if (date === '2025-01-07') return 'TOMORROW';
    return getDateGridInfo(date).dayLabel + 'DAY';
  };

  // Check child's status for the selected date (absence or leave)
  const getAbsenceOrLeaveForDate = (dateStr: string) => {
    // 1. Check absences
    const activeAbsence = absences.find(
      (a) => a.childId === selectedChild.id && a.date === dateStr
    );
    if (activeAbsence) {
      return { type: 'absence', reason: activeAbsence.reason, duration: activeAbsence.type };
    }

    // 2. Check leaves
    const targetDate = new Date(dateStr);
    const activeLeave = leaves.find((l) => {
      if (l.childId !== selectedChild.id) return false;
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      return targetDate >= start && targetDate <= end;
    });

    if (activeLeave) {
      return { type: 'leave', reason: activeLeave.reason, duration: 'Planned Leave' };
    }

    return null;
  };

  // Get active schedule from context
  const getChildScheduleForDate = (dateStr: string) => {
    const childSched = schedules.find((s) => s.childId === selectedChild.id);
    if (!childSched) return null;

    const dayKey = getDayOfWeekKey(dateStr);
    return childSched.days[dayKey as keyof typeof childSched.days];
  };

  const getTimetableForDate = (dateStr: string, childId: string) => {
    const dayKey = getDayOfWeekKey(dateStr);
    const classes = childId === 'linda'
      ? lindaClassTimetable[dayKey as keyof typeof lindaClassTimetable]
      : classTimetable[dayKey as keyof typeof classTimetable];
    if (!classes) return [];

    const childSched = schedules.find((s) => s.childId === childId);
    if (!childSched) return [];
    
    const hours = childSched.days[dayKey as keyof typeof childSched.days];
    if (!hours) return [];

    const [startStr, endStr] = hours.split('-').map(s => s.trim());
    
    const child = children.find((c) => c.id === childId) || selectedChild;

    // Adjust start and end class items
    return classes.map((item, idx) => {
      if (idx === 0) {
        return {
          ...item,
          time: startStr,
          rightTime: startStr,
          sub: `Scheduled start at ${child.school}`,
        };
      }
      if (idx === classes.length - 1) {
        return {
          ...item,
          time: endStr,
          rightTime: endStr,
          sub: `Scheduled pickup from class`,
        };
      }
      return item;
    });
  };

  const getEventsForDate = (dateStr: string, childId: string) => {
    const classes = getTimetableForDate(dateStr, childId);
    const schoolEvents: Record<string, any[]> = {
      '2025-01-05': [
        {
          id: 'school-event-1',
          time: '09:00 AM',
          title: 'Submit next week schedule',
          sub: 'Verify and submit childcare hours before Monday deadline',
          color: 'red',
          icon: 'alarm-outline',
          rightTime: 'All Day',
          type: 'school_event',
          location: 'IST Home App',
          description: 'Municipal rules require parents to submit the upcoming weekly childcare schedule 7 days in advance. Please fill out details for Linda and Peter.'
        }
      ],
      '2025-01-06': [
        {
          id: 'school-event-2',
          time: '03:30 PM',
          title: 'Pickup window opens',
          sub: 'Scheduled pickup window from Pinewood Preschool',
          color: 'blue',
          icon: 'car-outline',
          rightTime: '03:30 PM',
          rightTimeSub: '05:00 PM',
          type: 'school_event',
          location: 'Pinewood Preschool main gate',
          description: 'The front entrance driveway opens for parents picking up children. Please display your digital pick-up pass at the gate.'
        }
      ],
      '2025-01-07': [
        {
          id: 'school-event-3',
          time: '06:00 PM',
          title: 'Parent meeting',
          sub: 'Annual parent-teacher evening meeting',
          color: 'blue',
          icon: 'school-outline',
          rightTime: '06:00 PM',
          rightTimeSub: '07:00 PM',
          type: 'school_event',
          location: 'Skagon Preschool Hall A',
          description: 'Join us to discuss curriculum goals, outdoor play guidelines, and upcoming winter activities. Coffee and refreshments will be served.'
        }
      ],
      '2025-01-08': [
        {
          id: 'school-event-4',
          time: '09:00 AM',
          title: 'Summer recital',
          sub: 'School recital concert at Getingerns auditorium',
          color: 'purple',
          icon: 'school-outline',
          rightTime: '09:00 AM',
          rightTimeSub: '11:00 AM',
          type: 'school_event',
          location: 'Getingerns Gymnasieskola auditorium',
          description: 'All children will participate in the music and choir recital. Please dress in comfortable white or light blue clothing.'
        }
      ]
    };
    const extraEvents = schoolEvents[dateStr] || [];
    return [...classes, ...extraEvents];
  };

  const allDaysInMonth = Array.from({ length: 31 }, (_, i) => {
    const dateNum = i + 1;
    const dateStr = `2025-01-${String(dateNum).padStart(2, '0')}`;
    return {
      dateStr,
      dateNum: String(dateNum),
    };
  });

  const activeDateInfo = weekDays.find((d) => d.dateStr === selectedDate) || weekDays[1];
  const scheduleForSelectedDate = getChildScheduleForDate(selectedDate);
  const statusForSelectedDate = getAbsenceOrLeaveForDate(selectedDate);
  const isWeekend = activeDateInfo.dayName === 'S';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.calendarScreenHeader}>
        <View style={styles.headerLeftContainer}>
          <Image source={selectedChild.avatar} style={styles.headerProfileImage} />
          <View>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerCalendarTitle}>Calendar</Text>
              <Ionicons name="chevron-down" size={14} color={Colors.light.text} style={{ marginLeft: 4, marginTop: 4 }} />
            </View>
            <Text style={styles.headerCalendarSub}>All school events</Text>
          </View>
        </View>
        <View style={styles.headerRightContainer}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.push('/flows/submit-schedule')}>
            <Ionicons name="add" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.push('/(tabs)/messages')}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Persistent Child Selector */}
      <View style={styles.childSelectorContainer}>
        <View style={styles.selectorRow}>
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              onPress={() => setSelectedChildId(child.id)}
              style={[
                styles.childButton,
                selectedChildId === child.id && styles.childButtonActive,
              ]}
              activeOpacity={0.8}
            >
              <Image source={child.avatar} style={styles.childAvatarImage} />
              <View>
                <Text
                  style={[
                    styles.childButtonText,
                    selectedChildId === child.id && styles.childButtonTextActive,
                  ]}
                >
                  {child.name.split(' ')[0]}
                </Text>
                <Text style={styles.childSub}>{child.grade}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Horizontal Scrolling Calendar Strip (Full Width) */}
      <View style={styles.horizontalCalendarBar}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalCalendarScroll}
        >
          {allDaysInMonth.map((wd) => {
            const isSelected = selectedDate === wd.dateStr;
            const dateInfo = getDateGridInfo(wd.dateStr);
            const isDayWeekend = dateInfo.dayKey === 'saturday' || dateInfo.dayKey === 'sunday';

            return (
              <TouchableOpacity
                key={wd.dateStr}
                onPress={() => setSelectedDate(wd.dateStr)}
                style={styles.horizontalDayBlock}
                activeOpacity={0.8}
              >
                <Text style={[styles.horizontalDayInitial, isSelected && styles.horizontalDayInitialSelected]}>
                  {dateInfo.dayInitial}
                </Text>
                <View style={[
                  styles.horizontalDateCircle,
                  isSelected && styles.horizontalDateCircleSelected
                ]}>
                  <Text style={[
                    styles.horizontalDateNum,
                    isSelected && styles.horizontalDateNumSelected,
                    isDayWeekend && !isSelected && styles.horizontalDateNumWeekend
                  ]}>
                    {wd.dateNum}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Add / Adjust Change Bar */}
        <View style={styles.quickAddRow}>
          <View style={styles.quickAddBadge}>
            <Text style={styles.quickAddBadgeNum}>{activeDateInfo.dateNum}</Text>
            <Text style={styles.quickAddBadgeDay}>{getDayNameLabel(selectedDate)}</Text>
          </View>
          <TouchableOpacity
            style={styles.quickAddInputContainer}
            onPress={() => router.push('/flows/submit-schedule')}
            activeOpacity={0.9}
          >
            <Ionicons name="add" size={20} color={Colors.light.primary} style={styles.quickAddPlusIcon} />
            <Text style={styles.quickAddPlaceholder}>Quick adjust today's hours...</Text>
            <Ionicons name="checkmark-circle" size={20} color="#C4C4C6" style={styles.quickCheckIcon} />
          </TouchableOpacity>
        </View>

        {/* Title Header: TODAY / TOMORROW / DAY NAME */}
        <View style={styles.timelineHeaderRow}>
          <Text style={styles.timelineHeaderText}>{getDayLabelString(selectedDate)}</Text>
          {scheduleForSelectedDate && !statusForSelectedDate && !isWeekend && (
            <View style={styles.countBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              <Text style={styles.countBadgeText}>
                {getEventsForDate(selectedDate, selectedChild.id).length}
              </Text>
            </View>
          )}
        </View>

        {/* Schedule timeline list */}
        <View style={styles.timelineContainer}>
          {/* If there is an absence/leave report */}
          {statusForSelectedDate ? (
            <View style={styles.statusCard}>
              <View style={[styles.statusLine, { backgroundColor: statusForSelectedDate.type === 'absence' ? '#FF8A00' : '#4E33D9' }]} />
              <Ionicons 
                name={statusForSelectedDate.type === 'absence' ? 'alert-circle' : 'calendar'} 
                size={36} 
                color={statusForSelectedDate.type === 'absence' ? '#FF8A00' : '#4E33D9'} 
                style={styles.statusCardIcon} 
              />
              <View style={styles.statusCardContent}>
                <Text style={styles.statusCardTitle}>
                  {statusForSelectedDate.type === 'absence' ? 'Absence Reported' : 'Planned Leave'}
                </Text>
                <Text style={styles.statusCardDesc}>
                  Reason: {statusForSelectedDate.reason} ({statusForSelectedDate.duration})
                </Text>
                <Text style={styles.statusCardInfo}>Excused • School & teachers notified</Text>
              </View>
            </View>
          ) : isWeekend ? (
            /* If Weekend */
            <View style={styles.weekendCard}>
              <Ionicons name="cafe-outline" size={40} color={Colors.light.textSecondary} style={styles.weekendIcon} />
              <Text style={styles.weekendTitle}>School Closed</Text>
              <Text style={styles.weekendDesc}>
                It's the weekend! Enjoy family time and play. No attendance scheduled.
              </Text>
            </View>
          ) : scheduleForSelectedDate ? (
            /* If normal attendance hours */
            <View style={styles.timelineList}>
              {/* Draw Vertical Current Time Indicator Line (only for Today!) */}
              {selectedDate === '2025-01-06' && (
                <View style={styles.currentTimeWrapper}>
                  {/* Left Indicator Badge */}
                  <View style={styles.currentTimeBadge}>
                    <Text style={styles.currentTimeText}>9:42 AM</Text>
                  </View>
                  {/* Dotted Red Line traversing the layout */}
                  <View style={styles.redTimelineLine} />
                </View>
              )}

              {/* Dynamic Class & Event Items */}
              {(() => {
                const dayEvents = getEventsForDate(selectedDate, selectedChild.id);
                const sortedEvents = [...dayEvents].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

                return sortedEvents.map((item, index, arr) => {
                  let cardStyle = styles.cardBlue;
                  if (item.color === 'red') {
                    cardStyle = styles.cardRed;
                  } else if (item.color === 'green') {
                    cardStyle = styles.cardGreen;
                  } else if (item.color === 'purple') {
                    cardStyle = styles.cardPurple;
                  } else if (item.color === 'blue') {
                    cardStyle = styles.cardBlue;
                  } else {
                    if (index === 0) cardStyle = styles.cardGreen;
                    else if (index === arr.length - 1) cardStyle = styles.cardPurple;
                  }

                  return (
                    <View key={index} style={styles.timelineItem}>
                      <Text style={styles.timelineTime}>{item.time}</Text>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setSelectedEventForSheet(item);
                          setIsSheetVisible(true);
                        }}
                        style={[styles.timelineCard, cardStyle]}
                      >
                        <View style={styles.timelineCardContent}>
                          <Text style={styles.timelineCardTitle}>{item.title}</Text>
                          <Text style={styles.timelineCardSub}>{item.sub}</Text>
                        </View>
                        {item.icon ? (
                          <View style={styles.cardRightContainer}>
                            <Ionicons 
                              name={item.icon} 
                              size={20} 
                              color={
                                item.color === 'red' ? '#EF4444' :
                                item.color === 'green' ? '#00B074' :
                                item.color === 'blue' ? '#3B82F6' : Colors.light.primary
                              } 
                              style={{ marginBottom: 4 }} 
                            />
                            {item.rightTime && (
                              <Text style={styles.cardRightTime}>{item.rightTime}</Text>
                            )}
                            {item.rightTimeSub && (
                              <Text style={styles.cardRightTimeSub}>{item.rightTimeSub}</Text>
                            )}
                          </View>
                        ) : (
                          item.rightTime && (
                            <View style={styles.cardRightContainer}>
                              <Text style={styles.cardRightTime}>{item.rightTime}</Text>
                              {item.rightTimeSub && (
                                <Text style={styles.cardRightTimeSub}>{item.rightTimeSub}</Text>
                              )}
                            </View>
                          )
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                });
              })()}
            </View>
          ) : (
            /* If school day but day is unchecked in schedule (Day Off) */
            <View style={styles.statusCard}>
              <View style={[styles.statusLine, { backgroundColor: '#8E8E93' }]} />
              <Ionicons name="calendar-outline" size={36} color="#8E8E93" style={styles.statusCardIcon} />
              <View style={styles.statusCardContent}>
                <Text style={styles.statusCardTitle}>No Attendance Hours</Text>
                <Text style={styles.statusCardDesc}>No schedule has been submitted for this child today.</Text>
                <TouchableOpacity onPress={() => router.push('/flows/submit-schedule')}>
                  <Text style={styles.addHoursLink}>Add hours now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Tomorrow / Next day Section overview */}
        {selectedDate === '2025-01-06' && (() => {
          const tomorrowStr = getTomorrowDateStr(selectedDate);
          const tomorrowClasses = getTimetableForDate(tomorrowStr, selectedChild.id);
          const tomorrowStatus = getAbsenceOrLeaveForDate(tomorrowStr);
          const tomorrowIsWeekend = getDayOfWeekKey(tomorrowStr) === 'saturday' || getDayOfWeekKey(tomorrowStr) === 'sunday';

          const getClassIcon = (title: string): string => {
            const t = title.toLowerCase();
            if (t.includes('music')) return 'musical-notes';
            if (t.includes('art') || t.includes('paint')) return 'color-palette';
            if (t.includes('math') || t.includes('count')) return 'calculator';
            if (t.includes('science') || t.includes('nature')) return 'leaf';
            if (t.includes('bake') || t.includes('kitchen')) return 'cafe';
            if (t.includes('gym') || t.includes('obstacle')) return 'fitness';
            if (t.includes('story') || t.includes('read')) return 'book';
            if (t.includes('play') || t.includes('welcome') || t.includes('arrival')) return 'happy';
            return 'school';
          };

          return (
            <View style={styles.tomorrowSection}>
              <View style={styles.tomorrowHeader}>
                <Text style={styles.tomorrowDateText}>{getTomorrowLabel(selectedDate)}</Text>
                <Text style={styles.tomorrowTitleText}>TOMORROW</Text>
              </View>

              {tomorrowStatus ? (
                <View style={styles.statusCard}>
                  <View style={[styles.statusLine, { backgroundColor: tomorrowStatus.type === 'absence' ? '#FF8A00' : '#4E33D9' }]} />
                  <Ionicons 
                    name={tomorrowStatus.type === 'absence' ? 'alert-circle' : 'calendar'} 
                    size={36} 
                    color={tomorrowStatus.type === 'absence' ? '#FF8A00' : '#4E33D9'} 
                    style={styles.statusCardIcon} 
                  />
                  <View style={styles.statusCardContent}>
                    <Text style={styles.statusCardTitle}>
                      {tomorrowStatus.type === 'absence' ? 'Absence Reported' : 'Planned Leave'}
                    </Text>
                    <Text style={styles.statusCardDesc}>
                      Reason: {tomorrowStatus.reason}
                    </Text>
                  </View>
                </View>
              ) : tomorrowIsWeekend ? (
                <View style={styles.weekendCard}>
                  <Ionicons name="cafe-outline" size={40} color={Colors.light.textSecondary} style={styles.weekendIcon} />
                  <Text style={styles.weekendTitle}>School Closed</Text>
                  <Text style={styles.weekendDesc}>Enjoy family time and play!</Text>
                </View>
              ) : tomorrowClasses.length >= 4 ? (
                <>
                  {/* Card 1: Tomorrow's Morning class (Gradient orange/purple) */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedEventForSheet(tomorrowClasses[1]);
                      setIsSheetVisible(true);
                    }}
                    style={styles.orangeGradientCard}
                  >
                    <View style={styles.orangeCardLeft}>
                      <Ionicons name={getClassIcon(tomorrowClasses[1].title) as any} size={24} color="#FFFFFF" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.orangeCardTitle}>{tomorrowClasses[1].title}</Text>
                        <Text style={styles.orangeCardSub}>{tomorrowClasses[1].sub}</Text>
                      </View>
                    </View>
                    <Text style={{ color: '#FFFFFF', fontFamily: 'Inter-Bold', fontSize: 13 }}>
                      {tomorrowClasses[1].time}
                    </Text>
                  </TouchableOpacity>

                  {/* Card 2: Tomorrow's Afternoon class (Grey card with left border) */}
                  <View style={styles.timelineItemTomorrow}>
                    <Text style={styles.tomorrowTimeText}>{tomorrowClasses[3].time}</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedEventForSheet(tomorrowClasses[3]);
                        setIsSheetVisible(true);
                      }}
                      style={styles.tomorrowActivityCard}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={styles.tomorrowCardContent}>
                          <Text style={styles.tomorrowCardTitle}>{tomorrowClasses[3].title}</Text>
                          <Text style={styles.tomorrowCardSub}>{tomorrowClasses[3].sub}</Text>
                        </View>
                        <Ionicons name={getClassIcon(tomorrowClasses[3].title) as any} size={20} color="#8E8E93" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.statusCard}>
                  <View style={[styles.statusLine, { backgroundColor: '#8E8E93' }]} />
                  <Ionicons name="calendar-outline" size={36} color="#8E8E93" style={styles.statusCardIcon} />
                  <View style={styles.statusCardContent}>
                    <Text style={styles.statusCardTitle}>No Attendance Hours</Text>
                    <Text style={styles.statusCardDesc}>No schedule has been submitted for tomorrow.</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })()}

      </ScrollView>

      {/* Event Details Bottom Sheet */}
      <BottomSheet
        visible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
        title={selectedEventForSheet?.title || 'Event Details'}
      >
        {selectedEventForSheet && (
          <View style={styles.sheetBody}>
            {/* Time row */}
            <View style={styles.sheetDetailRow}>
              <Ionicons name="time-outline" size={20} color={Colors.light.primary} style={styles.sheetDetailIcon} />
              <View>
                <Text style={styles.sheetDetailLabel}>Time</Text>
                <Text style={styles.sheetDetailValue}>
                  {selectedEventForSheet.rightTimeSub
                    ? `${selectedEventForSheet.rightTime} - ${selectedEventForSheet.rightTimeSub}`
                    : selectedEventForSheet.rightTime || selectedEventForSheet.time}
                </Text>
              </View>
            </View>

            {/* Location row */}
            <View style={styles.sheetDetailRow}>
              <Ionicons name="location-outline" size={20} color={Colors.light.primary} style={styles.sheetDetailIcon} />
              <View>
                <Text style={styles.sheetDetailLabel}>Location</Text>
                <Text style={styles.sheetDetailValue}>
                  {selectedEventForSheet.location || selectedChild.school}
                </Text>
              </View>
            </View>

            {/* Description row */}
            <View style={styles.sheetDetailRow}>
              <Ionicons name="document-text-outline" size={20} color={Colors.light.primary} style={styles.sheetDetailIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetDetailLabel}>Description</Text>
                <Text style={styles.sheetDetailValue}>
                  {selectedEventForSheet.description || selectedEventForSheet.sub}
                </Text>
              </View>
            </View>

            {/* Action Buttons: strictly 6px border-radius! */}
            <View style={styles.sheetActions}>
              <TouchableOpacity
                style={[styles.sheetButton, styles.sheetButtonSecondary]}
                onPress={() => setIsSheetVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.sheetButtonTextSecondary}>Close</Text>
              </TouchableOpacity>

              {selectedEventForSheet.type === 'school_event' ? (
                <TouchableOpacity
                  style={[styles.sheetButton, styles.sheetButtonPrimary]}
                  onPress={() => {
                    setIsSheetVisible(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sheetButtonTextPrimary}>Got it</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.sheetButton, styles.sheetButtonPrimary]}
                  onPress={() => {
                    setIsSheetVisible(false);
                    router.push('/flows/report-absence');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sheetButtonTextPrimary}>Report Absence</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 8,
  },
  calendarScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 16 : 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerProfileImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCalendarTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.light.text,
  },
  headerCalendarSub: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  childSelectorContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#F5F5F7',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  childButtonActive: {
    backgroundColor: Colors.light.primaryLight,
    borderColor: Colors.light.primary,
  },
  childAvatarImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  childButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  childButtonTextActive: {
    color: Colors.light.primary,
  },
  childSub: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  weekCalendarContainer: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  weekCalendarScroll: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  weekDayBlock: {
    alignItems: 'center',
    marginRight: 16,
    width: 40,
    paddingBottom: 8,
  },
  weekDayName: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 6,
  },
  weekDayNameSelected: {
    color: Colors.light.text,
    fontFamily: 'Inter-Bold',
  },
  weekDateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  weekDateCircleSelected: {
    backgroundColor: Colors.light.primary,
  },
  weekDateNum: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.text,
  },
  weekDateNumSelected: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  activeDayBar: {
    width: 16,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.light.primary,
    position: 'absolute',
    bottom: 0,
  },
  horizontalCalendarBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingVertical: 12,
  },
  horizontalCalendarScroll: {
    paddingHorizontal: 16,
  },
  horizontalDayBlock: {
    alignItems: 'center',
    marginRight: 18,
    width: 44,
  },
  horizontalDayInitial: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 6,
  },
  horizontalDayInitialSelected: {
    color: Colors.light.primary,
    fontFamily: 'Inter-Bold',
  },
  horizontalDateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  horizontalDateCircleSelected: {
    backgroundColor: Colors.light.primary,
  },
  horizontalDateNum: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.text,
  },
  horizontalDateNumSelected: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  horizontalDateNumWeekend: {
    color: '#94A3B8',
  },
  titleText: {
    fontFamily: 'PPEditorialNew-Regular',
    fontSize: 26,
    color: Colors.light.text,
  },
  quickAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 16,
  },
  quickAddBadge: {
    alignItems: 'center',
    marginRight: 12,
    width: 36,
  },
  quickAddBadgeNum: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.light.primary,
    lineHeight: 20,
  },
  quickAddBadgeDay: {
    fontFamily: 'Inter-Bold',
    fontSize: 9,
    color: Colors.light.primary,
    letterSpacing: 0.5,
  },
  quickAddInputContainer: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  quickAddPlusIcon: {
    marginRight: 8,
  },
  quickAddPlaceholder: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textTertiary,
  },
  quickCheckIcon: {
    marginLeft: 8,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 16,
  },
  timelineHeaderText: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  timelineContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  timelineList: {
    position: 'relative',
  },
  currentTimeWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100, // Positioned traverse the midday lunch area
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentTimeBadge: {
    backgroundColor: '#FF3B30', // Red indicator matching mockup
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  currentTimeText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 9,
  },
  redTimelineLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderStyle: 'dashed',
    marginLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  timelineTime: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    color: Colors.light.textSecondary,
    width: 60,
  },
  timelineCard: {
    flex: 1,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  cardGreen: {
    backgroundColor: '#E6F7F0',
    borderLeftColor: '#00B074',
  },
  cardBlue: {
    backgroundColor: '#EFF6FF',
    borderLeftColor: '#3B82F6',
  },
  cardPurple: {
    backgroundColor: '#F3F2FA',
    borderLeftColor: Colors.light.primary,
  },
  cardRed: {
    backgroundColor: '#FEF2F2',
    borderLeftColor: '#EF4444',
  },
  timelineCardContent: {
    flex: 1,
    paddingRight: 10,
  },
  timelineCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 4,
  },
  timelineCardSub: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  cardRightContainer: {
    alignItems: 'flex-end',
  },
  cardRightTime: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    color: Colors.light.text,
  },
  cardRightTimeSub: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  statusLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  statusCardIcon: {
    marginRight: 16,
  },
  statusCardContent: {
    flex: 1,
  },
  statusCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statusCardDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  statusCardInfo: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.light.primary,
  },
  addHoursLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.light.primary,
    textDecorationLine: 'underline',
    marginTop: 6,
  },
  weekendCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  weekendIcon: {
    marginBottom: 12,
  },
  weekendTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 6,
  },
  weekendDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  tomorrowSection: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  tomorrowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tomorrowDateText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: Colors.light.textSecondary,
    width: 60,
  },
  tomorrowTitleText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.light.textSecondary,
    letterSpacing: -0.5,
  },
  orangeGradientCard: {
    backgroundColor: '#F97316', // Orange theme
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 60,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },
  orangeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  birthdayIcon: {
    marginRight: 12,
  },
  orangeCardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  orangeCardSub: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFE8D6',
  },
  timelineItemTomorrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tomorrowTimeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    color: Colors.light.textSecondary,
    width: 60,
  },
  tomorrowActivityCard: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8E8E93',
  },
  tomorrowCardContent: {
    flex: 1,
  },
  tomorrowCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 4,
  },
  tomorrowCardSub: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  actionContainer: {
    paddingHorizontal: 24,
    marginTop: 8,
    alignItems: 'center',
  },
  adjustScheduleBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 6,
    height: 56,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#4E33D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  adjustScheduleBtnText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  deadlineWarning: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
    maxWidth: '85%',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  calendarMonthText: {
    fontFamily: 'PPEditorialNew-Regular',
    fontSize: 20,
    color: Colors.light.text,
  },
  calendarNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navArrow: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F7',
  },
  weekInitialsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekInitialText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  calendarGrid: {
    marginTop: 4,
  },
  weekGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dayCellButton: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
  },
  emptyDayCell: {
    width: `${100 / 7}%`,
    height: 38,
  },
  dayCellCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellCircleSelected: {
    backgroundColor: Colors.light.primary,
  },
  dayCellText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
  },
  dayCellTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  dayCellTextWeekend: {
    color: '#94A3B8',
  },
  collapseHandle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    marginTop: 12,
  },
  collapseHandleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 4,
  },
  sheetBody: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sheetDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sheetDetailIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  sheetDetailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  sheetDetailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 20,
  },
  sheetActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  sheetButton: {
    flex: 1,
    height: 48,
    borderRadius: 6, // strictly 6px radius
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetButtonPrimary: {
    backgroundColor: Colors.light.primary,
  },
  sheetButtonSecondary: {
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sheetButtonTextPrimary: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  sheetButtonTextSecondary: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
});

