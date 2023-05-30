import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatBotPageComponent} from "./pages/chat-bot-page/chat-bot-page.component";
import {PreviewPageComponent} from "./pages/preview-page/preview-page.component";
import {NotFoundPageComponent} from "./pages/not-found-page/not-found-page.component";
import {EditChatPageComponent} from "./pages/edit-chat-page/edit-chat-page.component";
import {SubscribePageComponent} from "./pages/subscribe-page/subscribe-page.component";
import {WrongPaymentPageComponent} from "./pages/wrong-payment-page/wrong-payment-page.component";
import {SuccessPaymentPageComponent} from "./pages/success-payment-page/success-payment-page.component";
import {WrongEmailPageComponent} from "./pages/wrong-email-page/wrong-email-page.component";
import {PdfPageComponent} from "./pages/pdf-page/pdf-page.component";
import {PreviewLinkPageComponent} from "./pages/preview-link-page/preview-link-page.component";

const routes: Routes = [
  { path: 'chat-bot', component: ChatBotPageComponent },
  { path: 'chat-edit', component: EditChatPageComponent },
  { path: 'preview', component: PreviewPageComponent },
  { path: 'customer-edit', component: PreviewLinkPageComponent },
  { path: '404', component: NotFoundPageComponent },
  { path: 'subscribe', component: SubscribePageComponent },
  { path: 'success-payment', component: SuccessPaymentPageComponent },
  { path: 'wrong-payment', component: WrongPaymentPageComponent },
  { path: 'wrong-email', component: WrongEmailPageComponent },
  { path: 'pdf', component: PdfPageComponent },

  { path: '', redirectTo: '/chat-bot', pathMatch: 'full'},
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
