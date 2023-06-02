import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {CustomerProgressInterface} from "../interfaces/customer";
import {loadFromStore, saveToStore} from "../methods/locale-store";
import {chatSort} from "../methods/chat-soring";
import {RequestService} from "./request.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private subject = new BehaviorSubject<CustomerProgressInterface[]>([]);
  customerProgress$: Observable<CustomerProgressInterface[] | []> = this.subject.asObservable();

  constructor(private request: RequestService, private http: HttpClient) {
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

  removeUserProgress (id: number | undefined) {
    let result = this.getProgress();

    if(id) {
      result = result.filter((item) =>
        item.id !== id || (item.type !== 'user' && item.type !== 'user-q'))

      // sort
      result = chatSort(result);

      this.subject.next(result);
      saveToStore('customer_progress', result);
    }
  }

  removeUserProgressByStep (step: number | undefined) {
    let result = this.getProgress();

    if(step) {
      result = result.filter((item) =>
        item.step !== step || (item.type !== 'user' && item.type !== 'user-q'))

      // sort
      result = chatSort(result);
      this.subject.next(result);
      saveToStore('customer_progress', result);
    }
  }

  getProgress () {
    return this.subject.getValue();
  }

  sendEmailApi( data: any): any {
    return this.request.post(`customers/email`, data)
  }

  async postUnfinishedCustomerApi(email: string, data: any) {
    console.log(10, email, data)
    if(email) {
      this.request.get(`customers?filters[email][$eq]=${email}`).subscribe(async (users: any) => {
        if(users?.data?.length) {
          console.log(1, users)
          const user = users.data[0];
          this.request.put(`customers/${user.id}`,  {...data} ).subscribe()
        } else {
          console.log(2, users)
          this.request.postApi(`customers`,  {...data} ).subscribe()
        }

      })
    }
  }

  publishCustomerApi( data: any): any {
    return this.request.post(`customers/publish`, data)
  }

  async checkPaymentDataApi(email: string) {
    return await this.request.getClear(`strapi-stripe/getSubscriptionStatus/${email}`);
  }


  async loadPdf(email: string, secret: string) {
    try {
     return  await this.request.getClear(`api/customers?filters[email][$eq]=${email}&filters[secret][$eq]=${secret}&populate=*`);
    } catch {
      return null;
    }
  }
  async getCustomerByEmail(email: string) {
    try {
      return  await this.request.getClear(`api/customers?filters[email][$eq]=${email}`);
    } catch {
      return null;
    }
  }

  async fetchPdfFile(src: string) {
    const res = await fetch(src, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });

    if (res.status === 200) {
      return res.blob();
    }
    return;
  }
}
