import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { GoogleAdsCredential, EditGoogleAdsCredential } from '../models/credential';

@Component({
  selector: 'app-edit-googleads-credential',
  templateUrl: './edit-googleads-credential.component.html',
  styleUrls: ['./edit-googleads-credential.component.css']
})
export class EditGoogleadsCredentialComponent implements OnInit {

  public credential: EditGoogleAdsCredential = new EditGoogleAdsCredential();

  @Output() credentialEmitter = new EventEmitter<GoogleAdsCredential>();

  constructor(
  ) { }

  ngOnInit() {
  }

  onUploadCredential() {
    this.credentialEmitter.emit(this.credential);
    this.credential = new EditGoogleAdsCredential();
  }
}
