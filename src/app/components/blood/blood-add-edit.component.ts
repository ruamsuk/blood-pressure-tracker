import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TimeOptions } from '../../models/blood-pressure.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BloodService } from '../../services/blood.service';
import { MessagesService } from '../../services/messages.service';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { take } from 'rxjs';

@Component({
  selector: 'app-blood-add-edit',
  standalone: true,
  imports: [SharedModule],
  template: `
    <form [formGroup]="bpForm" (ngSubmit)="onSubmit()">
      <hr class="h-px bg-gray-200 border-0" />
      <input type="hidden" name="hidden" />
      <div class="formgrid grid">
        <div formGroupName="morning" class="field col-6 mt-3">
          <label for="date">วันที่ทำรายการ</label>
          <p-calendar
            [iconDisplay]="'input'"
            [showIcon]="true"
            [inputStyle]="{ width: '90vw' }"
            appendTo="body"
            inputId="icondisplay"
            formControlName="date"
            name="date"
            class="w-full"
          />
        </div>
      </div>
      <div class="formgrid grid">
        <div formGroupName="morning" class="field col-12 md:col-6">
          <label>เวลาเช้า</label>
          <input pInputText type="text" value="Morning" readonly />
        </div>
        <div formGroupName="morning" class="field col-12 md:col-6">
          <label for="bp1-sys">BP1 SYS</label>
          <input pInputText formControlName="bp1Sys" />
        </div>
      </div>
      <div class="formgrid grid">
        <div formGroupName="morning" class="field col-12 md:col-6">
          <label for="">BP1 DIA</label>
          <input pInputText formControlName="bp1Dia" />
        </div>
        <div formGroupName="morning" class="field col-12 md:col-6">
          <label for="">BP1 Pulse</label>
          <input pInputText formControlName="bp1Pulse" />
        </div>
      </div>
      <div class="formgrid grid">
        <div formGroupName="morning" class="field col-12 md:col-6">
          <label for="">BP2 SYS</label>
          <input pInputText formControlName="bp2Sys" />
        </div>
        <div formGroupName="morning" class="field col-12 md:col-6">
          <label for="">BP2 DIA</label>
          <input pInputText formControlName="bp2Dia" />
        </div>
      </div>
      <div class="formgrid grid">
        <div formGroupName="morning" class="field col-12 md:col-6">
          <label for="">BP2 Pulse</label>
          <input pInputText formControlName="bp2Pulse" />
        </div>
      </div>
      <!--// evening -->
      <hr class="h-px bg-gray-200 border-0" />
      <div class="formgrid grid mt-2">
        <div formGroupName="evening" class="field col-12 md:col-6">
          <label>เวลาเย็น</label>
          <input pInputText type="text" value="Evening" readonly />
        </div>
        <div formGroupName="evening" class="field col-12 md:col-6">
          <label for="bp1-sys">BP1 SYS</label>
          <input pInputText formControlName="bp1Sys" />
        </div>
      </div>
      <div class="formgrid grid">
        <div formGroupName="evening" class="field col-12 md:col-6">
          <label for="">BP1 DIA</label>
          <input pInputText formControlName="bp1Dia" />
        </div>
        <div formGroupName="evening" class="field col-12 md:col-6">
          <label for="">BP1 Pulse</label>
          <input pInputText formControlName="bp1Pulse" />
        </div>
      </div>
      <div class="formgrid grid">
        <div formGroupName="evening" class="field col-12 md:col-6">
          <label for="">BP2 SYS</label>
          <input pInputText formControlName="bp2Sys" />
        </div>
        <div formGroupName="evening" class="field col-12 md:col-6">
          <label for="">BP2 DIA</label>
          <input pInputText formControlName="bp2Dia" />
        </div>
      </div>
      <div class="formgrid grid">
        <div formGroupName="evening" class="field col-12 md:col-6">
          <label for="">BP2 Pulse</label>
          <input pInputText formControlName="bp2Pulse" />
        </div>
      </div>
      <div class="field">
        <hr class="h-px bg-gray-200 border-0 mb-1" />
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
  ) {
    this.bpForm = this.fb.group({
      morning: this.fb.group({
        date: [''],
        bp1Sys: [''],
        bp1Dia: [''],
        bp1Pulse: [''],
        bp2Sys: [''],
        bp2Dia: [''],
        bp2Pulse: [''],
      }),
      evening: this.fb.group({
        bp1Sys: [''],
        bp1Dia: [''],
        bp1Pulse: [''],
        bp2Sys: [''],
        bp2Dia: [''],
        bp2Pulse: [''],
      }),
    });
  }

  ngOnInit() {
    if (this.config.data) {
    }

    this.timeOptions = [
      { name: 'เช้า', code: 'morning' },
      { name: 'เย็น', code: 'morning' },
    ];

    this.translate.setDefaultLang('th');
    this.slate('th');
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
        complete: () => close(),
      });
    }
  }

  ngOnDestroy() {}

  close() {
    this.ref.close();
  }
}
