import { Button } from '@/components/ui/button';
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
import { CalEvent } from '@/model/CalEvent';

export function EventsList({ events }: { events: CalEvent[] }) {

  // This function is used to export the events to a CSV file.
  function exportToCsv(filename: string, rows: CalEvent[]) {
    const processRow = (row: CalEvent) => {
      const values = [
        row.startDate.toLocaleDateString('fr-CH', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        row.endDate.toLocaleDateString('fr-CH', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        (row.endDate.getTime() - row.startDate.getTime()) / 3600000,
        row.summary,
      ];
      return values.join(';');
    };

    const csvHeader = 'Start;End;Total;Title\n';
    const csvContent = rows.map(processRow).join('\n');

    const csv = csvHeader + csvContent;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Events</CardTitle>
        <CardDescription>
          Here are the events that match your criteria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
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
                <TableRow key={event.id}>
                  <TableCell>
                    {event.startDate.toLocaleDateString('fr-CH', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell>
                    {event.endDate.toLocaleDateString('fr-CH', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell>{event.summary}</TableCell>
                  <TableCell className='text-right'>
                    {(event.endDate.getTime() - event.startDate.getTime()) /
                      3600000}
                    {'h'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className='border-0'>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className='text-right'>
                  {events.reduce(
                    (total, event) =>
                      total +
                      (event.endDate.getTime() - event.startDate.getTime()) /
                        3600000,
                    0
                  )}
                  {'h'}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <p>No events found.</p>
        )}

        {events.length > 0 && (
          <div className='flex justify-end mt-2'>
            <Button onClick={() => exportToCsv('Events.csv', events)}>
              Export to CSV
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
