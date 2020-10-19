import { NgModule } from '@angular/core';
import {
  MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatListModule, MatTableModule, MatInputModule,
  MatSelectModule, MatSlideToggleModule, MatChipsModule, MatProgressSpinnerModule, MatCardModule, MatExpansionModule,
  MatProgressBarModule, MatPaginatorModule, MatDialogModule, MatTooltipModule, MatTabsModule, MatSortModule, MatSnackBarModule, MatMenuModule, MatIconModule,
  MatAutocompleteModule
} from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material";

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatListModule, MatTableModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatChipsModule, MatProgressSpinnerModule, MatCardModule, MatExpansionModule, MatProgressBarModule, MatPaginatorModule, MatTooltipModule, MatTabsModule, MatSortModule, MatSnackBarModule, MatMenuModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, NgxMatSelectSearchModule],
  exports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatListModule, MatTableModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatChipsModule, MatProgressSpinnerModule, MatCardModule, MatExpansionModule, MatProgressBarModule, MatPaginatorModule, MatDialogModule, MatTooltipModule, MatTabsModule, MatSortModule, MatSnackBarModule, MatMenuModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, NgxMatSelectSearchModule],
})
export class MaterialModule { }
