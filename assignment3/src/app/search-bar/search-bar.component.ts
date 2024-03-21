import { Component, OnDestroy,OnInit, ChangeDetectorRef } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service';
import { timer, Subscription, of, tap, finalize } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { param } from 'jquery';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit{
  inputTicker: string = '';
  tickerValue:string=""
  isInvalidTicker: boolean = false;
  isEmptyTicker: boolean = false;
  isLoading: boolean = false;
  showContent: boolean = false;

  myControl = new FormControl('');
  options: any[] = [];
  filteredOptions!: Observable<any[]>;
  private timerSubscription: Subscription | undefined;

  constructor(private companyDataAPI: CompanyDescriptionService, private router: Router, private route: ActivatedRoute,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.companyDataAPI.getShowContent().subscribe(data=>this.showContent=data)
    this.route.params.subscribe(param=>{
      this.showContent=true
      // if(param['query']!='home')
        // this.tickerValue=param['query']
      console.log("%%%%%The ticker value has changed",this.showContent)
      console.log("The url is ",this.router.url)
      // this.getData()
      console.log("Called the getData")
    })
      this.companyDataAPI.getInputTicker().subscribe(data=>{
        console.log("$$$$$$$$Has changed",data)
        if(data!='home')
          this.inputTicker=data})
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
      // this.companyDataAPI.getInputTicker().subscribe(data=>{
      //   console.log("%%%%%%%%Input ticker value has changed",data)
      //   this.inputTicker=data})
        this.inputTicker=this.myControl.value || ''
    
    

        //   this.tickerValue = params['query'];
    // console.log("Prin ting from the content",this.router.url)
    //   this.route.params.subscribe(params => {
    //   this.tickerValue = params['query'];
    //   if(this.tickerValue){
    //     this.companyDataAPI.setInputTicker(this.tickerValue);
    //     console.log("Prinitng from the component",this.tickerValue)
    //     this.isLoading = true;
    //     this.showContent = false;
    //     this.isInvalidTicker = false;

    //     this.companyDataAPI.fetchData(this.tickerValue).subscribe({
    //       next: ([companyData, companyPrice, companyPeers, companyNews, companyHistoricalData, companyHourlyData, companyRecommendationData, companyEarningsData, companySentimentsData]) => {
    //         if (Object.keys(companyData).length === 0 || Object.keys(companyPrice).length === 0) {
    //           this.isInvalidTicker = true;
    //           this.isLoading = false;
    //           this.showContent = false;
              
    //         } else {
    //           this.companyDataAPI.setCompanyData(companyData);
    //           this.companyDataAPI.setCompanyPriceData(companyPrice);
    //           this.companyDataAPI.setCompanyPeersData(companyPeers);
    //           this.companyDataAPI.setCompanyNewsData(companyNews);
    //           this.companyDataAPI.setCompanyHistoricalData(companyHistoricalData);
    //           this.companyDataAPI.setCompanyHourlyData(companyHourlyData);
    //           this.companyDataAPI.setCompanyRecommendationData(companyRecommendationData);
    //           this.companyDataAPI.setCompanyEarningsData(companyEarningsData);
    //           this.companyDataAPI.setCompanySentimentsData(companySentimentsData);

    //           this.isLoading = false;
    //           this.showContent = true;
    //           const stockTimestamp= companyPrice.t*1000;
    //           console.log("Timestamp from the API",new Date(companyPrice.t * 1000).toLocaleString())
    //           const currTime = Date.now();
    //           console.log("Curretn timestamp",new Date(currTime).toLocaleString())
    //           const diffTime=(currTime-stockTimestamp)/(1000*60)
    //           if(diffTime<5){
    //             // Call the API every 15 seconds
    //             this.timerSubscription = timer(15000, 15000)
    //             .pipe(
    //               switchMap(() => this.companyDataAPI.getCompanyPrice(this.tickerValue))
    //             )
    //             .subscribe({
    //               next: (updatedCompanyPrice) => {
    //                 // Update the company data and pri
    //                 this.companyDataAPI.setCompanyPriceData(updatedCompanyPrice);
                    

    //                 console.log("Called the data");
    //               },
    //               error: error => {
    //                 console.error('Error fetching updated data:', error);
    //               }
    //             });
    //           }
    //           else{
    //             console.log("More than 5 minutes have elasped since market open hence not calling the market")
    //           }
    //         }
    //       },
    //       error: error => {
    //         console.error('Error fetching data:', error);
    //         this.isLoading = false;
    //       }
    //     });
    //   }
      

    // })
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

  getData(): void {
    //add the route call here so that when some thing is searched the app redirects to that route
    this.showContent = false;
    this.isInvalidTicker = false;
    this.isEmptyTicker = false;
    this.isEmptyTicker = this.inputTicker.length === 0;
    if (!this.isEmptyTicker) {
      
      this.showContent=true
      if (this.inputTicker.trim() !== '') {
        // this.loadingService.setIsLoading(true);
      console.log("Navigating to this route",this.inputTicker)
      this.router.navigate(['/search', this.inputTicker]);
      }

    } else {
      this.isInvalidTicker = false;
      this.showContent = false;
    }
  }
  // ngOnDestroy(): void {
  //   // Unsubscribe from the timer subscription when the component is destroyed
  //   if (this.timerSubscription) {
  //     this.timerSubscription.unsubscribe();
  //   }
  // }
}
