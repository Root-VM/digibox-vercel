import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() showVideoBlock= false;
  @Input() showInputBlock= false;
  @Input() showThanksBlock= false;
  @Input() showHeader = true;
}
