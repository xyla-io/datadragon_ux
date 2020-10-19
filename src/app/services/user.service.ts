import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';
import {User} from "../models/user";

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {ApiService} from "./api.service";
import {ApiMessage} from "../models/api-message";

export interface ResetPasswordParameters {
  userID: string,
  token: string,
  password: string,
  confirmedPassword: string,
}

@Injectable()
export class UserService {
  private usersURL = `${this.api.baseURL}/users`;

  constructor(private api: ApiService) {}

  createUser(signUpData): Promise<User> {
    return this.api
      .post(`${this.usersURL}/signup`, JSON.stringify(signUpData))
      .toPromise()
      .then(response => response.json().user as User)
      .catch(this.handleError);
  }

  signInUser(signInData): Promise<User> {
    return this.api
      .post(`${this.usersURL}/signin`, JSON.stringify(signInData))
      .toPromise()
      .then(response => response.json().user as User)
      .catch(this.handleError);
  }

  getCurrentUser(): Promise<User> {
    return this.api
      .get(`${this.usersURL}/session`)
      .toPromise()
      .then(response => response.json().user as User)
      .catch(this.handleError);
  }

  signOut(): Promise<boolean> {
    return this.api
      .delete(`${this.usersURL}/session`)
      .toPromise()
      .then(response => response.json().success)
      .catch(this.handleError);
  }

  forgotPassword(email: string): Promise<ApiMessage> {
    return this.api
      .post(`${this.usersURL}/forgot-password`, { email: email })
      .toPromise()
      .then(response => response.json() as ApiMessage)
      .catch(this.handleError);
  }

  resetPassword(parameters: ResetPasswordParameters): Promise<ApiMessage> {
    return this.api
      .post(`${this.usersURL}/reset-password`, parameters)
      .toPromise()
      .then(response => response.json() as ApiMessage)
      .catch(this.handleError);
  }

  deleteAccount(userID): Promise<boolean> {
    return this.api
      .delete(`${this.usersURL}/${userID}`)
      .toPromise()
      .then(response => response.json().success)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

