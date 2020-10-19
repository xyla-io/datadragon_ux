import {Component, OnInit, ViewChild} from '@angular/core';
import {CheshireTermReportParameters, CheshireTermsService} from "../services/cheshire-terms.service";
import {SocketService} from "../services/socket.service";
import {CheshireTermReportComponent} from "../cheshire-term-report/cheshire-term-report.component";

@Component({
  selector: 'app-cheshire-terms',
  templateUrl: './cheshire-terms.component.html',
  styleUrls: ['./cheshire-terms.component.css']
})
export class CheshireTermsComponent implements OnInit {
  public isSearching: boolean = false;

  @ViewChild(CheshireTermReportComponent) reportComponent;

  constructor(
    private termsService: CheshireTermsService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.socketService.socket.subscribe(() => {
      this.reset();
    });
    this.socketService.observeEvent('/cheshire/terms/report/end').subscribe(() => {
        this.isSearching = false;
    });
  }

  onReportParametersChange(parameters: CheshireTermReportParameters) {
    this.reportComponent.reset();
    this.socketService.sendEvent('/cheshire/terms/report', parameters);
    this.isSearching = true;
  }

  onStopSearch() {
    this.socketService.sendEvent('/cheshire/terms/report/cancel');
  }

  reset() {
    this.isSearching = false;
    this.reportComponent.reset();
  }
}
