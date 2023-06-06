import {AfterViewInit, Component, HostListener, Inject, ViewChild} from '@angular/core';
import {NgSignaturePadOptions, SignaturePadComponent} from "@almothafar/angular-signature-pad";
import {CustomerService} from "../../../../services/customer.service";
import {CommonService} from "../../../../services/common.service";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
const pdfStyles = `<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap');
:root {
  --font-source: 'Source Sans Pro', sans-serif;
  --font-inter: 'Inter', sans-serif;
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

.bear {
    display: none!important;
}

* {
  font-family: var(--font-source) !important;
  box-sizing: border-box;
}
.pers .line {
width: 100%;
display: flex;
align-items: center;
justify-content: space-between;
/*margin-bottom: 16px;*/
flex-wrap: wrap;
}
 .pers .line p {
font-style: normal;
font-weight: 400;
font-size: 18px;
line-height: 24px;
color: var(--color-neutral-5);
margin-left: auto;
margin-bottom: 0;
}

 .pers .line{
 margin-bottom: 0!important;
 margin-top: 0!important;
 }
  .pers .text{
  margin-bottom: 0!important;
  margin-top: 0!important;
 /*background: red;*/
 }

.pers .line .img{
display: flex;
align-content: center;
   /*margin-bottom: -18px!important;*/
}
.pers p, .pers div, .block p, .block div {
margin-bottom: 0!important;
margin-top: 0!important;
}
.pers .b-title, .block .b-title {
margin-bottom: 20px!important;
margin-top: 40px!important;
}
.pers .text, .block .text {
margin-bottom: 14px!important;
}

.pers .title, .block .title {
margin-top: 14px!important;
}

.pers .line  p,  .pers .line  .img, .pers .line  img{
margin-bottom: 0;
}
 .pers .line > div {
display: flex;
align-items: center;
}
 .pers .line > div:first-child {
margin-right: 10px;
}
 .pers .line > div .img {
margin-right: 11px;
display: flex;
align-items: center;
justify-content: center;
}
 .pers .line > div .img img {
max-width: 20px;
width: 20px;
}

.texts {
 display: grid;
 grid-template-columns: 1fr;
 grid-gap: 0;
}
 .texts .list {
 max-width: 900px;
 margin: auto;
 overflow: hidden;
 padding: 0 25px;
}
 .texts .block, .texts .pers {
 margin: 0 auto 0 auto;
 width: 100%;
}
 .texts .block .b-title, .texts .pers .b-title {
 margin-top: 40px;
}
 .texts .block .b-title, .texts .pers .b-title, .texts .block .b-title span, .texts .pers .b-title span {
 color: var(--color-neutral-6);
 text-align: center;
 font-style: normal;
 font-weight: 500;
 font-size: 25px;
 line-height: 30px;
 font-family: var(--font-inter) !important;
}
 .texts .block .b-title span, .texts .pers .b-title span {
 position: relative;
}
 .texts .block .b-title span:before, .texts .pers .b-title span:before {
 content: '';
 position: absolute;
 bottom: -10px;
 right: 0;
 width: 2000%;
 height: 6px;
 background: var(--color-primary-4);
}
 .texts .block .s-title, .texts .pers .s-title {
 font-weight: 600;
 font-size: 18px;
 line-height: 24px;
 color: var(--color-neutral-4);
 font-style: italic;
 /*margin-bottom: 24px;*/
 text-align: left;
}
 .texts .block .title, .texts .pers .title {
 font-style: normal;
 font-weight: 600;
 font-size: 18px;
 line-height: 24px;
 color: var(--color-neutral-5);
 /*margin-bottom: 14px;*/
}
 .texts .block .text, .texts .pers .text {
 font-style: normal;
 font-weight: 400;
 font-size: 18px;
 line-height: 24px;
 color: var(--color-neutral-5);
 /*margin-bottom: 4px;*/
}
 .texts .pers .b-title {
 max-width: 580px!important;
 white-space: nowrap;
}

.pers .line {
 max-width: 400px;
 margin-bottom: 0!important;
}

.pdfHead {
  height: 152px;
  background: linear-gradient(341.01deg, rgba(253, 242, 152, 0.4) 0%, rgba(95, 211, 223, 0.4) 100%);
  border-radius: 8px;
  width: calc(100% - 64px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 19px 48px;
  margin: 32px;
  box-sizing: border-box;
  margin-bottom: 10px!important;
}
.pdfHead .elems{
  display: flex;
  flex-direction: column;
}
.pdfHead .elems .box{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.pdfHead .elems .box div{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 6px;
}
.pdfHead .elems .box img {
  width: 16px;
  min-width: 16px;
  margin-right: 10px;
}
.pdfHead .elems .logo{
  height: 40px;
  margin-bottom: 10px;
  margin-left: auto;
}

.pdfFooter {
  min-width: 329px;
  width: fit-content;
  height: 103px;
  padding: 32px;
  background: linear-gradient(341.01deg, rgba(253, 242, 152, 0.3) 0%, rgba(95, 211, 223, 0.3) 100%);
  border-radius: 8px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px!important;
}

.pdfFooter img{
    max-height: 103px;
    height: 80px;
    width: auto;
}

.pdfFooter span {
  font-style: normal;
  white-space: nowrap;
  font-weight: 400;
  font-size: 32px;
  line-height: 40px;
  color: #332426;
}

</style>`;

const head = (email: string, address: string) => {
  return `
<div class="pdfHead">
  <div class="logo"><img src="https://digibox-cms.nadlo.pp.ua/uploads/Group_02076b2807.svg?updated_at=2023-03-16T07:59:57.376Z" alt=""></div>
  <div class="elems">
    <img class="logo" src="https://digibox-cms.nadlo.pp.ua//uploads/Digibox_1e835319c5.svg?updated_at=2023-03-16T08:00:17.285Z" alt="">
    <div class="box">
        <div>
               <img src="https://digibox-cms.nadlo.pp.ua/uploads/home_6e681bb427.svg?updated_at=2023-03-07T08:31:07.008Z" alt="home">
                <span>${address}</span>
        </div>
        <div>
        <img src="https://digibox-cms.nadlo.pp.ua/uploads/email_9469c78b7c.svg?updated_at=2023-03-07T13:12:39.636Z" alt="calendar">
                <span>${email}</span>
        </div>
        <div>
               <img src="https://digibox-cms.nadlo.pp.ua/uploads/Icon2_25c8d486c5.svg?updated_at=2023-03-16T08:15:24.118Z" alt="home">
                <span>www.digibox.com</span>
        </div>
    </div>
  </div>
</div>
`
}

const footer = (name: string, img_path: string) => {
  return `
<div class="pdfFooter">
    <img src="${img_path}" alt="kad">
</div>
`
}
@Component({
  selector: 'app-signature-link',
  templateUrl: './signature-link.component.html',
  styleUrls: ['./signature-link.component.scss']
})
export class SignatureLinkComponent implements AfterViewInit{
  @ViewChild('signature')
  // @ts-ignore
  public signaturePad: SignaturePadComponent;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.sizeCheck();
  }
  touched = false;
  img = '';

  signaturePadOptions: NgSignaturePadOptions = {
    minWidth: 5,
    canvasWidth: 5,
    canvasHeight: 3,
    backgroundColor: "rgba(66,133,244,0)"
  };

  constructor( private customerService: CustomerService,
               private commonService: CommonService,
               private router: Router,
               public dialog: MatDialog,
               public dialogRef: MatDialogRef<any>,
               @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngAfterViewInit() {
    this.sizeCheck();
  }

  drawComplete() {
    this.img = this.signaturePad.toDataURL()
  }

  clear() {
    this.signaturePad.clear();
  }

  sizeCheck () {
    const width = document?.getElementById("dign")?.clientWidth;
    const height = document?.getElementById("dign")?.clientHeight;

    width && this.signaturePad.set('canvasWidth', width);
    height && this.signaturePad.set('canvasHeight', height);
    this.signaturePad.clear();
  }

  async send() {
    this.touched = true;

    if(!this.img) {
      return;
    }

    this.dialog.closeAll();
    this.commonService.setLoading(true);

    let html = document.getElementById('cont')?.innerHTML;
    html = html?.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    const pdf = "<div class='texts'>" +
      head(this.data.email, this.data.address) +
      html +
      footer(this.data.fullName, this.img) +
      pdfStyles + "</div>"

    this.customerService.publishCustomerApi({pdf, email: this.data.email})
      .subscribe(async (response: any) => {
        if(response?.status === 'ok') {
          await this.router.navigate(['success-payment'], {
              queryParamsHandling: 'merge',
              queryParams: {
                email: this.data.email, edited: 'true'
              }
          });
        } else {
          this.commonService.setLoading(false);
        }
      }, () => {
        this.commonService.setLoading(false);
      });
  }
}
