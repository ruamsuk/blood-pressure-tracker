import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"angular-firebase-app-1a38c","appId":"1:901081309954:web:aa619c6c4007c5e73dd81b","databaseURL":"https://angular-firebase-app-1a38c-default-rtdb.asia-southeast1.firebasedatabase.app","storageBucket":"angular-firebase-app-1a38c.appspot.com","locationId":"asia-southeast1","apiKey":"AIzaSyAFyLWIEdvfilRgEgKYU-ujpEJFc97c00k","authDomain":"angular-firebase-app-1a38c.firebaseapp.com","messagingSenderId":"901081309954"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
};
