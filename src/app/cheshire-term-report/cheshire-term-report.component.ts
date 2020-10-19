import {AfterViewInit, Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {DataSource} from "@angular/cdk/collections";
import {MatDialog, MatDialogRef, MatPaginator, MatSnackBar, MatSort} from "@angular/material";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogType
} from "../confirmation-dialog/confirmation-dialog.component";
import {SortService} from "../services/sort.service";
import {CheshireTermReport, CheshireTerm} from "../models/cheshire-terms";
import {SocketService} from "../services/socket.service";

@Component({
  selector: 'app-cheshire-term-report',
  templateUrl: './cheshire-term-report.component.html',
  styleUrls: ['./cheshire-term-report.component.css']
})

export class CheshireTermReportComponent extends DataSource<CheshireTerm> implements OnInit {
  private termsDataChange: BehaviorSubject<CheshireTerm[]> = new BehaviorSubject<CheshireTerm[]>([]);
  public displayedColumns = ['search', 'term', 'priority', 'popularity', 'iPhoneRank', 'iPadRank'];
  private sortService: SortService<CheshireTerm>;
  private dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  public rootTerm: string = '';
  public progress: number = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  _filterChange = new BehaviorSubject('');

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private socketService: SocketService,
  ) {
    super();
    this.sortService = new SortService<CheshireTerm>(((sortBy, a, b) => {
      return [a[sortBy], b[sortBy]];
    }));
  }

  ngOnInit() {
    this.socketService
      .observeEvent('/cheshire/terms/report')
      .map(value => value as CheshireTermReport)
      .subscribe(report => {
        this.rootTerm = report.rootTerm;
        this.progress = report.progress;
        this.termsDataChange.next(this.termsDataChange.value.concat(report.terms));
      });
  }

  reset() {
    this.termsDataChange.next([]);
    this._filterChange.next('');
  }

  onFilterChange(event) {
    this._filterChange.next(event);
  }

  // DataSource<Rule> overrides
  connect(): Observable<CheshireTerm[]> {
    const displayDataChanges = [
      this.termsDataChange,
      this._filterChange,
      this.sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      var data = this.termsDataChange.value.slice();
      data = this.filterData(data);
      data = this.sortData(data);

      return data;
    });
  }

  disconnect() {}

  filterData(data: CheshireTerm[]): CheshireTerm[] {
    return data.filter((term: CheshireTerm) => {
      let searchStr = [term.search, term.term].join(' ').toLowerCase();
      return searchStr.indexOf(this._filterChange.value.toLowerCase()) != -1;
    });
  }

  sortData(data: CheshireTerm[]): CheshireTerm[] {
    if (!this.sort.active || this.sort.direction == '') { return data; }

    return this.sortService.sortData(this.sort.active, this.sort.direction, data);
  }
}
