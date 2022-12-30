import { Injectable } from '@angular/core';
import {RequestService} from "./request.service";
import {BehaviorSubject, Observable} from "rxjs";
import {ChatDataInterface} from "../interfaces/chat";
import {StrapiDataInterface} from "../interfaces/strapi-data";

@Injectable({
  providedIn: 'root'
})
export class ChatDataService {
  private subject = new BehaviorSubject<ChatDataInterface[]>([]);
  chatData$: Observable<ChatDataInterface[] | []> = this.subject.asObservable();

  constructor(
    private request: RequestService

  ) { }


  async chatDataLoading () {
    await this.request.get('chat-datas?populate=*').subscribe((response: StrapiDataInterface) => {
      const result: any = response.data?.map(val => {
        return {id: val.id, ...val.attributes}
      })?.sort((a,b) => a.step - b.step)

      this.subject.next(result as ChatDataInterface[])
    }, (e: any) => console.log(e))
  }
}
