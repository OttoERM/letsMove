import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, ObservableInput } from 'rxjs';
import user from './user';
import { login, signin } from './logIn-signIn';
import { status } from '../status';

interface loginResponse extends status {
  token: string;
  role: string;
  id: string;
}
interface signinResponse extends status {
  resource: string;
}
interface getUserResponse extends status {
  data: user;
}
interface getUserExtendedResponse extends status {
  data: user[];
}
interface patchReponse extends status {
  updatedFields: {
    workoutsIds: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  userUrl = 'http://localhost:3000/users';
  constructor(private http: HttpClient) {}

  requestLogin(authLogin: login) {
    return this.http
      .post<loginResponse>(`${this.userUrl}/login`, authLogin)
      .pipe(
        tap((reponse: loginResponse) => {
          console.log(reponse);
        })
      );
  }

  requestSignIn(authSignin: signin) {
    return this.http
      .post<signinResponse>(`${this.userUrl}/signup`, authSignin)
      .pipe(
        tap((reponse: signinResponse) => {
          console.log(reponse);
        })
      );
  }

  getUser(userId: string) {
    return this.http.get<getUserResponse>(`${this.userUrl}/${userId}`).pipe(
      tap((response: getUserResponse) => {
        console.log(response);
      })
    );
  }

  getTrainerInfo(userId: string) {
    return this.http
      .get<getUserExtendedResponse>(`${this.userUrl}/workouts/${userId}`)
      .pipe(
        tap((response: getUserExtendedResponse) => {
          console.log(response);
        })
      );
  }

  getUserInfoWorkouts(userId: string) {
    return this.http
      .get<getUserExtendedResponse>(`${this.userUrl}/exercises/${userId}`)
      .pipe(
        tap((response: getUserExtendedResponse) => {
          console.log(response);
        })
      );
  }

  patchWorkoutsIds(userId: string, workoutsIds: string[]) {
    return this.http
      .patch<patchReponse>(`${this.userUrl}/${userId}`, {
        workoutsIds: workoutsIds,
      })
      .pipe(
        tap((response: patchReponse) => {
          console.log(response);
        })
      );
  }
}
