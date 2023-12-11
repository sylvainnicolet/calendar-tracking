import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { exportToCSV, exportToPDF } from '@/lib/export';
import { CalEvent } from '@/model/CalEvent';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(1, {
      message: 'Name is required',
    }),
  exportFormat: z.enum(['csv', 'pdf'], {
    required_error: 'Export format is required',
  }),
});

function DialogForm({ rows }: { rows: CalEvent[] }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      exportFormat: 'csv',
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { name, exportFormat } = data;

    if (exportFormat === 'csv') {
      exportToCSV(name, rows);
    } else if (exportFormat === 'pdf') {
      exportToPDF(name, rows);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Export</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Export events</DialogTitle>
          <DialogDescription>
            Export the events to a CSV or PDF file.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel htmlFor='name'>Name</FormLabel>
                  <Input
                    {...field}
                    placeholder='Enter a name'
                    className='w-full max-w-[600px]'
                    id='name'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='exportFormat'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Export format</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a format' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='csv'>CSV</SelectItem>
                      <SelectItem value='pdf'>PDF</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit' className='mt-2'>
                Export
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function EventsList({ events }: { events: CalEvent[] }) {
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
            <DialogForm rows={events} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
