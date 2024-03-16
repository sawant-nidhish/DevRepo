// stock-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service'
import { format } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';


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

  //start button
  isSelected=false
  starColor=""
  addToWatchlist=false
  rmFromWatchlist=false
  constructor(private companyDataAPI: CompanyDescriptionService, private http: HttpClient) { }

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

    //check if the stock is in watchlist
    this.checkInWatchList(this.ticker.toUpperCase())

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

  checkInWatchList(symbol:string){
    let response=this.http.get(`http://localhost:3000/api/watchlist?symbol=${symbol}`).pipe(
    catchError(error => {
      console.error('Error fetching company data:', error);
      throw error;
    })
  );
  response.subscribe(data=>{
    console.log("This is the data from the wathclist endpoint",data)
    if(data){
      this.isSelected=true
      this.starColor="yellow"
    }
    else{
      this.isSelected=false
      this.starColor=""
    }
  })
  }

   async addToWatchList(stock:any){
    const response= this.http.post(`http://localhost:3000/api/watchlist`,stock).pipe(
      catchError(error => {
        console.error('Error fetching company data:', error);
        throw error;
      }),
    );
    response.subscribe(data=>{
      console.log("This is the data from the wathclist endpoint",data)
    });
    // return response
  }

  async deleteFromWatchList(symbol:string){
    const response=this.http.delete(`http://localhost:3000/api/watchlist?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company data:', error);
        throw error;
      })
    );
    response.subscribe(data=>{
      console.log("This is the data from the wathclist endpoint",data)
    });
  }


  async clickStar(){
    console.log("Clicked the start button for ticker",this.ticker)
    this.isSelected=!this.isSelected
    if(this.isSelected){
      //code for adding to DB
      await this.addToWatchList({name:this.ticker.toUpperCase(),companyName:this.companyName})
      console.log("Added data")
      this.starColor='yellow';
      this.addToWatchlist=true
      this.rmFromWatchlist=false
      // console.log("Added data")
    }
    else{
      //code for deleting from DB
      this.deleteFromWatchList(this.ticker.toUpperCase())
      console.log("Deleted Successfully")
      this.starColor=""
      this.addToWatchlist=false
      this.rmFromWatchlist=true
    }
  }
}
