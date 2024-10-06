import { Component, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessagesService } from '../../services/messages.service';
import { BloodService } from '../../services/blood.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedModule } from '../../shared/shared.module';
import { BloodPressure } from '../../models/blood-pressure.model';
import { BloodAddEditComponent } from './blood-add-edit.component';
import { Table } from 'primeng/table';
import { catchError, Observable, of } from 'rxjs';
import { ThaiDatePipe } from '../../pipe/thai-date.pipe';
import { UserService } from '../../services/user.service';
import { ConfirmationService } from 'primeng/api';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-blood-list',
  standalone: true,
  imports: [SharedModule, ThaiDatePipe],
  template: `
    <div class="table-container align-items-center justify-content-center mt-3">
      <div class="card">
        @if (bloods$ | async; as bloods) {
          <p-table
            #bp
            [value]="bloods"
            [paginator]="true"
            [globalFilterFields]="['date']"
            [rows]="5"
            [rowHover]="true"
            [breakpoint]="'960px'"
            [tableStyle]="{ 'min-width': '50rem' }"
            responsiveLayout="stack"
            styleClass="p-datatable-gridlines"
          >
            <ng-template pTemplate="caption">
              <div class="flex align-items-center justify-content-between">
                <span>
                  <p-button
                    (click)="showDialog('')"
                    [disabled]="!admin"
                    size="small"
                    icon="pi pi-plus"
                  />
                </span>
                <span
                  class="hidden md:block tasadith text-green-400 text-3xl ml-auto"
                >
                  Bloods Pressure List
                </span>
                <p-iconField iconPosition="left" class="ml-auto">
                  <p-inputIcon>
                    <i class="pi pi-search"></i>
                  </p-inputIcon>
                  <input
                    class="sarabun"
                    pInputText
                    [(ngModel)]="searchValue"
                    pTooltip="Search Date."
                    tooltipPosition="bottom"
                    placeholder="Search Date .."
                    type="text"
                    (input)="bp.filterGlobal(getValue($event), 'contains')"
                  />
                  @if (searchValue) {
                    <span class="icons" (click)="clear(bp)">
                      <i class="pi pi-times" style="font-size: 1rem"></i>
                    </span>
                  }
                </p-iconField>
              </div>
            </ng-template>
            <ng-template pTemplate="header">
              <tr>
                <th rowspan="3" style="width: 20%">Date.</th>
              </tr>
              <tr>
                <th
                  colspan="2"
                  style="width: 20%"
                  class="text-center text-green-400"
                >
                  Morning<br /><span class="text-gray-600"
                    >(Before medicine)</span
                  >
                </th>
                <th
                  colspan="2"
                  style="width: 20%"
                  class="text-center text-yellow-400"
                >
                  Evening<br /><span class="text-gray-600"
                    >(After medicine )</span
                  >
                </th>
                <th></th>
              </tr>
              <tr>
                <th style="width: 15%" class="text-green-400">BP1</th>
                <th style="width: 15%" class="text-green-400">BP2</th>
                <th style="width: 15%" class="text-yellow-400">BP1</th>
                <th style="width: 15%" class="text-yellow-400">BP2</th>
                <th style="width: 15%" class="text-teal-400">Action</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-blood let-i="rowIndex">
              <tr>
                <!--<td>
                  {{ currentPage * rowsPerPage + i + 1 }}
                </td>-->
                <td>
                  <span class="p-column-title">Date</span>
                  {{ blood.date | thaiDate }}
                </td>
                <td>
                  <div
                    [ngClass]="{
                      'high-bp': isBloodPressureHigh(blood.morning.bp1),
                      'normal-bp': !isBloodPressureHigh(blood.morning.bp1),
                    }"
                  >
                    {{ blood.morning.bp1 }}
                  </div>
                </td>
                <td>
                  <div
                    [ngClass]="{
                      'high-bp': isBloodPressureHigh(blood.morning.bp2),
                      'normal-bp': !isBloodPressureHigh(blood.morning.bp1),
                    }"
                  >
                    {{ blood.morning.bp2 }}
                  </div>
                </td>
                <td>
                  <div
                    [ngClass]="{
                      'high-bp': isBloodPressureHigh(blood.evening.bp1),
                      'normal-bp': !isBloodPressureHigh(blood.morning.bp1),
                    }"
                  >
                    {{ blood.evening.bp1 }}
                  </div>
                </td>
                <td>
                  <div
                    [ngClass]="{
                      'high-bp': isBloodPressureHigh(blood.evening.bp2),
                      'normal-bp': !isBloodPressureHigh(blood.morning.bp1),
                    }"
                  >
                    {{ blood.evening.bp2 }}
                  </div>
                </td>
                <td>
                  @if (admin) {
                    <i
                      class="pi pi-pen-to-square mr-2 ml-2 text-blue-400"
                      (click)="showDialog(blood)"
                    ></i>
                    <p-confirmPopup />
                    <i
                      class="pi pi-trash mr-2 ml-2 text-orange-600"
                      (click)="confirm($event, blood.id)"
                    ></i>
                  } @else {
                    <i class="pi pi-lock text-100"></i>
                  }
                </td>
              </tr>
            </ng-template>
          </p-table>
        }
      </div>
    </div>
  `,
  styles: `
    td {
      font-family: 'Sarabun', sans-serif !important;
      color: #a3a1a1;
    }

    .icons {
      position: relative;
      right: 30px;
      //top: 10px;
    }

    .high-bp {
      color: red;
    }

    .normal-bp {
      color: inherit; /* หรือสีอื่นที่ต้องการ */
    }
  `,
})
export class BloodListComponent implements OnInit, OnDestroy {
  ref: DynamicDialogRef | undefined;
  bloods$!: Observable<BloodPressure[]>;
  currentUser: any;

  admin: boolean = false;
  searchValue: string = '';
  // สำหรับสร้างเลขลำดับรายการในตาราง
  // currentPage = 0;
  // rowsPerPage = 10;

  constructor(
    private confService: ConfirmationService,
    private dialogService: DialogService,
    private bloodService: BloodService,
    private messageService: MessagesService,
    private destroyRef: DestroyRef,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.currentUserProfile$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.admin = user?.role === 'admin' || user?.role === 'manager';
        this.currentUser = user;
      });
    this.getBloodList();
  }

  getBloodList() {
    this.messageService.showLoading();
    this.bloods$ = this.bloodService.getBloods().pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError((error: Error) => {
        this.messageService.showError(error.message);
        return of([]);
      }),
    );
    this.bloods$.subscribe({
      next: () => {
        this.messageService.hideLoading();
      },
    });
  }

  /** */
  isBloodPressureHigh(bp: string): boolean {
    const [systolic, diastolic] = bp.split('/').map(Number);
    return systolic > 140 || diastolic > 90;
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  showDialog(blood: any) {
    let header = blood ? 'แก้ไขรายการ' : 'เพิ่มรายการ';

    this.ref = this.dialogService.open(BloodAddEditComponent, {
      data: blood,
      header: header,
      width: '360px',
      breakpoints: {
        '960px': '90vw',
        '640px': '90vw',
        '390px': '90vw',
      },
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  ngOnDestroy() {
    if (this.ref) this.ref.close();
  }

  confirm(event: Event, morning: any) {
    this.confService.confirm({
      target: event.target as EventTarget,
      message: 'ต้องการลบรายการนี้ แน่ใจ?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-warning p-button-sm',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.bloodService.deleteBlood(morning).subscribe({
          next: () => {
            this.messageService.showSuccess('ลบข้อมูลเรียบร้อยแล้ว');
          },
          error: (error: any) => {
            this.messageService.showError(error.message);
          },
          complete: () => {},
        });
      },
      reject: () => {
        this.messageService.showWarn('ยกเลิกการลบแล้ว!');
      },
    });
  }
}
