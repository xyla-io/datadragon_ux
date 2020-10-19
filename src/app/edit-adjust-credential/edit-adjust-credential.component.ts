import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AdjustCredential, AdjustService} from "../services/adjust.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-edit-adjust-credential',
  templateUrl: './edit-adjust-credential.component.html',
  styleUrls: ['./edit-adjust-credential.component.css']
})
export class EditAdjustCredentialComponent implements OnInit {

  public credential: AdjustCredential = new AdjustCredential();

  @Output() credentialEmitter = new EventEmitter<AdjustCredential>();

  constructor(
  ) { }

  ngOnInit() {
  }

  onUploadCredential() {
    this.credentialEmitter.emit(this.credential);
    this.credential = new AdjustCredential();
  }

}
