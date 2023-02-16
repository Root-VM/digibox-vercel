import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {CustomerProgressInterface} from "../interfaces/customer";
import {loadFromStore, saveToStore} from "../methods/locale-store";
import {chatSort} from "../methods/chat-soring";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private subject = new BehaviorSubject<CustomerProgressInterface[]>([]);
  customerProgress$: Observable<CustomerProgressInterface[] | []> = this.subject.asObservable();

  constructor() {
    const saved = loadFromStore('customer_progress');
    saved && this.subject.next(saved)
  }

  setProgress(data: CustomerProgressInterface) {
    const current = this.getProgress();

    // set progress
    let result = [...[...current, data]
      .reduce((a,c) => {
        a.set(c.id + ':' + c.type + (c?.is_multiple ? ':' + c.answer_id : ''), c);
        return a;
        }, new Map()).values()];

    // remove in multiple on same
    if(data?.is_multiple) {
      const have_before = current.find(el => el.id + ':' + el.type + ':' + el.answer_id === data.id + ':' + data.type + ':' + data.answer_id)
      if(have_before) {
        result = result.filter(el => el.id + ':' + el.type + ':' + el.answer_id !== data.id + ':' + data.type + ':' + data.answer_id)
      }
    }

    // sort
    result = chatSort(result);

    this.subject.next(result);
    saveToStore('customer_progress', result);
  }

  getProgress () {
    return this.subject.getValue();
  }
}
