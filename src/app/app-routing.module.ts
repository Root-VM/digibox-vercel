import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatBotPageComponent} from "./pages/chat-bot-page/chat-bot-page.component";
import {PreviewPageComponent} from "./pages/preview-page/preview-page.component";
import {NotFoundPageComponent} from "./pages/not-found-page/not-found-page.component";

const routes: Routes = [
  { path: 'chat-bot', component: ChatBotPageComponent },
  { path: 'preview', component: PreviewPageComponent },
  { path: '404', component: NotFoundPageComponent },

  { path: '', redirectTo: '/chat-bot', pathMatch: 'full'},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
