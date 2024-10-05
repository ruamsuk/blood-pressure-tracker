import { Component } from '@angular/core';
import {
  catchError,
  EMPTY,
  Observable,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { getAuth, User } from '@angular/fire/auth';
import { ImageUploadService } from '../../services/image-upload.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule],
  template: `
    <hr class="h-px bg-gray-200 border-0" />
    @if (user$ | async; as user) {
      <div class="flex justify-content-center">
        <div class="profile-image">
          <img
            [src]="user.photoURL ?? '/images/dummy-user.png'"
            alt="photo"
            width="120"
            height="120"
          />
          <p-button
            id="in"
            icon="pi pi-pencil"
            severity="success"
            [rounded]="true"
            [raised]="true"
            (click)="inputField.click()"
          />
        </div>
        <input
          #inputField
          type="file"
          hidden="hidden"
          (change)="uploadImage($event, user)"
        />
        @if (uploadProgress) {
          <p-progressBar [value]="uploadProgress"></p-progressBar>
        }
      </div>
      <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
        <div class="formgrid grid">
          <div class="field col">
            <label for="displayName">Display Name</label>
            <input
              pInputText
              type="text"
              class="w-full"
              name="displayName"
              formControlName="displayName"
            />
          </div>
          <div class="field col">
            <label for="email">Email</label>
            <input
              pInputText
              type="text"
              class="w-full"
              name="email"
              formControlName="email"
            />
            <small class="text-gray-400 font-italic ml-1">
              Email cannot be edited.
            </small>
          </div>
          <div class="formgrid grid">
            <div class="field col">
              <label for="firstName">First Name</label>
              <input
                pInputText
                type="text"
                class="w-full"
                name="firstName"
                formControlName="firstName"
              />
            </div>
            <div class="field col">
              <label for="lastName">Last Name</label>
              <input
                pInputText
                type="text"
                class="w-full"
                name="lastName"
                formControlName="lastName"
              />
            </div>
          </div>
          <div class="formgrid grid">
            <div class="field col">
              <label for="phone">Phone</label>
              <input
                pInputText
                type="text"
                class="w-full"
                name="phone"
                formControlName="phone"
              />
            </div>
            <div class="field col">
              <label for="role">Role</label>
              <input
                pInputText
                type="text"
                class="w-full"
                name="role"
                formControlName="role"
              />
              <small class="text-gray-400 font-italic ml-1">
                Role cannot be edited.
              </small>
            </div>
          </div>
        </div>
        <div class="field col">
          <div
            class="flex justify-content-center text-green-400 cursor-pointer"
          >
            @if (verify) {
              <i class="pi pi-verified"></i>
              <span class=" ml-2">Verified user.</span>
            } @else if (!verify) {
              <div class="text-orange-500" (click)="sendEmail()">
                <i class="pi pi-send"></i>
                <span class=" ml-2">Click to Verified email.</span>
              </div>
            }
          </div>
        </div>
        <div class="field col -mt-4">
          <label for="address">Address</label>
          <textarea
            rows="3"
            pInputTextarea
            formControlName="address"
            class="w-full"
          ></textarea>
        </div>
        <div class="field col -mt-3">
          <hr class="h-px bg-gray-200 border-0" />
          <div class="flex mt-3">
            <p-button
              label="Cancel"
              severity="secondary"
              styleClass="w-full"
              class="w-full mr-2"
              (onClick)="close()"
            />
            <p-button
              label="Save"
              styleClass="w-full"
              class="w-full"
              (onClick)="saveProfile()"
            />
          </div>
        </div>
      </form>
    }
  `,
  styles: `
    .profile-image > img {
      border-radius: 100%;
      object-fit: cover;
      object-position: center;
    }

    .profile-image {
      position: relative;
    }

    .profile-image > #in {
      position: absolute;
      bottom: 10px;
      left: 80%;
    }

    label {
      color: gray;
      margin-left: 5px;
    }
  `,
})
export class ProfileComponent {
  user$!: Observable<any>;
  disabled: boolean = true;
  verify: boolean | undefined = false;
  role: string | null = null;
  user: any;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    email: new FormControl({ value: '', disabled: this.disabled }),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
    role: new FormControl({ value: '', disabled: this.disabled }),
  });
  uploadProgress?: number;

  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private imageService: ImageUploadService,
    private authService: AuthService,
    private ref: DynamicDialogRef,
  ) {
    const auth = getAuth();

    this.user$ = this.authService.currentUser$;
    this.verify = auth.currentUser?.emailVerified;
    this.user = this.authService.currentUser();

    this.authService.currentUser$.pipe(take(1)).subscribe((user: any) => {
      this.profileForm.patchValue({ ...user });
    });
    this.authService.userProfile$.pipe(take(1)).subscribe((user: any) => {
      this.profileForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || '',
      });
    });
  }

  uploadImage(event: any, user: User) {
    const file = event.target.files[0];
    this.imageService
      .uploadImage(file, `images/profile/${user.uid}`)
      .pipe(
        switchMap((progress: number) => {
          console.log('Upload progress:', progress);
          this.uploadProgress = progress;
          if (progress === 100) {
            return this.imageService
              .getDownloadURL(`images/profile/${user.uid}`)
              .pipe(
                catchError((error) => {
                  console.error('Error getting download URL', error);
                  return throwError(error);
                }),
              );
          } else {
            return of(null);
          }
        }),
        switchMap((photoURL: string | null) => {
          if (photoURL) {
            console.log('Photo URL:', photoURL);
            return this.authService.updateProfileData({
              uid: user.uid,
              photoURL,
            });
          } else {
            return EMPTY;
          }
        }),
        catchError((error) => {
          console.error('Error updating profile:', error);
          // แสดงข้อความแจ้งให้ผู้ใช้ทราบ
          return throwError(error);
        }),
      )
      .subscribe({
        next: () => console.log('Upload complete'),
        error: (error: any) => console.error('Upload error: ', error),
      });
  }

  saveProfile() {}

  sendEmail() {}

  close() {
    this.ref.close();
  }
}
