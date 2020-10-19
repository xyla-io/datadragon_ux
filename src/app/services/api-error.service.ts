import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {ApiError, isApiError} from "../models/api-error";
import {SocketService} from "./socket.service";

@Injectable()
export class ApiErrorService {

  constructor(api: ApiService, socketService: SocketService) {
    api.errorResponseSubject.subscribe(response => {
      let error = response.json();
      console.log(error);
      if (isApiError(error)) {
        this.presentError(error);
      }
    });

    socketService
      .observeEvent('apiError')
      .map(error => {
        console.log(error);
        return error as ApiError;
      })
      .subscribe(error => this.presentError(error));
  }

  presentError(error: ApiError) {
    alert(error.message);
  }
}
