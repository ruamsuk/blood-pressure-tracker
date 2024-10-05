import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { MessagesService } from './services/messages.service';
import { SharedModule } from './shared/shared.module';
import { take } from 'rxjs';
import { FooterComponent } from './components/page/footer.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProfileComponent } from './components/user/profile.component';

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
                routerLink="/home"
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
                routerLink="/user"
                class="p-link inline-flex justify-content-center align-items-center text-white h-3rem w-3rem border-circle hover:bg-white-alpha-10 transition-all transition-duration-200"
              >
                <i class="pi pi-user-plus text-2xl"></i>
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
              <span
                class="font-bold text-bluegray-50 hover:text-cyan-100 cursor-pointer"
                (click)="openDialog()"
              >
                {{ currentUser()?.email || currentUser()?.displayName }} </span
              ><i class="pi pi-angle-down"></i>
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
  dialogService = inject(DialogService);
  router = inject(Router);
  ref: DynamicDialogRef | undefined;
  photo: any;

  currentUser = this.userService.currentUserProfile;
  loading = this.message.loading;

  ngOnInit() {
    this.authService.currentUser$.subscribe((user: any) => {
      if (user) {
        this.photo = user?.photoURL ? user.photoURL : '/images/dummy-user.png';
      }
    });
  }

  logout() {
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe(() => this.router.navigate(['/login']));
  }

  ngOnDestroy() {
    if (this.ref) this.ref.destroy();
  }

  openDialog() {
    this.ref = this.dialogService.open(ProfileComponent, {
      data: this.currentUser(),
      header: 'User Profile',
      width: '520px',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '90vw',
        '640px': '90vw',
        '390px': '90vw',
      },
    });
  }
}
