import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import exercise from '../services/workouts/exercise';
import {
  WorkoutsService,
  getWorkouts,
} from '../services/workouts/workouts.service';
import workout from '../services/workouts/workout';
import { UsersService } from '../services/users/users.service';
import user from '../services/users/user';
import { SessionStorageService } from '../services/sessionStorage/session-storage.service';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs';

interface modalDetailsTypes {
  title: string;
  description: string;
  exercises: exercise[];
}

@Component({
  selector: 'app-searchroutines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './searchroutines.component.html',
  styleUrl: './searchroutines.component.css',
})
export class SearchroutinesComponent {
  sessionStorageService = inject(SessionStorageService);
  usersService = inject(UsersService);
  userInfo: Partial<user> = {};
  workoutsService = inject(WorkoutsService);
  showModal = 'hidden';
  workoutsCounter = 0;
  modalDetails: Partial<modalDetailsTypes> = {};

  routines: workout[] = [];

  private searchTerms = new Subject<string>();

  search(tags: string): void {
    this.searchTerms.next(tags.replace(' ', ','));
    console.log(this.routines);
  }

  ngOnInit() {
    this.workoutsService.fetchWorkouts('0').subscribe((response) => {
      this.routines = response.workouts;
    });

    const userId = this.sessionStorageService.getItem('id');
    if (userId)
      this.usersService.getUserInfoWorkouts(userId).subscribe((response) => {
        this.userInfo = { ...response.data[0] };
      });

    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((tags: string) => {
          return this.workoutsService.fetchWorkouts('0', '15', tags);
        })
      )
      .subscribe((response) => {
        // this.routines =  []
        this.routines = response.workouts;
      });
  }

  showDetails(title: string, description: string, exercises: exercise[]) {
    this.showModal = 'visible';
    this.modalDetails.title = title;
    this.modalDetails.description = description;
    this.modalDetails.exercises = exercises;
  }

  addToMyWorkouts(workoutId: string) {
    const userId = sessionStorage.getItem('id');

    if (
      this.userInfo.workoutsIds &&
      !this.userInfo.workoutsIds?.includes(workoutId)
    ) {
      this.userInfo.workoutsIds.push(workoutId);

      if (userId && this.userInfo.workoutsIds)
        this.usersService
          .patchWorkoutsIds(userId, this.userInfo.workoutsIds)
          .subscribe((response) => {
            this.userInfo.workoutsIds = [...response.updatedFields.workoutsIds];
            // console.log(this.userInfo.workoutsIds);
          });
      else throw new Error("Couldn't find user Id");
    }
  }
}
