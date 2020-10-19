import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {SocketService} from "./socket.service";

@Injectable()
export class MobileactionService {

  constructor(private socketService: SocketService) {
  }

  getAppDetails(adamId: string): Promise<any> {
    return this.socketService.get('/mobileaction/app/details', { adamId: adamId});
  }

}
