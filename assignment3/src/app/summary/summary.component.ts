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

  this.companyDataAPI.getCompanyHourlyDataObservable().subscribe(data => {
    //companydetails
    console.log("Getting the data")
    if(data){
      console.log(data)
      this.companyHourlyData = data
      let closeTime=this.latestTime
      console.log("########Got this time from API",this.latestTime)
      const stockTimestamp= this.latestTime*1000;
      console.log("######Timestamp from the API",new Date(this.latestTime * 1000).toLocaleString())
      const currTime = Date.now();
      console.log("######Curretn timestamp",new Date(currTime).toLocaleString())
      const diffTime=(currTime-stockTimestamp)/(1000*60)
      
      for (let i = 0; i < data.results.length; i += 1) {
        console.log("time ",new Date(data.results[i].t).toLocaleString())
      }



      if(diffTime<5){
        console.log("Plot graph from currrent to last date");
        data.results.filter(function (item:any){
          let aDayBefore=new Date()
          aDayBefore.setTime(aDayBefore.getTime()-6*60*60*1000)
          aDayBefore.getTime()
          console.log("PrevDay",aDayBefore.getTime())
          console.log(new Date(item.t))
          let currUnix=Math.floor(new Date().getTime())
          let adDayBefore=Math.floor(aDayBefore.getTime())
          console.log("Prev datye",new Date(adDayBefore))
          return item.t >=aDayBefore && item.t <=currUnix
        })
        this.companyHourlyData = data.results
      }
      else{

        data.results.filter(function (item:any){
          let aDayBefore=new Date()
          aDayBefore.setTime(aDayBefore.getTime()-6*60*60*1000)
          console.log(aDayBefore.toLocaleString())

          // console.log("PrevDay",latestTime)
          let currUnix=Math.floor(closeTime*1000)
          console.log(new Date(currUnix).toLocaleString())
          // let adDayBefore=Math.floor(aDayBefore.getTime()/1000)
          console.log(new Date(item.t).toLocaleString())
          return item.t >=aDayBefore && item.t <=currUnix
        })
        this.companyHourlyData = data.results
      }
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
           text: "Monthly Average Temperature"
        },
        subtitle: {
           text: "Source: WorldClimate.com"
        },
        xAxis:{
          type:'datetime'
        },
        yAxis: {          
           title:{
              text:"Temperature °C"
           } 
        },
        tooltip: {
           valueSuffix:" °C"
        },
        series: [{
            type:'line',
           name: 'Tokyo',
           data: hourlyPrice
        },
        ]
     };
    }
    
  
      // this.industry = data.finnhubIndustry
      // this.webpage= data.weburl
      // this.logo= data.logo
    
  });
  }
}
