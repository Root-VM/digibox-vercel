import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  apiUrl = environment.API_URL;
  apiKey = environment.API_KEY;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    }),
  };

  constructor(
    private _http: HttpClient
  ) { }

  get(url: string): any {
      return this._http.get(`${this.apiUrl}api/${url}`, this.httpOptions);
  }

  post(url: string, body: any): any {
    return this._http.post(`${this.apiUrl}api/${url}`, {...this.httpOptions, content: body});
  }
  postApi(url: string, body: any): any {
    return this._http.post(`${this.apiUrl}api/${url}`, {data: body}, this.httpOptions);
  }
  put(url: string, body: any): any {
    return this._http.put(`${this.apiUrl}api/${url}`, {data: body}, this.httpOptions);
  }
}
