// @ts-ignore
import { CalEvent } from '@/model/CalEvent';
// @ts-ignore
import ical from 'ical.js';

function removeHtmlTags(str: string): string {
  if (!str) {
    return '';
  }
  return str.replace(/<[^>]*>/g, '');
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function parseICalData(icalData: string): CalEvent[] {
  // icalData est votre structure de données brute iCal
  const jcalData = ical.parse(icalData);
  const comp = new ical.Component(jcalData);
  const events = comp.getAllSubcomponents('vevent');

  return events.map((eventComp: any) => {
    const icalEvent = new ical.Event(eventComp);
    return {
      id: icalEvent.uid,
      summary: icalEvent.summary,
      startDate: icalEvent.startDate.toJSDate(),
      endDate: icalEvent.endDate.toJSDate(),
      description: removeHtmlTags(
        icalEvent.description ? icalEvent.description : ''
      ),
    };
  });
}

export function filterEvents(
  events: CalEvent[],
  startDate: Date,
  endDate: Date,
  description: string
) {
  const startDay = startOfDay(startDate);
  const endDay = startOfDay(endDate);
  return events.filter((event) => {
    const eventStartDay = startOfDay(event.startDate);
    const eventEndDay = startOfDay(event.endDate);
    return (
      eventStartDay >= startDay &&
      eventEndDay <= endDay &&
      event.description.includes(description)
    );
  });
}


export function sortEventsByEndDate(events: CalEvent[]) {
  return events.sort((a, b) => {
    return a.endDate.getTime() - b.endDate.getTime();
  });
}