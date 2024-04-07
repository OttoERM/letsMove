import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { calendar } from './calendar';
import { status } from '../status';

interface getCalendarResponse extends status {
  data: calendar;
}
interface patchCalendarResponse extends status {
  updatedFields: calendar;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  calendarUrl = 'http://localhost:3000/calendars';
  constructor(private http: HttpClient) {}

  getCalendar(calendarId: string) {
    return this.http
      .get<getCalendarResponse>(`${this.calendarUrl}/${calendarId}`)
      .pipe(
        tap((response: getCalendarResponse) => {
          console.log(response);
        })
      );
  }

  patchCalendar(calendarId: string, updatedCalendar: calendar) {
    console.log(updatedCalendar);

    return this.http
      .patch<patchCalendarResponse>(`${this.calendarUrl}/${calendarId}`, {
        calendar: updatedCalendar.calendar,
      })
      .pipe(
        tap((response: patchCalendarResponse) => {
          console.log(response);
        })
      );
  }
}
