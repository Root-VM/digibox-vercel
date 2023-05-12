import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatBotPageComponent} from "./pages/chat-bot-page/chat-bot-page.component";
import {PreviewPageComponent} from "./pages/preview-page/preview-page.component";
import {NotFoundPageComponent} from "./pages/not-found-page/not-found-page.component";
import {SuccessPageComponent} from "./pages/success-page/success-page.component";
import {EditChatPageComponent} from "./pages/edit-chat-page/edit-chat-page.component";

const routes: Routes = [
  { path: 'chat-bot', component: ChatBotPageComponent },
  { path: 'chat-edit', component: EditChatPageComponent },
  { path: 'preview', component: PreviewPageComponent },
  { path: '404', component: NotFoundPageComponent },
  { path: 'success', component: SuccessPageComponent },

  { path: '', redirectTo: '/chat-bot', pathMatch: 'full'},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
