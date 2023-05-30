import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {MatDialog} from "@angular/material/dialog";
import {SecureFormComponent} from "../../components/secure-form/secure-form.component";
import {ActivatedRoute} from "@angular/router";
import {CustomerService} from "../../services/customer.service";
import {environment} from "../../../environments/environment";
@Component({
  selector: 'app-pdf-page',
  templateUrl: './pdf-page.component.html',
  styleUrls: ['./pdf-page.component.scss']
})
export class PdfPageComponent implements OnInit {
  apiUrl = environment.API_URL;
  noFile = false;
  pdfLink = '';
  email = '';

  constructor(
    private commonService: CommonService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private customerService: CustomerService

  ) {
    this.commonService.setLoading(false);
  }

  ngOnInit() {
    this.openDialog();
    this.route.queryParamMap.subscribe(params => {
      const value = params.get('email');
      if(value) {
        this.email = value;
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SecureFormComponent, {
      data: {password: ''}
    });

    dialogRef.afterClosed().subscribe(secure => {
      console.log('The dialog was closed', secure);

      if(secure) {
        this.loadPdf(secure);
      }
    });
  }

  async loadPdf(secure: string) {
    this.commonService.setLoading(true);

    secure = '744429';
    const customer = await this.customerService.loadPdf(this.email, secure);

    if(customer?.data?.length) {
      const link = this.apiUrl.slice(0, -1) + customer?.data[0]?.attributes?.pdf_link;
      if(link) {
        const getLocalPdfUrl = async (link: string) => {
          const response = await fetch(link);
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        };

        const pdf_link = await getLocalPdfUrl(link);
        if(pdf_link) {
          window.open(pdf_link, '_blank')
          const new_tab = window.open(pdf_link, '_blank');
          if (new_tab) {
            new_tab.focus();
          }
        }
        this.noFile = false;
      } else {
        this.pdfLink = '';
        this.noFile = true;
      }
    } else {
      this.pdfLink = '';
      this.noFile = true;
    }

    console.log('customer', customer);

    this.commonService.setLoading(false);

  }
}
