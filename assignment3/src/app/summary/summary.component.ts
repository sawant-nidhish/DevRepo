import { Component } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service'
import { format } from 'date-fns';

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

  ipo:string=""
  industry:string=""
  webpage:string=""

  companyPeers:string=""
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
  }
}
