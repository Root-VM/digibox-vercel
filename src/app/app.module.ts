import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatBotPageComponent } from './pages/chat-bot-page/chat-bot-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainTemplateComponent } from './templates/main-template/main-template.component';
import { HeaderComponent } from './templates/main-template/header/header.component';
import { VideoBlockComponent } from './components/video-block/video-block.component';
import { ChatDataComponent } from './pages/chat-bot-page/chat-data/chat-data.component';
import { MessageComponent } from './pages/chat-bot-page/chat-data/message/message.component';
import { ControlsComponent } from './pages/chat-bot-page/chat-data/controls/controls.component';
import {MatButtonModule} from "@angular/material/button";
import { ProgressStatusComponent } from './components/progress-status/progress-status.component';
import { InputBlockComponent } from './components/input-block/input-block.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ThanksBlockComponent } from './components/thanks-block/thanks-block.component';
import { PreviewPageComponent } from './pages/preview-page/preview-page.component';
import { PreviewDataComponent } from './pages/preview-page/preview-data/preview-data.component';
import { ControlNextComponent } from './pages/preview-page/preview-data/control-next/control-next.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import {LayoutModule} from '@angular/cdk/layout';
import {IfViewportSizeDirective} from './directives/viewport-size.directive';
import { SidebarComponent } from './templates/main-template/sidebar/sidebar.component';
import {HttpClientModule} from "@angular/common/http";
import { LoadingWindowComponent } from './components/loading-window/loading-window.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { MarkdownPipe } from './pipes/markdown.pipe';
import {MatSelectModule} from '@angular/material/select';
import { SortPipe } from './pipes/sort.pipe';
import { ResetProgressComponent } from './components/reset-progress/reset-progress.component';
import { ExplanationBoxComponent } from './components/explanation-box/explanation-box.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatNativeDateModule} from "@angular/material/core";
import { FilterPipe } from './pipes/filter.pipe';
import {MatTooltipModule} from "@angular/material/tooltip";
import {AngularSignaturePadModule} from "@almothafar/angular-signature-pad";
import { SignatureComponent } from './pages/preview-page/preview-data/signature/signature.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { ReloadComponent } from './templates/main-template/reload/reload.component';
import { EditChatPageComponent } from './pages/edit-chat-page/edit-chat-page.component';
import {ChatDataEditComponent} from "./pages/edit-chat-page/chat-data-edit/chat-data-edit.component";
import {MessageEditComponent} from "./pages/edit-chat-page/chat-data-edit/message-edit/message-edit.component";
import {ControlsEditComponent} from "./pages/edit-chat-page/chat-data-edit/controls-edit/controls-edit.component";
import { SubscribePageComponent } from './pages/subscribe-page/subscribe-page.component';
import { SuccessPaymentPageComponent } from './pages/success-payment-page/success-payment-page.component';
import { WrongPaymentPageComponent } from './pages/wrong-payment-page/wrong-payment-page.component';
import { WrongEmailPageComponent } from './pages/wrong-email-page/wrong-email-page.component';
import { PdfPageComponent } from './pages/pdf-page/pdf-page.component';
import { SecureFormComponent } from './components/secure-form/secure-form.component';
import { PreviewLinkPageComponent } from './pages/preview-link-page/preview-link-page.component';
import { PreviewDataLinkComponent } from './pages/preview-link-page/preview-data-link/preview-data-link.component';
import { ControlNextLinkComponent } from './pages/preview-link-page/preview-data-link/control-next-link/control-next-link.component';
import { SignatureLinkComponent } from './pages/preview-link-page/preview-data-link/signature-link/signature-link.component';
import {FilterAutocompletePipe} from "src/app/pipes/filter-autocomplete.pipe";

@NgModule({
  declarations: [
    AppComponent,
    ChatBotPageComponent,
    MainTemplateComponent,
    HeaderComponent,
    VideoBlockComponent,
    ChatDataComponent,
    MessageComponent,
    ControlsComponent,
    ProgressStatusComponent,
    InputBlockComponent,
    ThanksBlockComponent,
    PreviewPageComponent,
    PreviewDataComponent,
    ControlNextComponent,
    NotFoundPageComponent,
    IfViewportSizeDirective,
    SidebarComponent,
    LoadingWindowComponent,
    MarkdownPipe,
    SortPipe,
    ResetProgressComponent,
    ExplanationBoxComponent,
    FilterPipe,
    FilterAutocompletePipe,
    SignatureComponent,
    ReloadComponent,
    EditChatPageComponent,
    ChatDataEditComponent,
    MessageEditComponent,
    ControlsEditComponent,
    SubscribePageComponent,
    SuccessPaymentPageComponent,
    WrongPaymentPageComponent,
    WrongEmailPageComponent,
    PdfPageComponent,
    SecureFormComponent,
    PreviewLinkPageComponent,
    PreviewDataLinkComponent,
    ControlNextLinkComponent,
    SignatureLinkComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    LayoutModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatIconModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTooltipModule,
    AngularSignaturePadModule,
    MatDialogModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
