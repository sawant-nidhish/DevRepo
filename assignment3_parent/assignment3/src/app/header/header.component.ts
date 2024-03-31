import { Component, ViewChild } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

CompanyDescriptionService


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  private tikcer:string=""
  url:string=""
  search:boolean=true
  watchlist:boolean=false
  portfolio:boolean=false
  constructor(private companyDataAPI: CompanyDescriptionService,private router: Router,){}
  onNgInit(){
    this.companyDataAPI.getInputTicker().subscribe(data=>{
      console.log("This is the value from the header",data)
    })
  }
  searchClick(){
    this.search=true;
    this.watchlist=false;
    this.portfolio=false;
    this.companyDataAPI.getInputTicker().subscribe(data=>{
      if(data=="home" || data.length==0){
        console.log("This is the header url",this.url)
        this.url='search/home'
      }
      else{
        console.log("This is the header url",this.url)
        this.url="search/"+data
        this.router.navigate([this.url]);
      }
      console.log("This is the value from the header",data)
    })
  }
  watchlistClick(){
    this.search=false;
    this.watchlist=true;
    this.portfolio=false;
    
  }
  portfolioClick(){
    this.search=false;
    this.watchlist=false;
    this.portfolio=true;
    
  }
}
