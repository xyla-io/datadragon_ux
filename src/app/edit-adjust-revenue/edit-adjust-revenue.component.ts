import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AdjustCredential, AdjustRevenueReportParameters, AdjustService} from "../services/adjust.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-edit-adjust-revenue',
  templateUrl: './edit-adjust-revenue.component.html',
  styleUrls: ['./edit-adjust-revenue.component.css']
})
export class EditAdjustRevenueComponent implements OnInit, OnDestroy {

  public reportParameters: AdjustRevenueReportParameters = {
    credentialID: '',
    period: 'week',
    startDate: new Date(),
  };

  public periodOptions = [{
    label: 'Weekly',
    value: 'week',
  }, {
    label: 'Monthly',
    value: 'month',
  }];

  @Output() reportParametersEmitter = new EventEmitter<AdjustRevenueReportParameters>();
  private credentialsSubscription: Subscription;

  constructor(
    public adjustService: AdjustService,
  ) {
    this.loadCredentials(this.adjustService.credentials);
    this.credentialsSubscription = this.adjustService.credentialsObservable.subscribe(credentials => {
      this.loadCredentials(credentials)
    })
  }

  ngOnInit() {
    if (this.adjustService.credentials.length === 0) {
      this.adjustService.refreshCredentials();
    }
  }

  onCredentialIDChange() {
    let matchingCredentials = this.adjustService.credentials.filter(credential => credential._id === this.reportParameters.credentialID);
    if (matchingCredentials.length === 0 || !matchingCredentials[0].lastRevenueReportDate) { return }
    this.reportParameters.startDate = matchingCredentials[0].lastRevenueReportDate;
  }

  onRunReportClicked() {
    this.reportParametersEmitter.emit(this.reportParameters);
  }

  ngOnDestroy() {
    this.credentialsSubscription.unsubscribe();
  }

  private loadCredentials(credentials: AdjustCredential[]) {
    if (credentials.map(credential => credential._id).indexOf(this.reportParameters.credentialID) !== -1) { return }
    this.reportParameters.credentialID = (credentials.length === 0) ? '' : credentials[0]._id;
    this.onCredentialIDChange();
  }
}
