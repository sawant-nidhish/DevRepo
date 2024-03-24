import { Component } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service'
import { format } from 'date-fns';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  highPrice:number=0
  lowPrice:number=0
  openPrice:number=0
  prevClosePrice:number=0
  latestTime:any
  ipo:string=""
  industry:string=""
  webpage:string=""
  companyPeers:string=""

  companyHourlyData:any

  Highcharts= Highcharts;

chartOptions: Highcharts.Options = {
}
  constructor(private companyDataAPI: CompanyDescriptionService) { }
  ngOnInit(): void {
  //Company Price
  this.companyDataAPI.getCompanyPriceDataObservable().subscribe(data => {
    if(data){
      //stockprice
      this.highPrice=data.h
      this.lowPrice = data.l
      this.openPrice = data.o
      this.prevClosePrice= data.pc
      this.latestTime = data.t
    }
      
  });

  this.companyDataAPI.getCompanyDataObservable().subscribe(data => {
    //companydetails
    if(data){
      console.log(data)
      this.ipo = data.ipo
      this.industry = data.finnhubIndustry
      this.webpage= data.weburl
      // this.logo= data.logo
    }
      
  });

  this.companyDataAPI.getCompanyPeerseDataObservable().subscribe(data => {
    //companydetails
    if(data){
      console.log(data)
      this.companyPeers = data
      // this.industry = data.finnhubIndustry
      // this.webpage= data.weburl
      // this.logo= data.logo
    }
      
  });
  

  //code to decide whether the market is closed or open and pull corresposning hourly data
  let closeTime=this.latestTime
  console.log("########Got this time from API",this.latestTime)
  const stockTimestamp= this.latestTime*1000;
  console.log("######Timestamp from the API",new Date(this.latestTime * 1000).toLocaleString())
  const currTime = Date.now();
  console.log("######Curretn timestamp",new Date(currTime).toLocaleString())
  const diffTime=(currTime-stockTimestamp)/(1000*60)
      
      // for (let i = 0; i < data.results.length; i += 1) {
      //   // console.log("time ",new Date(data.results[i].t).toLocaleString())
      // }

  let color:string
  if(diffTime<5){
    console.log("Plot graph from currrent to last date");
    let aDayBefore=new Date(currTime)
    aDayBefore.setDate(aDayBefore.getDate()-1)
    let today=new Date(currTime).getDate()
    color="green"
    //make call to hourly with these time stamps
    // this.companyHourlyData()


  }
  else{
    console.log("Plot graph from market close time to a daybefore date");
    let aDayBefore=new Date(stockTimestamp)
    aDayBefore.setDate(aDayBefore.getDate()-1)
    let today=new Date(stockTimestamp).getDate()
    color="red"
    //make call to hourly with these time stamps
    
  }
  this.companyDataAPI.getCompanyHourlyDataObservable().subscribe(data => {
    //companydetails
    
        this.companyHourlyData = data.results
        
      
      let hourlyPrice=[]
        console.log("Chart daata",this.companyHourlyData)
        for (let i = 0; i < this.companyHourlyData.length; i += 1) {
          hourlyPrice.push([
            this.companyHourlyData[i]['t'], // the date
            this.companyHourlyData[i]['c'],]) // open
        }

      // Highcharts
      this.chartOptions = {   
        chart: {
           type: "line"
        },
        title: {
           text: `${data.ticker} Hourly Price Variation`
        },
        // subtitle: {
        //    text: "Source: WorldClimate.com"
        // },
        xAxis:{
          type:'datetime'
          
          
        },
        yAxis: {          
          //  title:{
          //     text:"Temperature °C"
          //  } 
         
        },
        tooltip: {
          //  valueSuffix:" °C"
          split:true,
          formatter: function() {
            // Only display the series name and y-axis value
            return '<b>' + this.series.name + '</b>: ' + this.y;
        }
        },
        series: [{
            type:'line',
           name: data.ticker,
           data: hourlyPrice,
           marker:{enabled:false},
           color:color
        },
        ]
     };
    }
    
  
      // this.industry = data.finnhubIndustry
      // this.webpage= data.weburl
      // this.logo= data.logo
    
  );
  }
}
