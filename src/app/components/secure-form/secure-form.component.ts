import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-secure-form',
  templateUrl: './secure-form.component.html',
  styleUrls: ['./secure-form.component.scss'],
})
export class SecureFormComponent {
  constructor(
    public dialogRef: MatDialogRef<SecureFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {password: string},
  ) {}
}
