import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.css']
})
export class SSOComponent implements OnInit, OnDestroy {
  message: string;
  email: string;
  subs: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.subs = this.route.queryParamMap.subscribe(params => {
      const routeHome = () => this.router.navigate(['/']);
      const data = params.get('data');
      if (!data) { return routeHome() }
      const signature = params.get('signature');
      if (!signature) { return routeHome() }
      const { email } = JSON.parse(data);
      if (!email) { return routeHome() }
      this.message = `Logging in as ${email}`;
      this.api.get(`${this.api.baseURL}/sso`, {
        params: {
          data: data,
          signature,
          apiKey: environment.apiKey,
        }
      }).toPromise().then(response => {
        console.log(response);
        this.router.navigate(['searchads', 'rules'])
      }).catch(error => {
        console.log(error);
        this.message = `Unable to login as ${email}`;
      });
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
