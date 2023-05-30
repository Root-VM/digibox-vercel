import {Component, Input} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SignatureLinkComponent} from "../signature-link/signature-link.component";

@Component({
  selector: 'app-control-next-link',
  templateUrl: './control-next-link.component.html',
  styleUrls: ['./control-next-link.component.scss']
})
export class ControlNextLinkComponent {
  @Input() email = '';
  @Input() fullName = '';
  @Input() address = '';

  constructor(public dialog: MatDialog) {}

  openModal() {
    this.dialog.open(SignatureLinkComponent, {
      data: {email: this.email, fullName: this.fullName, address: this.address}
    });
  }
}
