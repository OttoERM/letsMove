import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import user from '../services/users/user';
import { UsersService } from '../services/users/users.service';
import { SessionStorageService } from '../services/sessionStorage/session-storage.service';
import { CalendarService } from '../services/calendar/calendar.service';
import { calendar } from '../services/calendar/calendar';
import exercise from '../services/workouts/exercise';

interface modalDetailsTypes {
  title: string;
  description: string;
  exercises: exercise[];
}

@Component({
  selector: 'app-myroutines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myroutines.component.html',
  styleUrl: './myroutines.component.css',
})
export class MyroutinesComponent {
  sessionStorageService = inject(SessionStorageService);
  usersService = inject(UsersService);
  calendarService = inject(CalendarService);
  userId: string | null = null;
  showModal = 'hidden';
  modalDetails: Partial<modalDetailsTypes> = {};
  userInfo: Partial<user> & {
    workoutInfo?: Array<{
      _id: string;
      title: string;
      description: string;
      exercises: exercise[];
      authorInfo: Array<{
        _id: string;
        username: string;
      }>;
    }>;
  } = {};
  routines: Array<{
    workoutId: string;
    title: string;
    author: string;
    description: string;
    exercises: exercise[];
  }> = [];
  cardData = { title: 'Title not found', author: 'Author not found' };
  userCalendar: Partial<calendar> = {
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

  ngOnInit() {
    this.userId = this.sessionStorageService.getItem('id');
    if (this.userId)
      this.usersService
        .getUserInfoWorkouts(this.userId)
        .subscribe((response) => {
          this.userInfo = { ...response.data[0] };
          this.createIterableArray();
          if (this.userInfo.calendarId)
            this.calendarService
              .getCalendar(this.userInfo.calendarId)
              .subscribe((response) => {
                this.userCalendar = { ...response.data };
                console.log(this.userCalendar);
              });
        });
  }

  createIterableArray() {
    if (
      this.userInfo.workoutsIds &&
      this.userInfo.workoutsIds.length > 0 &&
      this.userInfo.workoutInfo
    )
      for (let i = 0; i < this.userInfo.workoutsIds.length; i++) {
        for (let j = 0; j < this.userInfo.workoutInfo.length; j++) {
          if (
            this.userInfo.workoutsIds[i] == this.userInfo.workoutInfo[j]._id
          ) {
            this.routines.push({
              workoutId: this.userInfo.workoutsIds[i],
              title: this.userInfo.workoutInfo[j].title,
              author: this.userInfo.workoutInfo[j].authorInfo[0].username,
              description: this.userInfo.workoutInfo[j].description,
              exercises: this.userInfo.workoutInfo[j].exercises,
            });
          }
        }
      }
    console.log('routines:', this.routines);
  }

  removeWorkout(workoutId: string) {
    console.log(workoutId, this.userInfo);

    let workoutIndex = -1;
    if (
      this.userInfo.workoutsIds &&
      this.userInfo.workoutsIds.length > 0 &&
      this.userInfo.workoutInfo
    ) {
      for (let i = 0; i < this.userInfo.workoutsIds.length; i++) {
        if (this.userInfo.workoutsIds[i] == workoutId) {
          workoutIndex = i;
          break;
        }
      }

      if (workoutIndex !== -1 && this.userId) {
        this.userInfo.workoutsIds.splice(workoutIndex, 1);
        this.usersService
          .patchWorkoutsIds(this.userId, this.userInfo.workoutsIds)
          .subscribe();
        this.removeWorkoutFromRoutines(workoutId);
        this.removeWorkoutFromCalendar(workoutId);
      }
    }
  }

  removeWorkoutFromRoutines(workoutId: string) {
    this.routines.splice(
      this.routines.findIndex((routine) => routine.workoutId == workoutId),
      1
    );
  }

  removeWorkoutFromCalendar(workoutId: string) {
    if (this.userCalendar._id) {
      let index = this.userCalendar.calendar?.su.findIndex(
        (element) => element.workout == workoutId
      );
      if (index && index >= 0) this.userCalendar.calendar?.su.splice(index, 1);

      index = this.userCalendar.calendar?.mo.findIndex(
        (element) => element.workout == workoutId
      );
      if (index && index >= 0) this.userCalendar.calendar?.mo.splice(index, 1);

      index = this.userCalendar.calendar?.tu.findIndex(
        (element) => element.workout == workoutId
      );
      if (index && index >= 0) this.userCalendar.calendar?.tu.splice(index, 1);

      index = this.userCalendar.calendar?.we.findIndex(
        (element) => element.workout == workoutId
      );
      if (index && index >= 0) this.userCalendar.calendar?.we.splice(index, 1);

      index = this.userCalendar.calendar?.th.findIndex(
        (element) => element.workout == workoutId
      );
      if (index && index >= 0) this.userCalendar.calendar?.th.splice(index, 1);

      index = this.userCalendar.calendar?.fr.findIndex(
        (element) => element.workout == workoutId
      );
      if (index && index >= 0) this.userCalendar.calendar?.fr.splice(index, 1);

      index = this.userCalendar.calendar?.sa.findIndex(
        (element) => element.workout == workoutId
      );
      if (index && index >= 0) this.userCalendar.calendar?.sa.splice(index, 1);

      if (this.userCalendar.calendar)
        this.calendarService
          .patchCalendar(this.userCalendar._id, {
            calendar: this.userCalendar.calendar,
          })
          .subscribe();
    }
  }

  showDetails(title: string, description: string, exercises: exercise[]) {
    this.showModal = 'visible';
    this.modalDetails.title = title;
    this.modalDetails.description = description;
    this.modalDetails.exercises = exercises;
  }
}
