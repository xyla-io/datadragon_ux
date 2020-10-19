import {Component, EventEmitter, OnInit, Output, HostListener, Input} from '@angular/core';

export interface SignInData {
  email: String,
  password: String,
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor() { }

  hidePassword = true;

  signInData: SignInData = {
    email: "",
    password: "",
  };

  @Input() showsPasswordField: boolean;
  @Output() signInEmitter = new EventEmitter<SignInData>();

  @HostListener('window:keyup', ['$event'])
  hostKeyUp(event: KeyboardEvent) {
    if (event.key !== 'Enter') { return }
    this.signInEmitter.emit(this.signInData);
  }

  ngOnInit() {
  }
}
