'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format, subYears } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import {
  filterEvents,
  parseICalData,
  sortEventsByEndDate,
} from '@/lib/IcalHelper';
import { cn } from '@/lib/utils';
import axios from 'axios';

const FormSchema = z.object({
  calendarUrl: z
    .string({
      required_error: 'Calendar URL is required',
    })
    .min(1, {
      message: 'Calendar URL is required',
    }),
  description: z
    .string({
      required_error: 'Description is required',
    })
    .min(1, {
      message: 'Description is required',
    }),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
});

export function FilterEventsForm({ onEvents }: { onEvents: Function }) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      calendarUrl: '',
      description: '',
      startDate: subYears(new Date(), 1),
      endDate: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await axios.get('/api/calendar', {
        params: {
          calendarUrl: data.calendarUrl,
        },
      });
      const parsedEvents = parseICalData(response.data);
      const filteredEvents = filterEvents(
        parsedEvents,
        data.startDate,
        data.endDate,
        data.description
      );
      const sortedEvents = sortEventsByEndDate(filteredEvents);
      onEvents(sortedEvents);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not fetch calendar data from the URL',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Filter events</CardTitle>
        <CardDescription>
          Filter events from iCal calendar by description and date range.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='calendarUrl'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel htmlFor='calendarUrl'>Calendar URL</FormLabel>
                  <Input
                    {...field}
                    placeholder='Enter calendar URL'
                    className='w-full max-w-[600px]'
                    id='calendarUrl'
                  />
                  <FormMessage />
                  <FormDescription>Use iCal format.</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel htmlFor='description'>Description</FormLabel>
                  <Input
                    {...field}
                    placeholder='Enter description'
                    className='w-full max-w-[600px]'
                    id='description'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col sm:flex-row gap-4 w-full max-w-[600px]'>
              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Events from</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full sm:w-[250px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          // disabled={(date) =>
                          // 	date > new Date() || date < new Date("1900-01-01")
                          // }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Events to</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full sm:w-[250px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          // disabled={(date) =>
                          // 	date > new Date() || date < new Date("1900-01-01")
                          // }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit'>Filter</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
