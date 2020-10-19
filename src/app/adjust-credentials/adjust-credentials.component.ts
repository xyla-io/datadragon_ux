import { Component, OnInit } from '@angular/core';
import {AdjustCredential, AdjustService} from "../services/adjust.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-adjust-credentials',
  templateUrl: './adjust-credentials.component.html',
  styleUrls: ['./adjust-credentials.component.css']
})
export class AdjustCredentialsComponent implements OnInit {

  constructor(
    private adjustService: AdjustService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  onCreateCredential(credential: AdjustCredential) {
    this.adjustService.createCredential(credential)
      .then(() => {
        this.adjustService.refreshCredentials();
        this.snackBar.open("Credential Added", "", {
          duration: 2000,
        });
      });
  }
}
