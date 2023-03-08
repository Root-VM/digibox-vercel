import {Component, Input} from '@angular/core';
import {CustomerService} from "../../../../services/customer.service";
import {CommonService} from "../../../../services/common.service";
import {Router} from "@angular/router";

const pdfStyles = `<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap');
:root {
  --font-source: 'Source Sans Pro', sans-serif;
  --color-neutral-1: #FFFFFF;
  --color-neutral-2: #ECECEC;
  --color-neutral-3: #C8C8C8;
  --color-neutral-4: #919191;
  --color-neutral-5: #484848;
  --color-neutral-6: #332426;
  --color-neutral-7: #220D15;
  --color-primary-1: #CAF9F7;
  --color-primary-2: #97F2F4;
  --color-primary-3: #5FD3DF;
  --color-primary-4: #36A9BF;
  --color-primary-5: #077495;
  --color-primary-6: #055A80;
  --color-primary-7: #03446B;
  --color-secondary-1: #FEFEF4;
  --color-secondary-2: #FDF298;
  --color-secondary-3: #FAE764;
  --color-secondary-4: #F6DB3D;
  --color-secondary-5: #F0CA00;
  --color-secondary-6: #CEAA00;
  --color-secondary-7: #AC8B00;
  --color-error: #9B2539;
  --color-success: #11873E;
}
* {
  font-family: var(--font-source) !important;
  box-sizing: border-box;
}
.texts {
 display: grid;
 grid-template-columns: 1.2fr 0.8fr;
 grid-gap: 60px;
 width: 100%;
 padding: 0 20px;
}
 .texts .block, .texts .pers {
 margin: 0 auto 20px auto;
 width: 100%;
}
 .texts .block .b-title, .texts .pers .b-title {
 font-style: normal;
 font-weight: 600;
 font-size: 18px;
 line-height: 24px;
 color: var(--color-neutral-5);
 margin-bottom: 24px;
 text-align: center;
}
 .texts .block .s-title, .texts .pers .s-title {
 font-weight: 600;
 font-size: 18px;
 line-height: 24px;
 color: var(--color-neutral-4);
 font-style: italic;
 margin-bottom: 24px;
 text-align: left;
}
 .texts .block .title, .texts .pers .title {
 font-style: normal;
 font-weight: 600;
 font-size: 18px;
 line-height: 24px;
 color: var(--color-neutral-5);
 margin-bottom: 14px;
}
 .texts .block .text, .texts .pers .text {
 font-style: normal;
 font-weight: 400;
 font-size: 18px;
 line-height: 24px;
 color: var(--color-neutral-5);
 margin-bottom: 14px;
}
.texts .pers {
 margin-bottom: 0;
}

.pers div {
 margin-bottom: 0!important;

}

.pers .text {
margin-bottom: 14px!important;
}
.pers .line {
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: space-between;
 margin-bottom: 0!important;
 max-height: 24px;
}
 .pers .line p {
 font-style: normal;
 font-weight: 400;
 font-size: 18px;
 line-height: 24px;
 color: var(--color-neutral-5);
}
 .pers .line >p {
    margin-left: auto;
}
 .pers .line > div {
 display: flex;
 align-items: center;
}
.pers .line > div:first-child {
 margin-right: 10px;
}
.pers .line > div:first-child p {
 white-space: nowrap;
}
 .pers .line > div .img {
 margin-right: 11px;
 width: 18px;
 display: flex;
 align-items: center;
 justify-content: center;
}
 .pers .line > div .img img {
 max-width: 26px;
}

</style>`;

@Component({
  selector: 'app-control-next',
  templateUrl: './control-next.component.html',
  styleUrls: ['./control-next.component.scss']
})
export class ControlNextComponent {
  @Input() email = '';
  @Input() fullName = '';

  constructor(
    private customerService: CustomerService,
    private commonService: CommonService,
    private router: Router) {}

  async send() {
    this.commonService.setLoading(true);

    const html = document.getElementById('cont')?.innerHTML;
    const pdf = "<div class='texts'>" + html + pdfStyles + "</div>"

    this.customerService.postPdfApi({pdf, email: this.email, fullName: this.fullName})
      .subscribe(async (response: any) => {
        console.log('pdf----->', response);

        // var byteCharacters = atob(response.data);
        // var byteNumbers = new Array(byteCharacters.length);
        // for (var i = 0; i < byteCharacters.length; i++) {
        //   byteNumbers[i] = byteCharacters.charCodeAt(i);
        // }
        // var byteArray = new Uint8Array(byteNumbers);
        // var file = new Blob([byteArray], { type: 'application/pdf;base64' });
        // var fileURL = URL.createObjectURL(file);
        // window.open(fileURL);

        this.commonService.setLoading(false);
        await this.router.navigate(['/success']);

      }, (e: any) => {
        console.log(e)
        this.commonService.setLoading(false);});
  }
}
