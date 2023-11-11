import { EventsList } from '@/app/EventsList';
import { FilterEventsForm } from '@/app/FilterEventsForm';

export default function Home() {
  return (
    <main className='flex flex-col items-center gap-4'>
      <FilterEventsForm />
      <EventsList />
    </main>
  );
}
