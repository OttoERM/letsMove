import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SessionStorageService } from '../services/sessionStorage/session-storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  sessionStorageService = inject(SessionStorageService);
  linksMap = new Map<string, boolean | string>([
    ['calendar', true],
    ['myroutines', false],
    ['searchroutines', false],
    ['myworkouts', false],
    ['createworkout', false],
    ['chats', false],

    ['currentActive', 'calendar'],
  ]);
  role = this.sessionStorageService.getItem('role');

  controlActiveButton(activeLink: string) {
    if (!this.linksMap.has(activeLink))
      throw new Error(
        "Invalid active link, check your html input or add new property to 'active_NoActive'"
      );

    this.linksMap.set(this.linksMap.get('currentActive') as string, false);
    this.linksMap.set('currentActive', activeLink);
    this.linksMap.set(activeLink, true);
  }
}
