import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UsersService } from '../services/users/users.service';
import { SessionStorageService } from '../services/sessionStorage/session-storage.service';
//ngModule -> FormsModule -> [(ngModel)]="auth.username"

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  sessionStorageService = inject(SessionStorageService);
  usersService = inject(UsersService);
  authForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private router: Router, private route: ActivatedRoute) {}

  login() {
    console.log(this.authForm.value);
    this.usersService
      .requestLogin({
        username: this.authForm.value.username!,
        password: this.authForm.value.password!,
      })
      .subscribe((loginResponse) => {
        this.sessionStorageService.saveItem('token', loginResponse.token);
        this.sessionStorageService.saveItem('role', loginResponse.role);
        this.sessionStorageService.saveItem('id', loginResponse.id);

        if (loginResponse.role == 'user')
          this.router.navigate(['dashboard/searchroutines'], {
            relativeTo: this.route,
          });
        else
          this.router.navigate(['dashboard/myworkouts'], {
            relativeTo: this.route,
          });
      });
  }
}
