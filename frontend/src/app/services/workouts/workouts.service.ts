import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import workout from './workout';
import { status } from '../status';

export interface getWorkouts extends status {
  workouts: workout[];
}
interface deleteResponse extends status {
  deletedCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class WorkoutsService {
  workoutUrl = 'http://localhost:3000/workouts';

  constructor(private http: HttpClient) {}

  fetchWorkouts(skip: string, limit?: string, tags?: string) {
    let fetchUrl = `${this.workoutUrl}/all?skip=${skip}`;

    if (limit) fetchUrl = `${fetchUrl}&limit=${limit}`;

    if (tags) fetchUrl = `${fetchUrl}&tags=${tags}`;

    console.log(fetchUrl);

    return this.http.get<getWorkouts>(fetchUrl).pipe(
      tap((workouts) => {
        console.log('FecthWorkout', workouts);
        return workouts.workouts;
      })
    );
  }

  postWorkout(workout: object) {
    return this.http.post<workout>(`${this.workoutUrl}/new`, workout).pipe(
      tap((workout) => {
        console.log(workout);
      })
    );
  }

  deleteWorkout(workoutId: string) {
    return this.http
      .delete<deleteResponse>(`${this.workoutUrl}/${workoutId}`)
      .pipe(tap((response: deleteResponse) => {}));
  }
}
