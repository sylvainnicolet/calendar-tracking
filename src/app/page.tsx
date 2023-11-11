'use client';

import { EventsList } from '@/app/EventsList';
import { FilterEventsForm } from '@/app/FilterEventsForm';
import { CalEvent } from '@/model/CalEvent';
import { useState } from 'react';

export default function Home() {
  const [events, setEvents] = useState<CalEvent[]>([]);

  const handleEvents = (filteredEvents: CalEvent[]) => {
    setEvents(filteredEvents);
  };

  return (
    <main className='flex flex-col items-center gap-4'>
      <FilterEventsForm onEvents={handleEvents} />
      <EventsList events={events} />
    </main>
  );
}
