import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProgressType} from "./progress-type";
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import {ChatDataService} from "../../services/chat-data.service";
import {ActivatedRoute} from "@angular/router";
import {ProgressInterface} from "../../interfaces/chat";

@Component({
  selector: 'app-progress-status',
  templateUrl: './progress-status.component.html',
  styleUrls: ['./progress-status.component.scss'],
  animations: [
    fadeInOnEnterAnimation({duration: 300}),
    fadeOutOnLeaveAnimation({duration: 300})
  ]
})
export class ProgressStatusComponent implements OnInit{
  @Input() show = true;
  @Output() onHide = new EventEmitter();
  data: Array<ProgressType> = [];
  content: ProgressInterface[] | []= [];

  constructor(private chatDataService: ChatDataService, private route: ActivatedRoute) {}

  async ngOnInit() {
    await this.chatDataService.getGroupMessages();

    this.chatDataService.progressData$.subscribe( val => this.content = val);
    this.route.queryParams.subscribe(() => this.generateProgress());
  }

  hide () {
    this.onHide.emit();
  }

  generateProgress() {
    if(this.content.length) {

      const progress_query = Number(this.route.snapshot.queryParams?.['progress']);
      const step_query = Number(this.route.snapshot.queryParams?.['step']);

      function getType(arr: Array<{id: number, step: number}>): 'completed' | 'checked' | 'current' | 'new'  {
        const have_progress = arr.find(el => el.step === step_query);

        if(!!have_progress) {return 'current';}
        if(arr[0].step < step_query) {return 'checked';}
        if(arr[0].step > step_query) {return 'new';}

        return 'new'
      }

      if( progress_query) {
        this.data = this.content.map(el => {
          return {
            text: el.title,
            type: getType(el.chat_data)
          }
        })
      }
    } else {
        setTimeout(() => this.generateProgress(), 1000)
    }
  }
}
