import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AnswerInterface, ChatDataInterface} from "../../../../interfaces/chat";
import {progressUrlDecode} from "../../../../methods/progress-url-decode";

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit, OnDestroy {
  @Input() data: ChatDataInterface[] | [] = [];
  currentId: number | undefined = undefined;
  paramsSubscription : Subscription = new Subscription();

  controls: AnswerInterface[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.route.queryParams.subscribe(() => this.generateControls());
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  generateControls() {
    if(this.data.length) {
      const progress_query = this.route.snapshot.queryParams?.['progress'];
      const decode = progressUrlDecode(progress_query);

      if(progress_query && decode?.length) {
        const val = decode[decode.length - 1];
        const bot_el = this.data.find(el => el.id === val.bot);
        const user_el = bot_el?.answers.find(el => el.id === val.user);
        const next_bot_el_id = user_el && user_el.next_step?.data?.id;
        let next_bot_el;

        if(next_bot_el_id) {
          next_bot_el = this.data.find(el => el.id === next_bot_el_id);
        }

        if(next_bot_el) {
          this.currentId = next_bot_el?.id;
          this.controls = next_bot_el?.answers ? next_bot_el?.answers : [];
        } else {
          this.currentId = bot_el?.id;
          this.controls = bot_el?.answers ? bot_el?.answers : [];
        }

      } else {
        const init_message = this.data?.find(value => value.bot_default_message);
        this.currentId = init_message?.id;
        this.controls = init_message?.answers ? init_message?.answers : [];
      }
    }
  }

  async onSelect( answer_id: number) {
    const current_progress = this.route.snapshot.queryParams?.['progress'];
    const selected = `${this.currentId}:${answer_id}_`

    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        progress: current_progress ? current_progress + selected : selected
      },
      queryParamsHandling: 'merge'
    });
  }

  isControlDisabled(id: number) {
    const progress_query = this.route.snapshot.queryParams?.['progress'];
    const decode = progressUrlDecode(progress_query);

    if(decode?.length) {
      return  !!decode.find(el => el.id === this.currentId + ':' + id);
    }
    return false;
  }

  isControlGroupDisabled(type: 'outlined-button-item' | 'dropdown-item') {
    const progress_query = this.route.snapshot.queryParams?.['progress'];
    const decode = progressUrlDecode(progress_query);
    const elements = this.controls.filter(el => el.control_type === type);
    let disable = false;

    if(decode?.length && elements.length) {
      elements.map(el => {
        const res = decode.find(d => d.id === this.currentId + ':' + el.id)

        if(!!res) {
          disable = true;
        }
      })
    }

    return disable;
  }

  filterByType(data: AnswerInterface[], type: 'button-next' | 'outlined-button-item' | 'dropdown-item' | 'circle' | 'input') {
    return data.filter(el => el.control_type === type)
  }

  onDropdownChange(e: number) {
    console.log(e);
  }
}
