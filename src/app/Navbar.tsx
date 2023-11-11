import { ModeToggle } from '@/app/ModeToggle';
import { Github } from 'lucide-react';

export default function Navbar() {
  return (
    <div className='text-xs sm:text-sm  border-b dark:border-gray-700'>
      <nav className='p-4 flex justify-between items-center container'>
        <p className='text-muted-foreground'>
          Developed with <span className='text-red-500'>♥</span> by{' '}
          <a
            className='underline font-bold hover:text-primary'
            href='https://www.hescsen.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            HESCSEN
          </a>
        </p>
        <div className='flex items-center gap-4'>
          <a
            target='_blank'
            href='https://github.com/sylvainnicolet/calendar-events-app'
            rel='noopener noreferrer'
          >
            <Github size='1rem' />
          </a>
          <ModeToggle />
        </div>
      </nav>
    </div>
  );
}
