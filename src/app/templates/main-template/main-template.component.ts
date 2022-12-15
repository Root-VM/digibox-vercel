import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss']
})
export class MainTemplateComponent {
  @Input() showVideoBlock= false;
  @Input() showInputBlock= false;
  @Input() showThanksBlock= false;
  @Input() showHeader = true;

}
