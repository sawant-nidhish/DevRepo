import { Component, OnDestroy } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service';
import { timer, Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute} from '@angular/router';
import { tick } from '@angular/core/testing';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  tickerValue:string=""
  isInvalidTicker: boolean = false;
  isEmptyTicker: boolean = false;
  isLoading: boolean = false;
  showContent: boolean = false;
  private timerSubscription: Subscription | undefined;
  constructor(private companyDataAPI: CompanyDescriptionService,private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    console.log("Printing from the content",this.router.url)
    this.route.params.subscribe(params => {
      this.tickerValue = params['query'];
      this.companyDataAPI.setInputTicker(this.tickerValue);
      console.log("%%%%Prinitng from the component",this.tickerValue)
      
      this.showContent = false;
      this.isInvalidTicker = false;
      
      if(this.tickerValue=='home' || !this.tickerValue || this.tickerValue==""){
        console.log("Do nothing")
        // this.isLoading = false;
      }
      else{
        this.isLoading = true;
        this.companyDataAPI.getCompanyData(this.tickerValue.toLocaleUpperCase()).subscribe((data)=>{
          console.log("This is the data",data)
          if (Object.keys(data).length == 0) {
            if(this.tickerValue!='home')
                this.isInvalidTicker = true;
              // this.isLoading = false;
              setTimeout(() => {
                this.isLoading=false
              }, 1000);
              this.showContent = false;
          }
          else{
            console.log("Showing the data")
            this.companyDataAPI.fetchData(this.tickerValue.toUpperCase()).subscribe({
              next: ([companyData, companyPrice, companyPeers, companyNews, companyHistoricalData, companyHourlyData, companyRecommendationData, companyEarningsData, companySentimentsData]) => {
                if (Object.keys(companyData).length == 0 || Object.keys(companyPrice).length == 0) {
                  console.log("Invalid")
                  if(this.tickerValue!='home')
                    this.isInvalidTicker = true;
                  // this.isLoading = false;
                  setTimeout(() => {
                    this.isLoading=false
                  }, 1000);
                  this.showContent = false;
                  
                } else {
                  console.log("Is a valid ticker")
                  console.log(companyData)
                  console.log(companyPrice)
                  console.log(companyPeers)
                  console.log(companyNews)
                  console.log(companyHistoricalData)
                  console.log(companyHourlyData)
                  console.log(companyRecommendationData)
                  console.log(companyEarningsData)
                  console.log(companySentimentsData)  
    
                  
                  this.companyDataAPI.setCompanyData(companyData);
                  
                  this.companyDataAPI.setCompanyPriceData(companyPrice);
                  this.companyDataAPI.setCompanyPeersData(companyPeers);
                  
                  this.companyDataAPI.setCompanyNewsData(companyNews);
                  
                  this.companyDataAPI.setCompanyHistoricalData(companyHistoricalData);
                  
                  this.companyDataAPI.setCompanyHourlyData(companyHourlyData);
                  
                  this.companyDataAPI.setCompanyRecommendationData(companyRecommendationData);
                  
                  this.companyDataAPI.setCompanyEarningsData(companyEarningsData);
                  
                  this.companyDataAPI.setCompanySentimentsData(companySentimentsData);
                  
                  
                  // this.isLoading = false;
                  setTimeout(() => {
                    this.isLoading=false
                  }, 1000);
                  this.showContent = true;
                  const stockTimestamp= companyPrice.t*1000;
                  console.log("Timestamp from the API",new Date(companyPrice.t * 1000).toLocaleString())
                  const currTime = Date.now();
                  console.log("Curretn timestamp",new Date(currTime).toLocaleString())
                  const diffTime=(currTime-stockTimestamp)/(1000*60)
                  if(diffTime<5){
                    // Call the API every 15 seconds
                    this.timerSubscription = interval(15000)
                    .pipe(
                      switchMap(() => this.companyDataAPI.getCompanyPrice(this.tickerValue))
                    )
                    .subscribe({
                      next: (updatedCompanyPrice) => {
                        // Update the company data and pri
                        this.companyDataAPI.setCompanyPriceData(updatedCompanyPrice);
                        
      
                        console.log("Called the data");
                      },
                      error: error => {
                        console.error('Error fetching updated data:', error);
                      }
                    });
                  }
                  else{
                    console.log("More than 5 minutes have elasped since market open hence not calling the market")
                  }
                }
              },
              error: error => {
                console.error('Error fetching data:', error);
                // this.isLoading = false;
                setTimeout(() => {
                  this.isLoading=false
                }, 1000);
              }
            });  
          }

        })
        
        // if(!this.isInvalidTicker){

        // }
        
      }
      
    })
    }
  
  
}
