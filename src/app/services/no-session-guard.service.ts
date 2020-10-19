import { Injectable } from '@angular/core';
import {CanActivate, Router,  ActivatedRouteSnapshot,  RouterStateSnapshot} from '@angular/router';
import {SessionService} from "./session.service";

@Injectable()
export class NoSessionGuardService implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkSession(url);
  }

  checkSession(url: string): boolean {
    if (this.sessionService.session.value === null) { return true; }

    return false;
  }
}
