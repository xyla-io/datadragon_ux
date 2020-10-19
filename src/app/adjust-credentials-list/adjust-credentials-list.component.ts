import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {MatDialog, MatDialogRef, MatSnackBar, MatSort} from "@angular/material";
import {AdjustCredential, AdjustService} from "../services/adjust.service";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogType
} from "../confirmation-dialog/confirmation-dialog.component";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {SortService} from "../services/sort.service";
import {DataSource} from "@angular/cdk/collections";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-adjust-credentials-list',
  templateUrl: './adjust-credentials-list.component.html',
  styleUrls: ['./adjust-credentials-list.component.css']
})
export class AdjustCredentialsListComponent extends DataSource<AdjustCredential> implements OnInit, OnDestroy {
  private adjustCredentialsDataChange: BehaviorSubject<AdjustCredential[]> = new BehaviorSubject<AdjustCredential[]>([]);
  public displayedColumns = ['name', 'credentialCreationDate', 'delete'];
  private sortService: SortService<AdjustCredential>;
  private dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  private credentialsSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  _filterChange = new BehaviorSubject('');

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private adjustService: AdjustService
  ) {
    super();
    this.sortService = new SortService<AdjustCredential>(((sortBy, a, b) => {
      return [a[sortBy], b[sortBy]];
    }));
    this.adjustCredentialsDataChange.next(this.adjustService.credentials);
    this.credentialsSubscription = this.adjustService.credentialsObservable.subscribe(credentials => {
      this.adjustCredentialsDataChange.next(credentials);
    })
  }

  ngOnInit() {
    if (this.adjustService.credentials.length === 0) {
      this.adjustService.refreshCredentials();
    }
  }

  onFilterChange(event) {
    this._filterChange.next(event);
  }

  deleteCredential(adjustCredential: AdjustCredential) {

    this._showConfirmationDialog(ConfirmationDialogType.Destructive,
      "Delete " + adjustCredential.name + " Credentials",
      "Are you sure you want to do this?",
      "Cancel",
      "Delete", () => {
        this.dialogRef.close();
      }, () => {
        this.adjustService.deleteCredentialByID(adjustCredential._id).then(() => {
          this.adjustService.refreshCredentials();
          this.dialogRef.close();
          this.snackBar.open("Credentials Removed", "", {
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
  connect(): Observable<AdjustCredential[]> {
    const displayDataChanges = [
      this.adjustCredentialsDataChange,
      this._filterChange,
      this.sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      var data = this.adjustCredentialsDataChange.value.slice();
      data = this.filterData(data);
      data = this.sortData(data);

      return data;
    });
  }

  disconnect() {}

  filterData(data: AdjustCredential[]): AdjustCredential[] {
    console.log('Filtering data');
    return data.filter((adjustCredential: AdjustCredential) => {
      let searchStr = [adjustCredential.name, adjustCredential.credentialCreationDate].join(' ').toLowerCase();
      return searchStr.indexOf(this._filterChange.value.toLowerCase()) != -1;
    });
  }

  sortData(data: AdjustCredential[]): AdjustCredential[] {
    if (!this.sort.active || this.sort.direction == '') { return data; }

    return this.sortService.sortData(this.sort.active, this.sort.direction, data);
  }

  ngOnDestroy() {
    this.credentialsSubscription.unsubscribe();
  }
}

