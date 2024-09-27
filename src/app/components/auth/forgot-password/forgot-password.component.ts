import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs';
import { MessagesService } from '../../../services/messages.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [SharedModule],
  template: `
    <div class="flex justify-content-center align-content-center">
      <input
        pInputText
        type="email"
        [formControl]="emailForgotPassword"
        placeholder="กรอกอีเมล์ที่ลงทะเบียนไว้"
      />
    </div>
    <div class="flex justify-content-center align-content-center gap-3 mt-3">
      <button
        pButton
        type="submit"
        class=""
        size="small"
        [disabled]="loading"
        (click)="forgotPassword()"
      >
        @if (!loading) {
          <span>reset password</span>
        } @else {
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        }
      </button>
    </div>
  `,
  styles: ``,
})
export class ForgotPasswordComponent {
  emailForgotPassword = new FormControl();
  ref = inject(DynamicDialogRef);
  loading = false;

  constructor(
    private authService: AuthService,
    private messageService: MessagesService,
  ) {}

  forgotPassword() {
    if (this.emailForgotPassword.value == null) {
      this.messageService.showError('Please enter a valid email address.');
      return;
    }

    this.loading = true;

    let email = this.emailForgotPassword.value;
    console.log(typeof email, 'email ', email);

    this.authService
      .forgotPassword(email)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.messageService.showSuccess('Email sent successfully.');
        },
        error: (error: any) => {
          this.messageService.showError(error.message);
        },
        complete: () => {
          this.loading = false;
          this.ref.close(true);
        },
      });
  }
}
