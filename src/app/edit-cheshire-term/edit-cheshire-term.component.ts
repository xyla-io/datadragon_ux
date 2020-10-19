import {Component, EventEmitter, HostListener, OnInit, Output, Input} from '@angular/core';
import {CheshireTermReportParameters, CheshireTermsService} from "../services/cheshire-terms.service";
import {CheshireTermsApp} from "../models/cheshire-terms";

@Component({
  selector: 'app-edit-cheshire-term',
  templateUrl: './edit-cheshire-term.component.html',
  styleUrls: ['./edit-cheshire-term.component.css']
})
export class EditCheshireTermComponent implements OnInit {

  public reportParameters: CheshireTermReportParameters = {
    rootTerm: "",
    priorityThreshold: 1000,
    appId: null,
  };

  private apps: CheshireTermsApp[];

  @Input() isSearching: boolean;
  @Output() reportParametersEmitter = new EventEmitter<CheshireTermReportParameters>();
  @Output() stopSearchEmitter = new EventEmitter();

  @HostListener('window:keyup', ['$event'])
  hostKeyUp(event: KeyboardEvent) {
    if (event.key !== 'Enter') { return }
    this.onSearch();
  }

  constructor(private termsService: CheshireTermsService) {
    // this.termsService.observeApps().subscribe(apps => this.apps = apps);
  }

  ngOnInit() {
    this.termsService.refreshApps();
  }

  onSearch() {
    this.reportParametersEmitter.emit(this.reportParameters);
  }

  onCancelSearch() {
    this.stopSearchEmitter.emit();
  }

}
