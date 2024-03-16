import { Component, OnDestroy,OnInit } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
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
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;
  private timerSubscription: Subscription | undefined;

  constructor(private companyDataAPI: CompanyDescriptionService, private router: Router, private route: ActivatedRoute,) {}

  ngOnInit() {
    this.companyDataAPI.getInputTicker().subscribe(data=>{
      console.log("%%%%%%%%Input ticker value has changed",data)
      this.inputTicker=data})
    // console.log("Printing from the content",this.router.url)
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
