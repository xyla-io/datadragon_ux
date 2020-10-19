import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output, ViewChild, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MatSelect, MatSelectChange } from '@angular/material';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-filterable-dropdown',
  templateUrl: './filterable-dropdown.component.html',
  styleUrls: ['./filterable-dropdown.component.css'],
})
export class FilterableDropdownComponent implements OnInit, OnChanges {

  control = new FormControl();
  @Input() placeholder: string = 'Select';
  @Input() displayProperty: string = 'name';
  @Input() valueProperty: string = 'id';
  @Input() selectedValue: string = '';
  @Input() options: any[] = [];
  @Input() optionBadgeDataByKey: Record<string, number> = {};
  @Output() optionSelected = new EventEmitter<string>();
  @ViewChild('singleSelect') singleSelect: MatSelect;
  public optionsCtrl: FormControl = new FormControl();
  public filterCtrl: FormControl = new FormControl();
  public filteredOptions: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected destroy$ = new Subject<void>();
  public dropdownIsOpen: boolean = false;

  constructor() { }

  ngOnInit() {
    this.filterCtrl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.filter();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options) {
      this.optionsCtrl.setValue(this.selectedValue
        ? this.options.find(o => o[this.valueProperty] === this.selectedValue)
        : this.options[0]
      );
      this.filteredOptions.next(this.options.slice());
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filter() {
    if (!this.options) { return; }
    let search = this.filterCtrl.value;
    if (!search) {
      this.filteredOptions.next(this.options.slice());
      return;
    }
    this.filteredOptions.next(
      this.options.filter(o => o[this.displayProperty].toLowerCase().indexOf(search.toLowerCase()) > -1)
    );
  }

  onSelectionChange(selection: MatSelectChange) {
    this.optionSelected.emit(selection.value[this.valueProperty])
  }

  onOpenedChanged(event: any) {
    this.dropdownIsOpen = event;
  }
}
