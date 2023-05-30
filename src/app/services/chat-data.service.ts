import { Injectable } from '@angular/core';
import {RequestService} from "./request.service";
import {BehaviorSubject, Observable} from "rxjs";
import {ChatDataInterface, MessageExplanationInterface, ProgressInterface} from "../interfaces/chat";
import {StrapiDataInterface} from "../interfaces/strapi-data";
import {chatSort} from "../methods/chat-soring";
import {mappedStrapiData} from "../methods/get-strapi-data";
import {loadFromStore, saveToStore} from "../methods/locale-store";

@Injectable({
  providedIn: 'root'
})
export class ChatDataService {
  private chat = new BehaviorSubject<ChatDataInterface[]>([]);
  chatData$: Observable<ChatDataInterface[] | []> = this.chat.asObservable();

  private explanation = new BehaviorSubject<MessageExplanationInterface[]>([]);
  explanationData$: Observable<MessageExplanationInterface[] | []> = this.explanation.asObservable();

  private progress = new BehaviorSubject<ProgressInterface[]>([]);
  progressData$: Observable<ProgressInterface[] | []> = this.progress.asObservable();

  constructor(
    private request: RequestService
  ) {
    const chat = loadFromStore('chat_data');
    chat && this.chat.next(chat);

    const explanation = loadFromStore('explanation_data');
    explanation && this.explanation.next(explanation);

    const progress = loadFromStore('progress_data');
    progress && this.progress.next(progress);
  }

  addExplanation = (value: MessageExplanationInterface) => {
    const value_exist = this.explanation.value.find(val => val.text === value.text);
    if (!value_exist) {
      this.explanation.next([...this.explanation.value, value]);
      saveToStore('explanation_data', [...this.explanation.value, value]);
    }
  }

  clearExplanations = () => {
    this.explanation.next([]);
    saveToStore('explanation_data', []);
  }

  async getChatData () {
    await this.request.get('chat-datas?populate=*').subscribe((response: StrapiDataInterface) => {
      let result: any = [];

      if(response?.data?.length) {
        result = mappedStrapiData(response.data);
        result = chatSort(result);
      }

      this.chat.next(result as ChatDataInterface[]);
      saveToStore('chat_data', result);

    }, (e: any) => console.log(e))
  }

  async getGroupMessages () {
    await this.request.get('group-of-messages?populate=*').subscribe((response: StrapiDataInterface) => {
      let result: any = [];

      if(response?.data?.length) {
        result = mappedStrapiData(response.data);

        if(result.length) {
          result = result.map((val: any) => {
            if(val?.chat_data?.data) {
              return {...val, chat_data: mappedStrapiData(val.chat_data.data)}
            }

            return {...val}
          })
        }

        if(result?.length) {
          this.progress.next(result);
          saveToStore('progress_data', result);
        }
      }

    }, (e: any) => console.log(e))
  }
}

