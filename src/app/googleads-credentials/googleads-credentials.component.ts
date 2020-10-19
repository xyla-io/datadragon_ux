import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from "@angular/material";
import { CredentialService } from '../services/credential.service';
import { GoogleAdsCredential } from '../models/credential';

@Component({
  selector: 'app-googleads-credentials',
  templateUrl: './googleads-credentials.component.html',
  styleUrls: ['./googleads-credentials.component.css']
})
export class GoogleadsCredentialsComponent implements OnInit {

  constructor(
    private credentialService: CredentialService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  onCreateCredential(credential: GoogleAdsCredential) {
    this.credentialService.createCredential(credential)
      .then(() => {
        this.credentialService.refreshCredentials();
        this.snackBar.open("Credential Added", "", {
          duration: 2000,
        });
      });
  }

}
