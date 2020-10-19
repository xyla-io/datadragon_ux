import { Component, OnInit } from '@angular/core';
import { CredentialService } from '../services/credential.service';
import { MatSnackBar } from '@angular/material';
import { SnapchatCredential } from '../models/credential';

@Component({
  selector: 'app-snapchat-credentials',
  templateUrl: './snapchat-credentials.component.html',
  styleUrls: ['./snapchat-credentials.component.css']
})
export class SnapchatCredentialsComponent implements OnInit {

  constructor(
    private credentialService: CredentialService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  onCreateCredential(credential: SnapchatCredential) {
    console.log(credential);
    this.credentialService.createCredential(credential)
      .then(() => {
        this.credentialService.refreshCredentials();
        this.snackBar.open("Credential Added", "", {
          duration: 2000,
        });
      });
  }
}
