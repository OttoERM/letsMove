import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users/users.service';
import { SessionStorageService } from '../services/sessionStorage/session-storage.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  sessionStorageService = inject(SessionStorageService);
  usersService = inject(UsersService);
  createUserForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl(''),
  });

  constructor(private router: Router, private route: ActivatedRoute) {}

  signin() {
    console.log(this.createUserForm.value);
    this.usersService
      .requestSignIn({
        username: this.createUserForm.value.username!,
        password: this.createUserForm.value.password!,
        role: this.createUserForm.value.role!,
      })
      .subscribe((signInResponse) => {
        this.sessionStorageService.saveItem(
          'role',
          this.createUserForm.value.role!
        );
        this.sessionStorageService.saveItem(
          'id',
          signInResponse.resource.split('/')[1]
        );

        if (this.createUserForm.value.role! == 'user')
          this.router.navigate(['dashboard/searchroutines'], {
            relativeTo: this.route.root,
          });
        else
          this.router.navigate(['dashboard/myworkouts'], {
            relativeTo: this.route.root,
          });
      });
  }
}
