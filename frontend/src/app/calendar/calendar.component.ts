import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../services/users/users.service';
import { CalendarService } from '../services/calendar/calendar.service';
import { SessionStorageService } from '../services/sessionStorage/session-storage.service';
import { calendar, scheduledExercise } from '../services/calendar/calendar';
import user from '../services/users/user';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

interface modalDetailsTypes {
  title: string;
  time: FormControl<string | null>;
  weekDayArray: scheduledExercise[] | null;
  index: number;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  usersService = inject(UsersService);
  calendarService = inject(CalendarService);
  sessionStorageService = inject(SessionStorageService);
  userId: string | null = null;

  masterCalendar: calendar = {
    _id: '',
    calendar: {
      su: [],
      mo: [],
      tu: [],
      we: [],
      th: [],
      sa: [],
      fr: [],
    },
  };
  userInfo: Partial<user> & {
    workoutInfo?: Array<{
      _id: string;
      title: string;
      authorInfo: Array<{
        _id: string;
        username: string;
      }>;
    }>;
  } = {};
  modal: modalDetailsTypes = {
    index: -1,
    weekDayArray: null,
    time: new FormControl(''),
    title: '',
  };
  showModal = 'hidden';
  selectedWorkout: string | null = null;

  ngOnInit() {
    this.userId = this.sessionStorageService.getItem('id');
    if (this.userId)
      this.usersService.getUser(this.userId).subscribe((user) => {
        if (user.data.calendarId)
          this.calendarService
            .getCalendar(user.data.calendarId)
            .subscribe((calendar) => {
              if (calendar.data._id) this.masterCalendar = { ...calendar.data };
              console.log(this.masterCalendar);
            });

        if (this.userId)
          this.usersService
            .getUserInfoWorkouts(this.userId)
            .subscribe((response) => {
              this.userInfo = { ...response.data[0] };
              console.log(this.userInfo);
            });
      });
  }

  @ViewChildren('myRoutines') myRoutines?: QueryList<ElementRef>;
  selectedRoutine(event: Event, routineIdentifier: HTMLUListElement): void {
    const index = Array.from(routineIdentifier.children).findIndex(
      (element) => element == event.target
    );
    this.selectedWorkout = this.userInfo.workoutInfo
      ? this.userInfo.workoutInfo[index]._id
      : null;
  }
  dropRoutineEnter(event: Event) {
    event.preventDefault();
  }

  dropRoutineOver(event: Event) {
    event.preventDefault();
  }

  dropRoutine(event: Event) {
    event.preventDefault();

    const weekDay = (event.target as HTMLElement).id;

    if (!this.selectedWorkout) return;

    switch (weekDay) {
      case 'su':
        this.masterCalendar.calendar.su.push({
          workout: this.selectedWorkout,
          time: '12:00',
        });
        break;
      case 'mo':
        this.masterCalendar.calendar.mo.push({
          workout: this.selectedWorkout,
          time: '12:00',
        });
        break;
      case 'tu':
        this.masterCalendar.calendar.tu.push({
          workout: this.selectedWorkout,
          time: '12:00',
        });
        break;
      case 'we':
        this.masterCalendar.calendar.we.push({
          workout: this.selectedWorkout,
          time: '12:00',
        });
        break;
      case 'th':
        this.masterCalendar.calendar.th.push({
          workout: this.selectedWorkout,
          time: '12:00',
        });
        break;
      case 'fr':
        this.masterCalendar.calendar.fr.push({
          workout: this.selectedWorkout,
          time: '12:00',
        });
        break;
      case 'sa':
        this.masterCalendar.calendar.sa.push({
          workout: this.selectedWorkout,
          time: '12:00',
        });
        break;
      default:
        this.assertUnreachable(weekDay as never);
    }
  }

  @ViewChildren('routineSu') routineSu?: QueryList<ElementRef>;
  @ViewChildren('routineMo') routineMo?: QueryList<ElementRef>;
  @ViewChildren('routineTu') routineTu?: QueryList<ElementRef>;
  @ViewChildren('routineWe') routineWe?: QueryList<ElementRef>;
  @ViewChildren('routineTh') routineTh?: QueryList<ElementRef>;
  @ViewChildren('routineFr') routineFr?: QueryList<ElementRef>;
  @ViewChildren('routineSa') routineSa?: QueryList<ElementRef>;

  private displayeModal(weekDayRoutines: scheduledExercise[], index: number) {
    this.modal.index = index;
    this.modal.weekDayArray = weekDayRoutines;

    let titleExist = this.userInfo.workoutInfo?.find(
      (workout) => workout._id == weekDayRoutines[index].workout
    )?.title;

    if (titleExist) {
      this.modal.title = titleExist;
      this.modal.time.setValue(weekDayRoutines[index].time);
      this.showModal = 'visible';
    } else this.modal.title = 'Workout does not exist';
  }

  setModalTime() {
    const setTime = this.modal.time?.value ? this.modal.time.value : null;

    // console.log(this.modal.weekDayArray);

    if (this.modal.weekDayArray && this.modal.index >= 0 && setTime)
      this.modal.weekDayArray[this.modal.index].time = setTime;
  }

  private assertUnreachable(unreachable: never) {
    throw new Error('weekDay value or container was not found');
  }

  findSelected(event: Event, routineIdentifier: HTMLUListElement) {
    event.stopPropagation(); //prevents dropRoutine() function from executing
    const weekDay = (event.target as HTMLElement).parentElement?.id;
    const index = Array.from(routineIdentifier.children).findIndex(
      (element) => element == event.target
    );

    switch (weekDay) {
      case 'su':
        this.displayeModal(this.masterCalendar.calendar.su, index);
        break;
      case 'mo':
        this.displayeModal(this.masterCalendar.calendar.mo, index);
        break;
      case 'tu':
        this.displayeModal(this.masterCalendar.calendar.tu, index);
        break;
      case 'we':
        this.displayeModal(this.masterCalendar.calendar.we, index);
        break;
      case 'th':
        this.displayeModal(this.masterCalendar.calendar.th, index);
        break;
      case 'fr':
        this.displayeModal(this.masterCalendar.calendar.fr, index);
        break;
      case 'sa':
        this.displayeModal(this.masterCalendar.calendar.sa, index);
        break;
      default:
        this.assertUnreachable(weekDay as never);
    }
  }

  dragStart() {
    console.log('drag');
  }

  removeCalendar() {
    if (this.modal.weekDayArray && this.modal.index >= 0)
      this.modal.weekDayArray.splice(this.modal.index, 1);

    this.showModal = 'hidden';
  }

  save() {
    console.log(this.masterCalendar.calendar);

    if (this.masterCalendar._id)
      this.calendarService
        .patchCalendar(this.masterCalendar._id, {
          calendar: this.masterCalendar.calendar,
        })
        .subscribe();
  }
}
