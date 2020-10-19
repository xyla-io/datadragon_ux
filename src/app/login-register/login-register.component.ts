import {Component, OnInit} from '@angular/core';
import {SignUpData} from "../signup/signup.component"
import {SignInData} from "../signin/signin.component";
import {SessionService} from "../services/session.service";
import {UserService} from "../services/user.service";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogType
} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material";

export enum LoginRegisterState {
  SignUp,
  SignIn,
  ForgotPassword,
}

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

  constructor(
    private sessionService: SessionService,
    private userService: UserService,
    private dialog: MatDialog,
  ) { }

  private dialogRef?: MatDialogRef<ConfirmationDialogComponent>;
  public LoginRegisterState = LoginRegisterState;
  private _state: LoginRegisterState = LoginRegisterState.SignUp;
  public get state(): LoginRegisterState {
    return this._state;
  }
  public set state(newState: LoginRegisterState) {
    this._state = newState;
    switch (newState) {
      case LoginRegisterState.ForgotPassword:
        this.showsLoginPasswordField = false;
        break;
      default:
        this.showsLoginPasswordField = true;
        break;
    }
  }
  public showsLoginPasswordField: boolean = true;
  private _selectedTabIndex: number;
  get selectedTabIndex(): number { return this._selectedTabIndex}
  set selectedTabIndex(index: number) {
    this._selectedTabIndex = index;

    switch (index) {
      case 0:
        this.state = LoginRegisterState.SignUp;
        console.log('Sign Up');
        break;
      case 1:
        this.state = LoginRegisterState.SignIn;
        console.log('Sign In');
        break;
    }
  }

  ngOnInit() {
    if (this.sessionService.session.value === null) {
      this.sessionService.checkSession();
    }
  }

  signUp(data: SignUpData) {
    this.sessionService.signUp(data);
  }

  signIn(data: SignInData) {
    if (this.state !== this.LoginRegisterState.SignIn) { return }
    this.sessionService.signIn(data);
  }

  forgotPassword() {
    if (this.state !== LoginRegisterState.SignIn) { return }
    this.state = LoginRegisterState.ForgotPassword;
  }

  resetPassword(email: string) {
    this.userService.forgotPassword(email).then(apiMessage => {
      this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          dialogType: ConfirmationDialogType.Default,
          dialogTitle: apiMessage.title,
          dialogSubtitle: apiMessage.message,
          cancelButtonTitle: 'OK',
          onCancel: () => {
            this.dialogRef.close();
            if (!apiMessage.success) { return }
            this.state = LoginRegisterState.SignIn;
          },
        },
      });
    });

  }

  cancelPasswordReset() {
    if (this.state !== LoginRegisterState.ForgotPassword) { return }
    this.state = LoginRegisterState.SignIn;
  }
}
