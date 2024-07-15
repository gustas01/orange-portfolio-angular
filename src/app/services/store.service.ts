import { Injectable, signal } from '@angular/core';
import { UserDataType } from 'app/types/user-data-type';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  userData = signal<UserDataType>(null);

  constructor() {
    const storedUser = localStorage.getItem('userdata');
    if (storedUser) {
      this.userData.set(JSON.parse(storedUser));
    }
  }

  setCurrentUser(user: UserDataType) {
    this.userData.set(user);
    localStorage.setItem('userdata', JSON.stringify(user));
  }

  getCurrentUser() {
    return this.userData();
  }

  removeCurrentUser() {
    localStorage.removeItem('userdata');
  }
}
