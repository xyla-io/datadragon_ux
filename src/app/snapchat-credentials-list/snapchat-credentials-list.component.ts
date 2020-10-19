import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogType
} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog, MatDialogRef, MatSnackBar, MatSort} from "@angular/material";
import {Subscription} from "rxjs/Subscription";
import {DataSource} from "@angular/cdk/collections";
import {SortService} from "../services/sort.service";
import {Observable} from "rxjs/Observable";

import { SnapchatCredential, CredentialTarget } from '../models/credential';
import { CredentialService } from '../services/credential.service';

@Component({
  selector: 'app-snapchat-credentials-list',
  templateUrl: './snapchat-credentials-list.component.html',
  styleUrls: ['./snapchat-credentials-list.component.css']
})
export class SnapchatCredentialsListComponent extends DataSource<SnapchatCredential> implements OnInit, OnDestroy {
  private snapchatCredentialsDataChange: BehaviorSubject<SnapchatCredential[]> = new BehaviorSubject<SnapchatCredential[]>([]);
  public displayedColumns = ['name', 'creationDate', 'delete'];
  private sortService: SortService<SnapchatCredential>;
  private dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  private credentialsSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  _filterChange = new BehaviorSubject('');

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private credentialService: CredentialService
  ) {
    super();
    this.sortService = new SortService<SnapchatCredential>(((sortBy, a, b) => {
      return [a[sortBy], b[sortBy]];
    }));
    this.snapchatCredentialsDataChange.next(this.credentialService.credentials.filter(c => c.target === CredentialTarget.Snapchat) as SnapchatCredential[]);
    this.credentialsSubscription = this.credentialService.credentialsObservable.subscribe(credentials => {
      this.snapchatCredentialsDataChange.next(credentials.filter(c => c.target === CredentialTarget.Snapchat) as SnapchatCredential[]);
    })
  }

  ngOnInit() {
    if (this.credentialService.credentials.length === 0) {
      this.credentialService.refreshCredentials();
    }
  }

  onFilterChange(event) {
    this._filterChange.next(event);
  }

  deleteCredential(snapchatCredential: SnapchatCredential) {

    this._showConfirmationDialog(ConfirmationDialogType.Destructive,
      "Delete " + snapchatCredential.name + " Credentials",
      "Are you sure you want to do this?",
      "Cancel",
      "Delete", () => {
        this.dialogRef.close();
      }, () => {
        this.credentialService.deleteCredentialByPath(snapchatCredential.path).then(() => {
          this.credentialService.refreshCredentials();
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
  connect(): Observable<SnapchatCredential[]> {
    const displayDataChanges = [
      this.snapchatCredentialsDataChange,
      this._filterChange,
      this.sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      var data = this.snapchatCredentialsDataChange.value.slice();
      data = this.filterData(data);
      data = this.sortData(data);

      return data;
    });
  }

  disconnect() {}

  filterData(data: SnapchatCredential[]): SnapchatCredential[] {
    console.log('Filtering data');
    return data.filter((snapchatCredential: SnapchatCredential) => {
      let searchStr = [snapchatCredential.name, snapchatCredential.creationDate].join(' ').toLowerCase();
      return searchStr.indexOf(this._filterChange.value.toLowerCase()) != -1;
    });
  }

  sortData(data: SnapchatCredential[]): SnapchatCredential[] {
    if (!this.sort.active || this.sort.direction == '') { return data; }

    return this.sortService.sortData(this.sort.active, this.sort.direction, data);
  }

  ngOnDestroy() {
    this.credentialsSubscription.unsubscribe();
  }
}

