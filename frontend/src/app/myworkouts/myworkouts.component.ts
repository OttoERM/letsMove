import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../services/users/users.service';
import { WorkoutsService } from '../services/workouts/workouts.service';
import { SessionStorageService } from '../services/sessionStorage/session-storage.service';
import user from '../services/users/user';
import workout from '../services/workouts/workout';

interface trainerWorkouts extends Partial<user> {
  workoutInfo?: Array<workout>;
}

@Component({
  selector: 'app-myworkouts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myworkouts.component.html',
  styleUrl: './myworkouts.component.css',
})
export class MyworkoutsComponent {
  usersService = inject(UsersService);
  workoutsService = inject(WorkoutsService);
  sessionStorageService = inject(SessionStorageService);
  trainerInfo: trainerWorkouts = {};

  ngOnInit() {
    const userId = this.sessionStorageService.getItem('id');
    if (userId)
      this.usersService.getTrainerInfo(userId).subscribe((response) => {
        this.trainerInfo = { ...response.data[0] };
      });
  }

  deleteWorkout(workoutId: string) {
    this.workoutsService.deleteWorkout(workoutId).subscribe(() => {
      this.trainerInfo.workoutInfo?.splice(
        this.trainerInfo.workoutInfo?.findIndex(
          (element) => element._id == workoutId
        ),
        1
      );
    });
  }
}
