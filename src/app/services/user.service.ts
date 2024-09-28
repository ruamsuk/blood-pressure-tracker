import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { from, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/profile-user.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  firestore = inject(Firestore);
  authService = inject(AuthService);

  currentUserProfile$: Observable<ProfileUser | null> =
    this.authService.currentUser$.pipe(
      switchMap((user: any) => {
        if (!user) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      }),
    );

  currentUserProfile = toSignal<ProfileUser | null>(this.currentUserProfile$);

  getUsers(): Observable<ProfileUser[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'uid' }) as Observable<
      ProfileUser[]
    >;
  }

  addUser(user: ProfileUser): Observable<void> {
    const userWithRole = {
      ...user,
      role: user.role || 'user', // Default role to 'user' if not provided
    };
    const ref = doc(this.firestore, 'users', userWithRole.uid);
    return from(setDoc(ref, userWithRole));
  }

  updateUser(user: any): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }

  deleteUser(id: string | undefined) {
    const docInstance = doc(this.firestore, 'users', `${id}`);
    return from(deleteDoc(docInstance));
  }
}
