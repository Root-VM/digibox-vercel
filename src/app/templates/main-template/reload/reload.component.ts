import { Component } from '@angular/core';

@Component({
  selector: 'app-reload',
  templateUrl: './reload.component.html',
  styleUrls: ['./reload.component.scss']
})
export class ReloadComponent {

  reload() {
    localStorage.clear();
    window.location.href = window.location.origin
  }
}
