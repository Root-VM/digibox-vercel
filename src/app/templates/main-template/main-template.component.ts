import {Component, Input, OnInit} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss']
})
export class MainTemplateComponent{
  @Input() showVideoBlock= false;
  @Input() showInputBlock= false;
  @Input() showThanksBlock= false;
  @Input() showHeader = true;
  isMobile = this.breakpointObserver.isMatched('(max-width: 1200)');

  constructor(public breakpointObserver: BreakpointObserver) {}


}
