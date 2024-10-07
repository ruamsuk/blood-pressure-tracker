import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [SharedModule],
  template: `
    @if (verify) {
      <div class="flex flex-column gap-5">
        <div class="flex justify-content-center align-items-center mt-5">
          <p-card
            [style]="{ width: '360px', padding: '5px' }"
            header="Verify your email!"
          >
            <ng-template pTemplate="header">
              <img src="/images/cardiac.png" alt="cardiac" />
            </ng-template>
            <hr class="h-px bg-gray-200 border-0" />
            <p class="sarabun text-gray-100">
              Please verify your email. Otherwise, you will not be able to use
              this application.
            </p>
            <hr class="h-px bg-gray-200 border-0" />
            <ng-template pTemplate="footer">
              <div class="flex gap-3 mt-1">
                <p-button
                  label="Logout"
                  severity="secondary"
                  class="w-full"
                  styleClass="w-full"
                  (onClick)="logout()"
                />
                <p-button
                  label="Verify"
                  class="w-full"
                  styleClass="w-full"
                  (onClick)="sendEmailVerify()"
                />
              </div>
            </ng-template>
          </p-card>
        </div>
      </div>
    } @else {
      <div class="flex justify-content-center align-items-center mt-5">
        <p-galleria
          [value]="images"
          [autoPlay]="true"
          [responsiveOptions]="responsiveOptions"
          [numVisible]="5"
          [circular]="true"
          [showThumbnails]="false"
          [containerStyle]="{ 'max-width': '1100px' }"
        >
          <ng-template pTemplate="item" let-item>
            <img
              [src]="item"
              style="width: 100%; max-width: 100%; height: auto;"
              alt=""
            />
          </ng-template>
        </p-galleria>
      </div>
    }
  `,
  styles: `
    p-galleria img {
      width: 100%;
      max-width: 1100px; /* กำหนดขนาดสูงสุดที่ต้องการ */
      height: auto;
      display: block;
      margin: 0 auto;
      border-radius: 15px;
    }
  `,
})
export class LandingComponent {
  verify: boolean = false;
  images: any[] = [
    'images/104.jpg',
    'images/105.jpg',
    'images/106.jpg',
    'images/107.jpg',
    'images/101.jpg',
    'images/102.jpg',
    'images/108.jpg',
    'images/109.jpg',
    'images/110.jpg',
    'images/103.jpg',
  ];

  responsiveOptions: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
  /**
   *  ถ้าผู้ใช้ ยืนยันอีเมลแล้ว, this.verify จะเป็น false
   *  ถ้าผู้ใช้ ยังไม่ได้ยืนยันอีเมล, this.verify จะเป็น true
   *  */
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.verify = !user.emailVerified;
        // console.log(JSON.stringify(user, null, 2));
      }
    });

    // console.log(this.verify);
  }

  sendEmailVerify(): void {
    this.authService.sendVerificationEmail().subscribe(() => this.logout());
  }

  logout() {
    this.authService
      .logout()
      .subscribe(() => this.router.navigateByUrl('/login'));
  }
}
