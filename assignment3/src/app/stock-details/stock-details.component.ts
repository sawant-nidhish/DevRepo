// stock-details.component.ts
import { Component, OnInit, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service'
import { format } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { computeStyles } from '@popperjs/core';
import { Router, ActivatedRoute} from '@angular/router';
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

  //star button
  isSelected=false
  starColor=""
  addToWatchlist=false
  rmFromWatchlist=false

  //buy and sell button
  showBuyBtn:boolean=false
  showSellBtn:boolean=false
  money:any
  quantity:number=0
  buyAlert:any={ticker:"",flag:false}
  sellAlert:any={ticker:"",flag:false}
  private modalService = inject(NgbModal);
  constructor(private companyDataAPI: CompanyDescriptionService, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.companyDataAPI.getBuyAlert().subscribe(data=>this.buyAlert=data)
      this.companyDataAPI.getSellAlert().subscribe(data=>this.sellAlert=data)
      this.companyDataAPI.getShowSellBtnt().subscribe(data=>this.showSellBtn=data)

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
      console.log("Checking if the ticker is present in the wathclist")
      this.checkInWatchList(this.ticker.toUpperCase())
      this.checkInPortfolio(this.ticker.toUpperCase())
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
    })

  }

  checkInWatchList(symbol:string){
    let response=this.http.get(`http://localhost:3000/api/watchList?symbol=${symbol}`).pipe(
    catchError(error => {
      console.error('Error fetching company data:', error);
      throw error;
    })
  );
  response.subscribe(data=>{
    console.log("This is the data from the wathclist endpoint",data)
    if(data){
      console.log("$$$$$$%%%%%%%Data is presetn in wathlist")
      this.isSelected=true
      this.starColor="yellow"
    }
    else{
      console.log("$$$$$$$%%%%%%%Data is nott presetn in wathlist")
      this.isSelected=false
      this.starColor=""
    }
  })
  }

   async addToWatchList(stock:any){
    const response= this.http.post(`http://localhost:3000/api/watchList`,stock).pipe(
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
    const response=this.http.delete(`http://localhost:3000/api/watchList?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company data:', error);
        throw error;
      })
    );
    response.subscribe(data=>{
      console.log("This is the data from the wathclist endpoint",data)
    });
  }
  
  //check for stock in portfolio
  checkInPortfolio(symbol:string){
    let response=this.http.get(`http://localhost:3000/api/portfolio?symbol=${symbol}`).pipe(
    catchError(error => {
      console.error('Error fetching company data:', error);
      throw error;
    })
  );
  response.subscribe(data=>{
    console.log("This is the data from the portfolio endpoint",data)
    if(data){
      this.showSellBtn=true
      // this.starColor="yellow"
    }
    else{
      this.showSellBtn=false
      // this.starColor=""
    }
  })
  }

  

 checkWallet():Observable<any>{
    return this.http.get(`http://localhost:3000/api/wallet`).pipe(
    catchError(error => {
      console.error('Error fetching company data:', error);
      throw error;
    })
  );
  // response.subscribe(data=>{
  //   console.log("This is the data from the wallet endpoint",data)
  //   this.money=data
  //   return data
  // })
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

  async openModal(button:string){
    // let money
    this.checkWallet().subscribe(data=>{
    
      console.log(data)
      const modalRef = this.modalService.open(NgbdModalContent);
      if(button=='buy')
        modalRef.componentInstance.fromBuy=true
      else
      modalRef.componentInstance.fromBuy=false

     modalRef.componentInstance.name=this.ticker
     modalRef.componentInstance.companyName=this.companyName
     modalRef.componentInstance.currentPrice=this.lastPrice
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
		<div class="modal-footer d-flex justify-content-between">
    <p>Total: {{total}}</p>
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

  constructor(private companyDataAPI: CompanyDescriptionService, private http: HttpClient){}
  ngOnInit(){
    
    console.log(this.quantity)
  }
  onQuantityChange(value: number) {
    this.isDisabled=true
    this.total=this.quantity*this.currentPrice
    if(this.total){
      if(!this.fromBuy){
        this.checkInPortfolio(this.name).subscribe(data=>{
          if(data){
            console.log(data.qty)
            if(this.total<=this.money && this.total!=0 && this.quantity<=data.qty){
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
  async buyStock(stock:any,buy:string){
    const response= this.http.post(`http://localhost:3000/api/portfolio?buy=${buy}`,stock).pipe(
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

  //update wwallet
  async updateWallet(stock:any){
    const response= this.http.post(`http://localhost:3000/api/wallet`,stock).pipe(
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
    return this.http.get(`http://localhost:3000/api/portfolio?symbol=${symbol}`).pipe(
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


    this.buyStock(stock,"true").then(data=>{
      
    })

    this.companyDataAPI.setBuyAlert({ticker:this.name,flag:true});
    this.companyDataAPI.setSellAlert({ticker:this.name,flag:false});
    this.companyDataAPI.setShowSellBtn(true);
    // this.showBuyAlert=true
    // this.showBuyAlert=true

    
    // this.activeModal.dismiss()

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
        this.buyStock(stock,"false").then(data=>{
          
        })

        this.companyDataAPI.setBuyAlert({ticker:this.name,flag:false});
        this.companyDataAPI.setSellAlert({ticker:this.name,flag:true});
        if(data.qty==this.quantity)
          this.companyDataAPI.setShowSellBtn(false);
        else
          this.companyDataAPI.setShowSellBtn(true);
        // this.showBuyAlert=true
        // this.showBuyAlert=true

      }
      // qtyInPortfolio=data.qty
    })
    
    
    // this.activeModal.dismiss()
  }
  
}
