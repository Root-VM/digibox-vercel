import { Component } from '@angular/core';
import {CommonService} from "../../services/common.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {CustomerService} from "../../services/customer.service";
import {SecureFormComponent} from "../../components/secure-form/secure-form.component";
import {loadFromStore, saveToStore} from "../../methods/locale-store";

@Component({
  selector: 'app-preview-link-page',
  templateUrl: './preview-link-page.component.html',
  styleUrls: ['./preview-link-page.component.scss']
})
export class PreviewLinkPageComponent {
  wrongSecure = false;
  sent = false;
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
    const check_secure = loadFromStore('secured_for_edit');

    if(check_secure) {
      this.wrongSecure = false;
      this.sent = true;
    } else {
      this.wrongSecure = false;
      this.sent = false;
      this.openDialog();
    }
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
      saveToStore('customer_progress', customer?.data[0].attributes?.data);
      saveToStore('secured_for_edit', true);
      setTimeout(() => {
        this.wrongSecure = false;
      }, 100)
    } else {
      this.wrongSecure = true;
    }

    setTimeout(() => {
      this.sent = true;
      this.commonService.setLoading(false);
    }, 100)

  }
}
