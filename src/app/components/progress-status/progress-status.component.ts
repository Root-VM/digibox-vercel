import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProgressType} from "./progress-type";
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import {ChatDataService} from "../../services/chat-data.service";
import {ActivatedRoute} from "@angular/router";
import {ChatDataInterface} from "../../interfaces/chat";

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
  content: ChatDataInterface[] | []= [];

  constructor(private chatDataService: ChatDataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.chatDataService.chatData$.subscribe(async val => {
      this.content = val;
    });

    this.route.queryParams.subscribe(() => {
      this.generateProgress();
    });
  }

  hide () {
    this.onHide.emit();
  }

  generateProgress() {
    if(this.content.length) {

      const progress_query = Number(this.route.snapshot.queryParams?.['progress']);

      function getType(id: number) {
        if(progress_query === id) {return 'current';}
        if(progress_query > id) {return 'checked';}
        if(progress_query < id) {return 'new';}

        return 'new'
      }

      if( progress_query) {
        this.data = this.content.filter(el => el.title).map((el, i) => {
          return {
            text: (i ? i + '. ': '') + el.title,
            type: getType(el.id)
          }
        })
        // console.log(1, val)
        // this.data = val;
        // this.commonService.setLoading(false);
      }
    } else {
        setTimeout(() => this.generateProgress(), 1000)
    }
  }
}
