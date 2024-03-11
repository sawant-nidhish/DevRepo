// stock-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service'
import { format } from 'date-fns';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css']
})
export class StockDetailsComponent {
  
  companyData: any
  //companydetails
  ticker: string=""
  companyName:string=""
  exchangeCode:string=""
  logo:string=""

  //stockprice
  lastPrice:string=""
  change:number=0
  changePercent:number=0
  currTimeStamp:string=""
  color=""

  //market closed
  marketClosed:boolean=false
  constructor(private companyDataAPI: CompanyDescriptionService) { }

  ngOnInit(): void {
    this.companyDataAPI.getCompanyDataObservable().subscribe(data => {
      //companydetails
      if(data){
        this.ticker = data.ticker;
        this.companyName = data.name;
        this.exchangeCode= data.exchange
        this.logo= data.logo
      }
        
    });


    //Company Price
    this.companyDataAPI.getCompanyPriceDataObservable().subscribe(data => {
      if(data){
        //stockprice
        this.marketClosed=false
        this.lastPrice = data.c;
        this.change = data.d;
        this.changePercent= data.dp;
        console.log("Time received from API",data.t)
        this.currTimeStamp= format(new Date(data.t * 1000).toLocaleString(), 'yyyy-MM-dd HH:mm:ss');
        console.log(new Date(data.t * 1000).toLocaleString())
        const currDate = new Date(this.currTimeStamp);

        // Get the current timestamp in milliseconds
        const currentTimestamp = new Date();
        console.log("Today's Date",currentTimestamp.getTime().toLocaleString())
        // Get the timestamp of the formatted date
        const currTimestamp = currDate.getTime();

        // Calculate the difference in milliseconds
        const difference = currentTimestamp.getTime() - currTimestamp;

        // Check if the difference is greater than 5 minutes (5 * 60 * 1000 milliseconds)
        if (difference > (5 * 60 * 1000)) {
          this.marketClosed=true
          console.log('More than 5 minutes have elapsed since this.currTimeStamp.');
        } else {
          console.log('Less than 5 minutes have elapsed since this.currTimeStamp.');
        }

        if(this.change<0)
          this.color='red'
        else
        this.color='green'
        console.log("The lastPRice ",this.change)
      }
        
    });

  }
}
