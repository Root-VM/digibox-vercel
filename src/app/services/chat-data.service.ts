import { Injectable } from '@angular/core';
import {RequestService} from "./request.service";
import {BehaviorSubject, Observable} from "rxjs";
import {ChatDataInterface, MessageExplanationInterface} from "../interfaces/chat";
import {StrapiDataInterface} from "../interfaces/strapi-data";
import {chatSort} from "../methods/chat-soring";

@Injectable({
  providedIn: 'root'
})
export class ChatDataService {
  private chat = new BehaviorSubject<ChatDataInterface[]>([]);
  chatData$: Observable<ChatDataInterface[] | []> = this.chat.asObservable();

  private explanation = new BehaviorSubject<MessageExplanationInterface[]>([]);
  explanationData$: Observable<MessageExplanationInterface[] | []> = this.explanation.asObservable();

  constructor(
    private request: RequestService

  ) { }

  addExplanation = (value: MessageExplanationInterface) => {
    const value_exist = this.explanation.value.find(val => val.text === value.text);
    !value_exist && this.explanation.next([...this.explanation.value, value]);
  }

  clearExplanations = () => {
    this.explanation.next([]);
  }

  async getChatData () {
    await this.request.get('chat-datas?populate=*').subscribe((response: StrapiDataInterface) => {
      let result: any = [];

      if(response?.data?.length) {
        result = response.data?.map(val => {
          return {id: val.id, ...val.attributes}
        });

        result = chatSort(result)
      }

      this.chat.next(result as ChatDataInterface[])
    }, (e: any) => console.log(e))
  }
}
