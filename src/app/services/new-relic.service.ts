import {Inject, Injectable} from '@angular/core';
import {Router, NavigationEnd, NavigationStart} from "@angular/router";

interface NewRelic {
  addPageAction($name: string, $attributes: object);
}
declare global {
  var newrelic: NewRelic;
}

@Injectable()
export class NewRelicService {

  constructor(
    @Inject("NewRelicLibrary") public newrelic: NewRelic,
    private router: Router
  ) {

    var navigationStartURL: string = null;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        navigationStartURL = this.router.routerState.snapshot.url;
      } else if (event instanceof NavigationEnd) {
        let attributes = {
          startURL: navigationStartURL,
          endURL: event.url,
        };
        navigationStartURL = null;
        this.newrelic.addPageAction('routeChange', attributes);
      }
    });
  }

}

export function NewRelicLibraryFactory() {
  return newrelic;
}
