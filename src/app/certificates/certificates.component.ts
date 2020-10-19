import {Component, OnInit, ViewChild} from '@angular/core';
import {CertificatesListComponent} from "../certificates-list/certificates-list.component";
import {MatDialog, MatDialogRef, MatSnackBar} from "@angular/material";
import {EditCertificateDialogComponent} from "../edit-certificate-dialog/edit-certificate-dialog.component";
import {CertificateService} from "../services/certificate.service";

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {

  @ViewChild(CertificatesListComponent) private certificateListComponent;
  private dialogRef: MatDialogRef<EditCertificateDialogComponent>;

  constructor(
    private certificateService: CertificateService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  onAddCertificate() {
    console.log(history.length);
    this.dialogRef = this.dialog.open(EditCertificateDialogComponent, {
      data: {
        onSave: (certificateUpdate) => {
          this.certificateService.createCertificate(certificateUpdate).then(
            () => {
              this.certificateListComponent.refresh();
              this.snackBar.open("Certificate Uploaded", "", {
                duration: 2000,
              });
              this.dialogRef.close();
            }
          );
        },
        onCancel: this.onCancel
      }
    });
  }

  onCancel() {
  }

  ngOnInit() {
  }
}
