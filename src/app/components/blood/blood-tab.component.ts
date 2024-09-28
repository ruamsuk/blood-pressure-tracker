import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BloodListComponent } from './blood-list.component';
import { BloodTimePeriodComponent } from './blood-time-period.component';
import { BloodYearPeriodComponent } from './blood-year-period.component';

@Component({
  selector: 'app-blood-tab',
  standalone: true,
  imports: [
    SharedModule,
    BloodListComponent,
    BloodTimePeriodComponent,
    BloodYearPeriodComponent,
  ],
  template: `
    <div class="flex mb-2 mt-3 gap-2 mr-2 justify-content-end">
      <p-button
        (onClick)="activeIndex = 0"
        rounded="true"
        styleClass="w-2rem h-2rem p-0"
        [outlined]="activeIndex !== 0"
        label="1"
      />
      <p-button
        (onClick)="activeIndex = 1"
        rounded="true"
        styleClass="w-2rem h-2rem p-0"
        [outlined]="activeIndex !== 1"
        label="2"
      />
      <p-button
        (onClick)="activeIndex = 2"
        rounded="true"
        styleClass="w-2rem h-2rem p-0"
        [outlined]="activeIndex !== 2"
        label="3"
      />
    </div>
    <div class="flex justify-content-center align-items-center">
      <div class="card">
        <p-tabView
          [(activeIndex)]="activeIndex"
          [scrollable]="true"
          scrollHeight="flex"
          [style]="{ width: '900px' }"
        >
          <p-tabPanel header="Blood List">
            <app-blood-list />
          </p-tabPanel>
          <p-tabPanel header="Time period">
            <app-blood-time-period />
          </p-tabPanel>
          <p-tabPanel header="Year period">
            <app-blood-year-period />
          </p-tabPanel>
        </p-tabView>
      </div>
    </div>
  `,
  styles: ``,
})
export class BloodTabComponent {
  activeIndex: number = 0;
}
