import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { SnapchatCredential, EditSnapchatCredential } from '../models/credential';

@Component({
  selector: 'app-edit-snapchat-credential',
  templateUrl: './edit-snapchat-credential.component.html',
  styleUrls: ['./edit-snapchat-credential.component.css']
})
export class EditSnapchatCredentialComponent implements OnInit {

  public credential: EditSnapchatCredential = new EditSnapchatCredential();
  @Output() credentialEmitter = new EventEmitter<SnapchatCredential>();

  constructor() {}

  ngOnInit() {
  }

  onUploadCredential() {
    this.credentialEmitter.emit(this.credential);
    this.credential = new EditSnapchatCredential();
  }
}
