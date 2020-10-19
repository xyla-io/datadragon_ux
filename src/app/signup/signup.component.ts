import { Component, OnInit } from '@angular/core';

export interface SignUpData {
  name: String,
  email: String,
  password: String,
  confirmedPassword: String
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor() { }

  hidePassword = true;
  hideConfirmedPassword = true;

  signupData: SignUpData = {
    name: "",
    email: "",
    password: "",
    confirmedPassword: ""
  };

  ngOnInit() {
  }
}
