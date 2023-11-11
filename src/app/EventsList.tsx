import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const events = [
  {
    start: '2021-01-01 12:00',
    end: '2021-01-01 16:00',
    title: 'Meeting with John',
  },
  {
    start: '2021-01-01 12:00',
    end: '2021-01-01 16:00',
    title: 'Meeting with John',
  },
];

export function EventsList() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Events</CardTitle>
        <CardDescription>
          Here are the events that match your criteria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className='text-right'>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='text-xs'>
            {events.map((event) => (
              <TableRow key={event.title}>
                <TableCell>{event.start}</TableCell>
                <TableCell>{event.end}</TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell className='text-right'>04:00</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className='border-0'>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className='text-right'>04:00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
