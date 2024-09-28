import { Injectable, Signal, signal } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
  UserCredential,
  sendPasswordResetEmail,
  sendEmailVerification,
} from '@angular/fire/auth';
import { from, Observable, switchMap, throwError } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$: Observable<any>;
  currentUser: Signal<User | null | undefined> = signal<any>(null);

  constructor(private afAuth: Auth) {
    this.currentUser$ = authState(this.afAuth);
    this.currentUser = toSignal<User | null>(this.currentUser$);
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
}
