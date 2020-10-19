import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {CertificateUpdate} from "../services/certificate.service";

@Component({
  selector: 'app-edit-certificate-dialog',
  templateUrl: './edit-certificate-dialog.component.html',
  styleUrls: ['./edit-certificate-dialog.component.css']
})
export class EditCertificateDialogComponent implements OnInit {
  public onSave: (CertificateUpdate) => void;
  public onCancel: () => void;

  constructor(
    public dialogRef: MatDialogRef<EditCertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.onSave = data.onSave;
    this.onCancel = data.onCancel;
  }

  ngOnInit() {
  }

  onSaveCertificate(certificateUpdate: CertificateUpdate) {
    this.onSave(certificateUpdate);
  }

  onCancelCertificate() {
    this.onCancel();
    this.dialogRef.close();
  }
}
