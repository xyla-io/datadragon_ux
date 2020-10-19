import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CertificateUpdate} from "../services/certificate.service";

@Component({
  selector: 'app-edit-certificate',
  templateUrl: './edit-certificate.component.html',
  styleUrls: ['./edit-certificate.component.css']
})
export class EditCertificateComponent implements OnInit {

  @Output() cancelCertificateEmitter = new EventEmitter();
  @Output() saveCertificateEmitter = new EventEmitter<CertificateUpdate>();
  @ViewChild('certificateFileInput') certificateFileInput: ElementRef;

  public certificateUpdate: CertificateUpdate = {
    name: '',
    file: null
  };

  constructor() { }

  ngOnInit() {
  }

  addCertificate() {
    this.certificateFileInput.nativeElement.click()
  }

  certificateFileChange(event) {
    let fileList: FileList = event.target.files;

    if (!fileList.length) { return; }
    this.certificateUpdate.file = fileList[0];
    event.target.value = null;
  }

  save() {
    this.saveCertificateEmitter.emit(this.certificateUpdate);
  }

  cancel() {
    this.cancelCertificateEmitter.emit();
  }
}
