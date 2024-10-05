import { Injectable, Signal, signal } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
  UserCredential,
  UserInfo,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from '@angular/fire/auth';
import { concatMap, from, Observable, of, switchMap, throwError } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProfileUser } from '../models/profile-user.model';
import { doc, docData, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$: Observable<any>;
  currentUser: Signal<User | null | undefined> = signal<any>(null);

  constructor(
    private afAuth: Auth,
    private firestore: Firestore,
  ) {
    this.currentUser$ = authState(this.afAuth);
    this.currentUser = toSignal<User | null>(this.currentUser$);
  }

  get userProfile$(): Observable<ProfileUser | null> {
    const user = this.afAuth.currentUser;
    const ref = doc(this.firestore, 'users', `${user?.uid}`);
    if (ref) {
      return docData(ref) as Observable<ProfileUser | null>;
    } else {
      return of(null);
    }
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.afAuth, email, password));
  }

  logout(): Observable<void> {
    // ไม่ให้แสดงข้อผิดพลาดในคอนโซล
    return from(signOut(this.afAuth).catch((e) => e));
  }

  forgotPassword(email: string) {
    return from(sendPasswordResetEmail(this.afAuth, email));
  }

  sendVerificationEmail() {
    return user(this.afAuth).pipe(
      switchMap((user: any) => {
        if (user) {
          return from(sendEmailVerification(user));
        } else {
          return throwError(() => new Error('No user is signed in'));
        }
      }),
    );
  }

  updateProfileData(profileData: Partial<UserInfo>): Observable<any> {
    const user = this.afAuth.currentUser;
    console.log(JSON.stringify(profileData, null, 2));

    return of(user).pipe(
      concatMap((user) => {
        if (!user) throw new Error('Not Authenticated');
        return updateProfile(user, profileData);
      }),
    );
  }
}
