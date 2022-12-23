import {Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";

type Size = 'mobile' | 'bigger_than_mobile' | 'laptop' | 'desktop';

const config = {
  mobile: ['(min-width: 0px) and (max-width: 979px)'],
  bigger_than_mobile: ['(min-width: 980px)'],
  laptop: ['(min-width: 979px) and (max-width: 1349px)'],
  desktop: ['(min-width: 1350px)'],
};

@Directive({
  selector: "[ifViewportSize]"
})
export class IfViewportSizeDirective implements OnDestroy {
  private subscription = new Subscription();

  @Input("ifViewportSize") set size(value: Size) {
    this.subscription.unsubscribe();
    this.subscription = this.observer
      .observe(config[value])
      .subscribe(this.updateView);
  }

  constructor(
    private observer: BreakpointObserver,
    private vcRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  updateView = ({matches}: BreakpointState) => {
    if (matches && !this.vcRef.length) {
      this.vcRef.createEmbeddedView(this.templateRef);
    } else if (!matches && this.vcRef.length) {
      this.vcRef.clear();
    }
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
