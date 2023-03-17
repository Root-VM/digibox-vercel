import { Component } from '@angular/core';
import {
  fadeInLeftOnEnterAnimation,
  fadeOutOnLeaveAnimation
} from "angular-animations";
import {MatDialog} from "@angular/material/dialog";
import {ReloadComponent} from "../reload/reload.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({duration: 300}),
    fadeOutOnLeaveAnimation({duration: 300})
  ]
})
export class HeaderComponent {
  showProgress = false;
  showMobileSidebar = false;

  constructor(public dialog: MatDialog) {
  }
  reload () {
    this.dialog.open(ReloadComponent);
  }
}
