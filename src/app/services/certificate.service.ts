import { Injectable } from '@angular/core';
import {Rule} from "../models/rule";
import {Observable} from "rxjs/Observable";
import {ApiService} from "./api.service";
import {Certificate} from "../models/certificate";
import {Headers} from "@angular/http";
import {User} from "../models/user";

export interface CertificateUpdate {
  name: string;
  file?: File;
}

@Injectable()
export class CertificateService {
  private certificatesURL = `${this.api.baseURL}/certificates`;

  constructor(private api: ApiService) { }

  createCertificate(certificateUpdate: CertificateUpdate) {
    console.log("certificate update: " + certificateUpdate);
    let formData = new FormData();
    if (certificateUpdate.file) {
      formData.append('zipFile', certificateUpdate.file, certificateUpdate.file.name);
    }
    formData.append('name', certificateUpdate.name);

    let headers = new Headers();

    return this.api.post(this.certificatesURL, formData, { headers: headers })
      .map(res => res.json())
      .toPromise()
      .then(response => response.certificate as Certificate);
  }

  getCertificates(): Observable<Certificate[]> {
    return this.api.get(this.certificatesURL)
      .map(response => response.json().certificates as Certificate[]);
  }

  deleteById(certificateID): Promise<boolean> {
    return this.api
      .delete(`${this.certificatesURL}/${certificateID}`)
      .toPromise()
      .then(response => response.json().success)
  }
}
