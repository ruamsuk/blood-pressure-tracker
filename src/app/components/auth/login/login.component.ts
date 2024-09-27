import { Component, inject, OnDestroy } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MessagesService } from '../../../services/messages.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, RouterLink],
  template: `
    <div class="flex justify-content-center flex-wrap">
      <div class="flex justify-content-center align-items-center h-screen">
        <form [formGroup]="loginForm" (ngSubmit)="login()">
          <p-card header="Log in" [style]="{ width: '360px' }">
            <ng-template pTemplate="p-card-content">
              <div class="field">
                <label>Email</label>
                <input
                  type="email"
                  pInputText
                  formControlName="email"
                  class="w-full"
                  name="email"
                />
                <small
                  class="block p-error pl-2 font-semibold"
                  *ngIf="isEmailValid as message"
                >
                  {{ message }}
                </small>
              </div>
              <div class="field">
                <label>Password</label>
                <p-password
                  class="w-full {{
                    isValidPassword ? 'ng-invalid ng-dirty' : ''
                  }}"
                  [feedback]="false"
                  formControlName="password"
                  styleClass="p-password p-component p-inputwrapper p-input-icon-right"
                  [style]="{ width: '100%' }"
                  [inputStyle]="{ width: '100%' }"
                  [toggleMask]="true"
                />
                <small
                  class="block p-error pl-2 font-semibold"
                  *ngIf="isValidPassword as messages"
                >
                  {{ messages }}
                </small>
                <div class="mt-2">
                  <span
                    class="sarabun text-blue-600 font-italic cursor-pointer hover:text-red-600"
                    (click)="forgotPassword()"
                  >
                    ลืมรหัสผ่าน
                  </span>
                </div>
              </div>
            </ng-template>
            <ng-template pTemplate="footer">
              <div class="flex gap-3 mt-1">
                <p-button
                  label="Login"
                  class="w-full"
                  styleClass="w-full"
                  [disabled]="loginForm.invalid"
                  type="submit"
                  [loading]="loading"
                />
              </div>
              <div class="mt-2 ml-2">
                Not a member?
                <a routerLink="/auth/sign-up">
                  <span class="text-blue-600>Register">Register</span>
                </a>
              </div>
            </ng-template>
          </p-card>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class LoginComponent implements OnDestroy {
  ref!: DynamicDialogRef;
  loading: boolean = false;

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  message = inject(MessagesService);
  router = inject(Router);
  dialogService = inject(DialogService);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get isEmailValid(): string | boolean {
    const control = this.loginForm.get('email');

    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      return control.hasError('required')
        ? 'This field is required'
        : 'Enter a valid email';
    }

    return false;
  }

  get isValidPassword(): any {
    const control = this.loginForm.get('password');
    const isInvalid = control?.invalid && control.touched;
    if (isInvalid) {
      return control.hasError('required')
        ? 'This field is required'
        : 'Enter a valid password';
    }
  }

  login(): void {
    this.load(true);
    this.message.showLoading();
    const { email, password } = this.loginForm.value;

    if (!this.loginForm.valid || !email || !password) {
      return;
    }

    this.authService.login(email, password).subscribe({
      next: () => {
        this.message.showSuccess('Successfully logged in');
        setTimeout(() => {
          this.router.navigateByUrl('/home').then();
        }, 500);
      },
      error: (err) => {
        this.message.showError(`Unable to login: ${err.code}`);
        this.load(false);
      },
      complete: () => {
        this.load(false);
        this.message.hideLoading();
      },
    });
  }

  forgotPassword() {
    this.ref = this.dialogService.open(ForgotPasswordComponent, {
      header: 'Forgot your password',
      width: '350px',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '90vw',
        '640px': '95vw',
      },
    });
  }

  load(style: boolean) {
    this.loading = style;
  }

  ngOnDestroy() {
    if (this.ref) this.ref.destroy();
  }
}
