import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeOptions } from '../../models/blood-pressure.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BloodService } from '../../services/blood.service';
import { MessagesService } from '../../services/messages.service';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { take } from 'rxjs';
import { InputMask } from 'primeng/inputmask';

@Component({
  selector: 'app-blood-add-edit',
  standalone: true,
  imports: [SharedModule],
  template: `
    <form [formGroup]="bpForm" (ngSubmit)="onSubmit()">
      <hr class="h-px bg-gray-200 border-0" />
      <input type="hidden" name="hidden" />
      <div class="card p-fluid flex flex-wrap gap-3">
        <div class="flex-auto">
          <span class="sarabun block mb-2"> Date </span>
          <p-calendar
            [iconDisplay]="'input'"
            [showIcon]="true"
            dateFormat="dd/mm/yy"
            appendTo="body"
            inputId="icondisplay"
            formControlName="date"
            name="date"
            class="w-full"
            (onSelect)="onDateSelect()"
          />
        </div>
        <div class="flex-auto">
          <span class="mb-2 block sarabun">Morning </span>
          <input
            pInputText
            type="text"
            value="Morning"
            readonly
            tabindex="-1"
            class="w-full"
            hidden="hidden"
          />
          <hr class="h-px bg-gray-200 border-0" />
        </div>
        <div class="flex-auto" formGroupName="morning">
          <span class="mb-2 block sarabun">BP1 Morning </span>
          <p-inputMask
            #bp1Morning
            formControlName="bp1"
            mask="999/99 P99"
            placeholder="120/80 P60"
            class="w-full"
            (onComplete)="moveFocus(bp2Morning)"
          ></p-inputMask>
        </div>
        <div class="flex-auto" formGroupName="morning">
          <span class="mb-2 block sarabun">BP2 Morning </span>
          <p-inputMask
            #bp2Morning
            formControlName="bp2"
            mask="999/99 P99"
            placeholder="120/80 P60"
            class="w-full"
            (onComplete)="moveFocus(bp1Evening)"
          ></p-inputMask>
        </div>
        <div class="flex-auto">
          <span class="mb-2 block sarabun">Evening </span>
          <input
            pInputText
            type="text"
            value="Evening"
            readonly
            tabindex="-1"
            class="w-full"
            hidden="hidden"
          />
          <hr class="h-px bg-gray-200 border-0" />
        </div>
        <div class="flex-auto" formGroupName="evening">
          <span class="mb-2 block sarabun">BP1 Evening </span>
          <p-inputMask
            #bp1Evening
            formControlName="bp1"
            mask="999/99 P99"
            placeholder="120/80 P60"
            class="w-full"
            (onComplete)="moveFocus(bp2Evening)"
          ></p-inputMask>
        </div>
        <div class="flex-auto" formGroupName="evening">
          <span class="mb-2 block sarabun">BP2 Evening </span>
          <p-inputMask
            #bp2Evening
            formControlName="bp2"
            mask="999/99 P99"
            placeholder="120/80 P60"
            class="w-full"
          ></p-inputMask>
        </div>
      </div>
      <!--/ card flex-->

      <div class="flex mt-5 mb-1">
        <p-button
          label="Cancel"
          severity="secondary"
          styleClass="w-full"
          class="w-full mr-2"
          (onClick)="close()"
        />
        <p-button
          label="Save"
          [disabled]="bpForm.invalid"
          styleClass="w-full"
          class="w-full"
          (onClick)="onSubmit()"
        />
      </div>
    </form>
  `,
  styles: `
    label,
    input {
      font-family: Sarabun, sans-serif;
    }
  `,
})
export class BloodAddEditComponent implements OnInit, OnDestroy {
  @ViewChild('bp1Morning') bp1Morning: InputMask | undefined;
  @ViewChild('bp2Morning') bp2Morning: InputMask | undefined;
  @ViewChild('bp1Evening') bp1Evening: InputMask | undefined;
  @ViewChild('bp2Evening') bp2Evening: InputMask | undefined;

  bpForm!: FormGroup;
  timeOptions: TimeOptions[] | undefined;

  constructor(
    private bloodService: BloodService,
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private message: MessagesService,
    private translate: TranslateService,
    private pConfig: PrimeNGConfig,
    private renderer: Renderer2,
  ) {
    this.bpForm = this.fb.group({
      date: [''],
      morning: this.fb.group({
        bp1: ['', Validators.required],
        bp2: ['', Validators.required],
      }),
      evening: this.fb.group({
        bp1: ['', Validators.required],
        bp2: ['', Validators.required],
      }),
    });
  }

  ngOnInit() {
    if (this.config.data) {
      const data = this.config.data;
      this.bpForm.patchValue({
        id: data.id,
        date: data.date.toDate(),
        morning: {
          bp1: data.morning.bp1,
          bp2: data.morning.bp2,
        },
        evening: {
          bp1: data.evening.bp1,
          bp2: data.evening.bp2,
        },
      });
    }

    this.timeOptions = [
      { name: 'เช้า', code: 'morning' },
      { name: 'เย็น', code: 'morning' },
    ];

    this.translate.setDefaultLang('th');
    this.slate('th');
  }

  onDateSelect() {
    setTimeout(() => {
      if (this.bp1Morning) {
        const inputElement =
          this.bp1Morning.el.nativeElement.querySelector('input');
        if (inputElement) {
          this.renderer.selectRootElement(inputElement).focus();
        }
      }
      this.bp1Morning?.el.nativeElement.focus();
    }, 0);
  }

  moveFocus(nextElement: InputMask): void {
    nextElement.focus();
  }

  slate(lang: string) {
    this.translate.use(lang);
    this.translate
      .get('th')
      .pipe(take(1))
      .subscribe((res) => this.pConfig.setTranslation(res));
  }

  onSubmit() {
    if (this.bpForm.invalid) {
      return;
    }
    console.log(JSON.stringify(this.bpForm.value, null, 2));
    if (this.config.data) {
      // edit data
    } else {
      this.bloodService.createBlood(this.bpForm.value).subscribe({
        next: () => {
          this.message.showSuccess('Create Blood pressure successfully');
        },
        error: (error) => {
          this.message.showError(error.message);
        },
        complete: () => this.close(),
      });
    }
  }

  ngOnDestroy() {
    if (this.ref) this.ref.destroy();
  }

  close() {
    this.ref.close();
  }
}
