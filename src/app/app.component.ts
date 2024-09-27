import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { MessagesService } from './services/messages.service';
import { SharedModule } from './shared/shared.module';
import { take } from 'rxjs';
import { FooterComponent } from './components/page/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, FooterComponent],
  template: `
    <p-toast />
    @if (currentUser()) {
      <div class="card">
        <p-toolbar
          styleClass="bg-gray=900"
          [style]="{
            'border-radius': '3rem',
            'background-image':
              'linear-gradient(to right, var(--bluegray-500), var(--bluegray-800))',
          }"
        >
          <ng-template pTemplate="start">
            <img
              src="/images/android-chrome-crop.png"
              width="80"
              height="48"
              alt="logo"
            />
          </ng-template>
          <ng-template pTemplate="center">
            <div class="flex flex-wrap align-items-center gap-3">
              <button
                class="p-link inline-flex justify-content-center align-items-center text-white h-3rem w-3rem border-circle hover:bg-white-alpha-10 transition-all transition-duration-200"
              >
                <i class="pi pi-home text-2xl"></i>
              </button>
              <button
                routerLink="/blood"
                class="p-link inline-flex justify-content-center align-items-center text-white h-3rem w-3rem border-circle hover:bg-white-alpha-10 transition-all transition-duration-200"
              >
                <i class="pi pi-heart-fill text-2xl"></i>
              </button>
              <button
                class="p-link inline-flex justify-content-center align-items-center text-white h-3rem w-3rem border-circle hover:bg-white-alpha-10 transition-all transition-duration-200"
              >
                <i class="pi pi-sign-out text-2xl" (click)="logout()"></i>
              </button>
            </div>
          </ng-template>
          <ng-template pTemplate="end">
            <div class="flex align-items-center gap-2">
              <p-avatar [image]="photo" shape="circle" />
              <span class="font-bold text-bluegray-50">
                {{ currentUser()?.email || currentUser()?.displayName }}
              </span>
            </div>
          </ng-template>
        </p-toolbar>
      </div>
      @if (loading()) {
        <div class="spinner-border">
          <p-progressSpinner
            styleClass="w-4rem h-4rem"
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration=".5s"
          />
        </div>
      }
    }
    <router-outlet />
    @if (currentUser()) {
      <app-footer />
    }
  `,
  styles: [],
})
export class AppComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  userService = inject(UserService);
  message = inject(MessagesService);
  router = inject(Router);

  currentUser = this.userService.currentUserProfile;
  loading = this.message.loading;

  photo = this.currentUser()?.photoURL
    ? this.currentUser()?.photoURL
    : '/images/dummy-user.png';

  ngOnInit() {}

  logout() {
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe(() => this.router.navigate(['/login']));
  }

  ngOnDestroy() {}
}
