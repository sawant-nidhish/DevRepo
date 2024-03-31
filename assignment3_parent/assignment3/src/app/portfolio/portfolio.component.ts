// stock-details.component.ts
import { Component, OnInit, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service'
import { format } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, ObservableLike, never } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { computeStyles } from '@popperjs/core';

import { Router } from '@angular/router';
import { env } from '../environment';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})

export class PortfolioComponent {
  ticker:any
  money:number=0
  portfolio:any
  portfolioList:any=[]
  isEmpty:boolean=false
  isLoading:boolean=true
  buyAlert:any={ticker:"",flag:false}
  sellAlert:any={ticker:"",flag:false}
  private modalService = inject(NgbModal);
  constructor(private companyDataAPI: CompanyDescriptionService, private http: HttpClient) { 
    
  }
  
  ngOnInit(){
    this.isLoading=true
    this.companyDataAPI.getBuyAlertPort().subscribe(data=>{
      this.buyAlert=data
      console.log(this.buyAlert)

    })
    this.companyDataAPI.getSellAlertPort().subscribe(data=>this.sellAlert=data)
    if(this.buyAlert.flag==true){
      console.log("#######Buy Alert is true")
    }
    if(this.buyAlert.flag||this.sellAlert.flag){
      this.isLoading=false
    }
    let response=this.checkWallet()
    response.subscribe(data=>this.money=data.money)

    // response1 = new Promise<any>((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(this.checkInPortfolio());
    //   }, 1000);
    // });

    response=this.checkInPortfolio()
    response.subscribe(data=>{
      console.log(data)
      if(data.length!=0){
        this.portfolio=data
        console.log(this.portfolio)
        for(let item in this.portfolio){
          console.log(this.portfolio[item])
          this.companyDataAPI.getCompanyPrice(this.portfolio[item].name).subscribe(data=>{
            this.portfolioList.push({
              name:this.portfolio[item].name,
              companyName:this.portfolio[item].companyName,
              qty:this.portfolio[item].qty,
              avgCost:this.portfolio[item].avgCost,
              totalCost:this.portfolio[item].totalCost,
              currentPrice:data.c,
              change:this.portfolio[item].avgCost-data.c,
              marketValue:data.c*this.portfolio[item].qty
            })
          })
        }
        setTimeout(() => {
          this.isLoading=false
        }, 1000);
        // this.isLoading=false
      }
      else{
        this.isEmpty=true
        setTimeout(() => {
          this.isLoading=false
        }, 1000);
        // this.isLoading=false
      }  
      }
      )
      this.companyDataAPI.getBuyAlertPort().subscribe(data=>{
        this.buyAlert=data
        console.log("This is the data at the end",this.buyAlert)
      })

  }
  checkWallet():Observable<any>{
    return this.http.get(env+`/api/wallet`).pipe(
    catchError(error => {
      console.error('Error fetching company data:', error);
      throw error;
    })
  );
  }
  //check for stock in portfolio
  checkInPortfolio():Observable<any>{
    return this.http.get(env+`/api/portfolio`).pipe(
    catchError(error => {
      console.error('Error fetching company data:', error);
      throw error;
    })
  );
  }

  async openModal(button:string,item:any){
    // let money
    this.ticker=item.name
    console.log("Ticker value",this.ticker)
    this.checkWallet().subscribe(data=>{
      
      console.log(data)
      const modalRef = this.modalService.open(NgbdModalContent);
      if(button=='buy')
        modalRef.componentInstance.fromBuy=true
      else
      modalRef.componentInstance.fromBuy=false

     modalRef.componentInstance.name=item.name
     modalRef.componentInstance.companyName=item.companyName
     modalRef.componentInstance.currentPrice=item.currentPrice
     modalRef.componentInstance.money=data.money
    
    })
      
    
    // this.checkWallet().then(data=>modalRef.componentInstance.money=data.money)
  }

}



@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	template: `
		<div class="modal-header d-flex">
      <p>{{name}}</p>

			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
    <form input-group>
    
		<div class="modal-body">
		  <p>Current Price: $ {{currentPrice}}</p>	
      <p>Money in Wallet: $ {{money}}</p>
      <div class="form-outline d-flex align-items-center">
      <label class="form-label" for="typeNumber">Qunatity: </label>  
      <input type="number" id="typeNumber" class="form-control ml-1" [(ngModel)]="quantity" (ngModelChange)="onQuantityChange($event)" name="quantity"/>
      
    </div>
    
    <p class="mt-2" *ngIf="!isValidPurch" style="color:red">Not enough money in wallet!</p>
    <p class="mt-2" *ngIf="!isValidSale" style="color:red">You cannot sell the stocks that you don't have!</p>
		</div>
		<div class="modal-footer">
    <p>Total: {{total| number : '1.2-2'}}</p>
    <button type="submit" class="btn btn-success"(click)="buy()"[disabled]="isDisabled" *ngIf="fromBuy">Buy</button>
    <button type="submit" class="btn btn-success"(click)="sell()"[disabled]="isDisabled" *ngIf="!fromBuy">Sell</button>
    </div>
    </form>
	`,
  imports: [
    FormsModule,
    CommonModule
  ],
})
export class NgbdModalContent {
  quantity:number=0
	activeModal = inject(NgbActiveModal);
  total:number=0
  isValidPurch:boolean=true
  isValidSale:boolean=true
  isDisabled=true
  showBuyAlert:boolean=false
  showSellAlert:boolean=false
	@Input() fromBuy: any;
  @Input() name: any;
  @Input() companyName: any;
  @Input() money: any;
  @Input() currentPrice: any;

  constructor(private companyDataAPI: CompanyDescriptionService, private http: HttpClient, private router: Router){}
  ngOnInit(){
    
    console.log("This the stock quantity",this.quantity)
  }
  onQuantityChange(value: number) {
    console.log("This the stock quantity",this.quantity)
    this.isDisabled=true
    this.total=this.quantity*this.currentPrice
    if(this.total){
      if(!this.fromBuy){
        this.checkInPortfolio(this.name).subscribe(data=>{
          if(data){
            console.log("this us the data quantity",data.qty)
            if(this.quantity<=data.qty){
              this.isValidSale=true
              this.isDisabled=false
            }
            else{
              this.isValidSale=false
              this.isDisabled=true
            }
          }
          // qtyInPortfolio=data.qty
        })
      }
      else{
        if(this.total<=this.money && this.total!=0){
          this.isValidPurch=true
          this.isDisabled=false
        }
        else{
          this.isValidPurch=false
          this.isDisabled=true
        }
      }
      
    }

    
    
  }

  //buy stock
  buyStock(stock:any,buy:string):Observable<any>{
    return this.http.post(env+`/api/portfolio?buy=${buy}`,stock).pipe(
      catchError(error => {
        console.error('Error fetching company data:', error);
        throw error;
      }),
    );
    
    // return response
  }
  //deete stock
  deleteStock(stock:any):Observable<any>{
    return this.http.delete(env+`/api/portfolio?symbol=${stock}`).pipe(
      catchError(error => {
        console.error('Error fetching company data:', error);
        throw error;
      }),
    );
    
    // return response
  }

  //update wwallet
  async updateWallet(stock:any){
    const response= this.http.post(env+`/api/wallet`,stock).pipe(
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

  //check for stock in portfolio
  checkInPortfolio(symbol:string):Observable<any>{
    return this.http.get(env+`/api/portfolio?symbol=${symbol}`).pipe(
    catchError(error => {
      console.error('Error fetching company data:', error);
      throw error;
    })
  );
  
  }


  buy(){
    this.activeModal.dismiss()
    let stock={
      name:this.name,
      companyName:this.companyName,
      qty:this.quantity,
      totalCost:this.quantity*this.currentPrice,
      avgCost:this.total/this.quantity
    }

    let updateMoney={
      name:'wallet',
      money:this.money-(this.quantity*this.currentPrice)
    }
    this.updateWallet(updateMoney)


    this.buyStock(stock,"true").subscribe(data=>{
      console.log("this is data",data)
      this.companyDataAPI.setBuyAlertPort({ticker:this.name,flag:true});
    this.companyDataAPI.setSellAlertPort({ticker:this.name,flag:false});
      // this.showBuyAlert=true
      // this.showBuyAlert=true
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl, { replaceUrl: true });
      });
    })

    
    // // this.showBuyAlert=true
    // // this.showBuyAlert=true
    // const currentUrl = this.router.url;
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    // this.router.navigateByUrl(currentUrl, { replaceUrl: true });
    // });
    
    
  }

  sell(){
    this.activeModal.dismiss()
    let qtyInPortfolio
    this.checkInPortfolio(this.name).subscribe(data=>{
      if(data){
        qtyInPortfolio=data.qty

        if(qtyInPortfolio)
          console.log("quantinty in portfolio",qtyInPortfolio)
          console.log("quantinty in portfolio",qtyInPortfolio-this.quantity)
        let stock={
          name:this.name,
          companyName:this.companyName,
          qty:this.quantity,
          totalCost:0
          // totalCost:data.totalCost-this.quantity*this.currentPrice,
          // avgCost:(data.totalCost-this.quantity*this.currentPrice)/(qtyInPortfolio-this.quantity)
        }

        let updateMoney={
          name:'wallet',
          money:this.money+(this.quantity*this.currentPrice)
        }
        
        
          this.updateWallet(updateMoney)
        
        
        console.log(stock)
        if(qtyInPortfolio-this.quantity==0){
          //delete teh stock from portfolio
          
          this.deleteStock(this.name).subscribe(data=>{
            this.companyDataAPI.setBuyAlertPort({ticker:this.name,flag:false});
            this.companyDataAPI.setSellAlertPort({ticker:this.name,flag:true});
            // this.showBuyAlert=true
            // this.showBuyAlert=true
            const currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl, { replaceUrl: true });
            });
          })
        }
        else{
        
        this.buyStock(stock,"false").subscribe(data=>{
          this.companyDataAPI.setBuyAlertPort({ticker:this.name,flag:false});
          this.companyDataAPI.setSellAlertPort({ticker:this.name,flag:true});
          // this.showBuyAlert=true
          // this.showBuyAlert=true
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(currentUrl, { replaceUrl: true });
          });
        })
      }

       
        // this.showBuyAlert=true
        // this.showBuyAlert=true

      }
      // qtyInPortfolio=data.qty
    })
    
    
    // this.activeModal.dismiss()
  }
  
}
