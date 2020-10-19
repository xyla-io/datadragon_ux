import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Certificate} from "../models/certificate";
import {DataSource} from "@angular/cdk/collections";
import {CertificateService} from "../services/certificate.service";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {SortService} from "../services/sort.service";
import {MatDialog, MatDialogRef, MatSnackBar, MatSort} from "@angular/material";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogType
} from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-certificates-list',
  templateUrl: './certificates-list.component.html',
  styleUrls: ['./certificates-list.component.css']
})
export class CertificatesListComponent extends DataSource<Certificate> implements OnInit, AfterViewInit {
  private certificatesLoader: Subject<never> = new Subject();
  private certificatesDataChange: BehaviorSubject<Certificate[]> = new BehaviorSubject<Certificate[]>([]);
  public displayedColumns = ['name', 'certificateCreationDate', 'delete'];
  private sortService: SortService<Certificate>;
  private dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  _filterChange = new BehaviorSubject('');

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private certificateService: CertificateService
  ) {
    super();
    this.sortService = new SortService<Certificate>(((sortBy, a, b) => {
      return [a[sortBy], b[sortBy]];
    }));
  }

  ngOnInit() {
    this.certificatesLoader.switchMap(() => this.certificateService.getCertificates()).subscribe(certificates => {
      this.certificatesDataChange.next(certificates);
    });
  }

  ngAfterViewInit() {
    this.refresh();
  }

  onFilterChange(event) {
    this._filterChange.next(event);
  }

  refresh() {
    this.certificatesLoader.next();
  }

  deleteCertificate(certificate: Certificate) {

    this._showConfirmationDialog(ConfirmationDialogType.Destructive,
      "Delete " + certificate.name + " Credentials",
      "Are you sure you want to do this?",
      "Cancel",
      "Delete", () => {
        this.dialogRef.close();
      }, () => {
        this.certificateService.deleteById(certificate._id).then(() => {
          this.refresh();
          this.dialogRef.close();
          this.snackBar.open("Certificate Removed", "", {
            duration: 2000,
          });
        });
    });
  }

  private _showConfirmationDialog(type: ConfirmationDialogType,
                                  title: string,
                                  subtitle: string,
                                  cancelButtonTitle: string,
                                  actionButtonTitle: string,
                                  onCancel: () => void,
                                  onAction: () => void) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogType: type,
        dialogTitle: title,
        dialogSubtitle: subtitle,
        cancelButtonTitle: cancelButtonTitle,
        actionButtonTitle: actionButtonTitle,
        onCancel: onCancel,
        onAction: onAction
      }
    });
  }

  // DataSource<Rule> overrides
  connect(): Observable<Certificate[]> {
    const displayDataChanges = [
      this.certificatesDataChange,
      this._filterChange,
      this.sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      var data = this.certificatesDataChange.value.slice();
      data = this.filterData(data);
      data = this.sortData(data);

      return data;
    });
  }

  disconnect() {}

  filterData(data: Certificate[]): Certificate[] {
    console.log('Filtering data');
    return data.filter((certificate: Certificate) => {
      let searchStr = [certificate.name, certificate.certificateCreationDate].join(' ').toLowerCase();
      return searchStr.indexOf(this._filterChange.value.toLowerCase()) != -1;
    });
  }

  sortData(data: Certificate[]): Certificate[] {
    if (!this.sort.active || this.sort.direction == '') { return data; }

    return this.sortService.sortData(this.sort.active, this.sort.direction, data);
  }
}
