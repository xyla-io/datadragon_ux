import { Injectable } from '@angular/core';
import {XHRBackend, Http, RequestOptions, Headers, ResponseType, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Response} from "@angular/http/src/static_response";
import {RequestOptionsArgs} from "@angular/http/src/interfaces";
import {Request} from "@angular/http/src/static_request";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Subject} from "rxjs/Subject";
import { environment } from './../../environments/environment';

@Injectable()
export class ApiService extends Http {

  public baseURL: string;
  public errorResponseSubject: Subject<Response>;

  constructor(backend: XHRBackend, defaultOptions: RequestOptions) {
    if (defaultOptions.headers === null) {
      defaultOptions.headers = new Headers();
    }
    defaultOptions.headers.append('Content-Type', 'application/json');
    defaultOptions.withCredentials = true;
    if (environment.apiKey !== null) {
      defaultOptions.params = new URLSearchParams(`apikey=${environment.apiKey}`);
    }
    super(backend, defaultOptions);
    this.baseURL = environment.apiURL;
    this.errorResponseSubject = new Subject<Response>();
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options).
    catch(error => {
      if (error.json !== undefined) {
        this.errorResponseSubject.next(error);
      }
      return Observable.throw(error);
    });
  }
}

export function ApiServiceFactory(backend: XHRBackend, options: RequestOptions) {
  return new ApiService(backend, options);
}
