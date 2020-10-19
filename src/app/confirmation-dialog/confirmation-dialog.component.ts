import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export enum ConfirmationDialogType {
  Default,
  Destructive
}

export interface ConfirmationDialogOptions {
  dialogType: ConfirmationDialogType;
  dialogTitle?: string;
  dialogSubtitle?: string;
  actionButtonTitle?: string;
  cancelButtonTitle?: string;
  onCancel?: () => void;
  onAction?: () => void;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  public ConfirmationDialogType = ConfirmationDialogType;
  public dialogType: ConfirmationDialogType = ConfirmationDialogType.Default;

  public dialogTitle = "";
  public dialogSubtitle = "";
  private cancelButtonTitle = "";
  public actionButtonTitle = "";

  private onCancel: () => void;
  private onAction: () => void;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => {
      this.cancelClicked()
    });
    this.dialogType = data.dialogType;
    this.dialogTitle = data.dialogTitle;
    this.dialogSubtitle = data.dialogSubtitle;
    this.actionButtonTitle = data.actionButtonTitle;
    this.cancelButtonTitle = data.cancelButtonTitle ? data.cancelButtonTitle : "Cancel";
    this.onCancel = data.onCancel;
    this.onAction = data.onAction;
  }

  ngOnInit() {
  }

  cancelClicked() {
    if (this.onCancel) {
      this.onCancel();
    }
    this.dialogRef.close();
  }

  primaryClicked() {
    if (this.onAction) {
      this.onAction();
    }
    this.dialogRef.close();
  }
}
