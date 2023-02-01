import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-progress',
  templateUrl: './reset-progress.component.html',
  styleUrls: ['./reset-progress.component.scss']
})
export class ResetProgressComponent {

  reset () {
    localStorage.clear();
    window.location.href = window.location.origin
  }
}
