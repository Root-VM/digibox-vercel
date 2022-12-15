import { Component } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-input-block',
  templateUrl: './input-block.component.html',
  styleUrls: ['./input-block.component.scss']
})
export class InputBlockComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
}
