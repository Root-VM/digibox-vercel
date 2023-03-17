import {Component, Input} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SignatureComponent} from "../signature/signature.component";

@Component({
  selector: 'app-control-next',
  templateUrl: './control-next.component.html',
  styleUrls: ['./control-next.component.scss']
})
export class ControlNextComponent{
  @Input() email = '';
  @Input() fullName = '';
  @Input() address = '';

  constructor(public dialog: MatDialog) {}

  openModal() {
    this.dialog.open(SignatureComponent, {
      data: {email: this.email, fullName: this.fullName, address: this.address}
    });
  }
}
