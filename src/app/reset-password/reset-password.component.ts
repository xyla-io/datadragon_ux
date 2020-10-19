import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material";
import {
  ConfirmationDialogComponent, ConfirmationDialogOptions,
  ConfirmationDialogType
} from "../confirmation-dialog/confirmation-dialog.component";
import {ResetPasswordParameters, UserService} from "../services/user.service";
import {SessionService} from "../services/session.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private userService: UserService,
    private sessionService: SessionService,
  ) { }

  public hidePassword = true;
  public hideConfirmedPassword = true;
  public resetPasswordData: ResetPasswordParameters = {
    userID: '',
    token: '',
    password: '',
    confirmedPassword: '',
  };

  ngOnInit() {
    this.resetPasswordData.userID = this.route.snapshot.paramMap.get('id');
    this.resetPasswordData.token = this.route.snapshot.paramMap.get('token');
    this.userService.getCurrentUser()
      .then(user => {
        if (user) {
          this.sessionService.checkSession();
        }
      });
  }

  onResetPassword() {
    this.userService.resetPassword(this.resetPasswordData).then(apiMessage => {
      let dialogOptions: ConfirmationDialogOptions = {
        dialogType: ConfirmationDialogType.Default,
        dialogTitle: apiMessage.title,
        dialogSubtitle: apiMessage.message,
        cancelButtonTitle: 'OK',
        onCancel: () => {
          this.finish();
        },
      };
      this.dialog.open(ConfirmationDialogComponent, { data: dialogOptions });
    });
  }

  finish() {
    this.router.navigate(['/login-register']);
  }

}
