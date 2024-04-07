import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  saveItem(name: string, item: string) {
    if (this.document.defaultView)
      this.document.defaultView?.sessionStorage.setItem(name, item);
  }

  getItem(name: string): string | null {
    if (this.document.defaultView)
      if (this.document.defaultView.sessionStorage)
        return this.document.defaultView?.sessionStorage.getItem(name);

    return null;
  }
}
