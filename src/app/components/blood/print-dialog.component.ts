import { Component, OnDestroy } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ThaiDatePipe } from '../../pipe/thai-date.pipe';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-print-dialog',
  standalone: true,
  imports: [SharedModule, ThaiDatePipe],
  template: `
    @if (dataPrint) {
      <div id="printContent">
        <table class="custom-table">
          <thead>
            <tr>
              <th rowspan="3" style="width: 15%">Date</th>
            </tr>
            <tr>
              <th colspan="2" style="width: 20%" class="text-center">
                Morning<br /><span class="text-gray-600"
                  >(Before medicine)</span
                >
              </th>
              <th colspan="2" style="width: 20%" class="text-center">
                Evening<br /><span class="text-gray-600"
                  >(After medicine )</span
                >
              </th>
            </tr>
            <tr>
              <th style="width: 15%">BP1</th>
              <th style="width: 15%">BP2</th>
              <th style="width: 15%">BP1</th>
              <th style="width: 15%">BP2</th>
            </tr>
          </thead>
          <tbody>
            @for (blood of dataPrint.blood; track $index) {
              <tr>
                <td>{{ blood.date | thaiDate }}</td>
                <td>{{ blood.morning.bp1 }}</td>
                <td>{{ blood.morning.bp2 }}</td>
                <td>{{ blood.evening.bp1 }}</td>
                <td>{{ blood.evening.bp2 }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="text-center mt-5">
        <p-button
          label="Convert2Pdf"
          severity="secondary"
          size="small"
          (onClick)="generatePDF()"
        ></p-button>
      </div>
    }
  `,
  styles: `
    .custom-table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      color: black;
    }

    .custom-table th,
    .custom-table td {
      border: 1px solid #ddd;
      padding: 4px;
      font-family: 'Roboto', sans-serif !important;
      font-size: 12px !important;
      font-weight: bolder !important;
    }

    .custom-table th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      background-color: #f2f2f2;
      color: black;
    }
  `,
})
export class PrintDialogComponent implements OnDestroy {
  dataPrint: any;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {
    if (this.config.data) {
      this.dataPrint = config.data;
    }
  }

  generatePDF() {
    const data = document.getElementById('printContent');
    if (data) {
      html2canvas(data).then((canvas) => {
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('blood-pressure-list.pdf');

        this.ref.close();
      });
    }
  }

  ngOnDestroy() {
    if (this.ref) this.ref.close();
  }
}
