

import {Component, OnInit, ViewChild, ChangeDetectorRef, NgZone  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {filter, map, startWith, switchMap, tap, finalize} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule, MatAutocomplete} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CompanyDescriptionService} from '../services/company-description.service'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
/**
 * @title Highlight the first autocomplete option
 */
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatProgressSpinnerModule
  ],
})
export class TestComponent implements OnInit {
  isLoading = false;
  constructor(private companyDataAPI: CompanyDescriptionService, private cdr: ChangeDetectorRef, private ngZone: NgZone){}
  // myControl = new FormControl('');
  // options1!: any[]
  // filteredOptions!: Observable<any[]>;

  // ngOnInit() {
  //   this.filteredOptions = this.myControl.valueChanges.pipe(
  //     startWith(''),
  //     map(value => this._filter(value || '')),
  //   );
  // }

  // private _filter(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   // let options1:any[]
  //   if(filterValue){
  //     console.log('Filter value is',filterValue)
  //     let subscription=this.companyDataAPI.getCompanyAutocompleteData(filterValue).subscribe(data=>{
  //     // console.log(data)
  //       this.options1=data.result
      
  //   })
  //   subscription.add(()=>{
  //     console.log("Options 1",this.options1)
  //     return this.options1.filter(option => option.toLowerCase().includes(filterValue));
  //   })
    
  //   }
    
    
    
  // }
  myControl = new FormControl('');
  options: any[] = [];
  filteredOptions!: Observable<any[]>;
  // @ViewChild(MatAutocomplete) auto!: MatAutocomplete;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      // startWith(''),
      tap(()=>{
       
          this.isLoading = true; // Set isLoading to true immediately
        // this.cdr.detectChanges();
        this.runChangeDetection()
        
        
      }),
      switchMap(value => {
        
        return this._updateOptions(value || '').pipe(
          map(res => this._filter(value || '')),
          finalize(() => {
            this.isLoading = false; // Set isLoading to false when _updateOptions completes
            // this.cdr.detectChanges();
            this.runChangeDetection()
          })
        );
      })
    );
  }
  setLoading(){
    this.isLoading=true
  }
  unSetLoading(){
    this.isLoading=false
  }

  private _updateOptions(value: string): Observable<void> {
    if (value) {
      console.log('Filter value is', value);
      // Assuming companyDataAPI.getCompanyAutocompleteData returns an Observable
      return this.companyDataAPI.getCompanyAutocompleteData(value).pipe(
        map(data => {
          this.options = data.result;
        })
      );
    }
    return of(void 0);  // Return an empty observable if value is empty
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.symbol.toLowerCase().includes(filterValue));
  }
  displayFn(item:any){
    return item ? item.symbol : undefined
  }
  private runChangeDetection(): void {
    this.cdr.detectChanges();
  }
}