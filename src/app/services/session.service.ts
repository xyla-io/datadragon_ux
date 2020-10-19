import { Injectable } from '@angular/core';
import {UserService} from "./user.service";
import 'rxjs/add/observable/of';
import {User} from "../models/user";
import {SignUpData} from "../signup/signup.component";
import {SignInData} from "../signin/signin.component";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Router} from "@angular/router";
import {ApiService} from "./api.service";

@Injectable()
export class SessionService {
  constructor(private userService: UserService, private router: Router, api: ApiService) {
    api.errorResponseSubject.subscribe(response => {
      if (response.status !== 403) { return; }
      this.redirectUrl = this.router.url;
      this.checkSession();
    });
  }

  redirectUrl: string = '/searchads/rules';

  session: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  signUp(data: SignUpData) {
    console.log('Sign up!', data);
    this.userService.createUser(data)
      .then(user => {
        console.log('Created user:', user);
        this.session.next(user);
        this.router.navigate([this.redirectUrl]);
      });
  }

  signIn(data: SignInData) {
    console.log('Sign in!');
    this.userService.signInUser(data)
      .then(user => {
        console.log('Signed in user:', user);
        this.session.next(user);
        this.router.navigate([this.redirectUrl]);
      });
  }

  checkSession() {
    console.log('Check session!');
    this.userService.getCurrentUser()
      .then(user => {
        console.log('Current user:', user);
        this.session.next(user);
        let url = (user === null) ? '/login-register' : this.redirectUrl;
        if (url === this.router.url) { return; }
        this.router.navigate([url]);
      });
  }

  signOut() {
    console.log('Sign out');
    this.userService.signOut()
      .then(suceess => {
        console.log('Signed out:', suceess);
        this.session.next(null);
        this.router.navigate(['/login-register']);
      });
  }

  deleteAccount(userID: string) {
    console.log('Delete account');
    this.userService.deleteAccount(userID)
      .then(suceess => {
        console.log('Deleted account:', suceess);
        this.session.next(null);
        this.router.navigate(['/login-register']);
      });
  }
}
