import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, tap, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';
import { objectEach } from 'highcharts';
import { format } from 'date-fns';
import { env } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyDescriptionService {

  private cachedData: Map<string, any> = new Map<string, any>();

  private companyDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private companyPriceDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private companyPeersDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private companyNewsDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private inputTicker: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private newsModal: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private companyHistoricalData:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private companyHourlyData:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private companyRecommendationData:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private companyEarningsData:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private companySentimentsData:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private showContent:BehaviorSubject<any> = new BehaviorSubject<any>(false);
  private buyAlert:BehaviorSubject<any> = new BehaviorSubject<any>({ticker:"",flag:false});
  private sellAlert:BehaviorSubject<any> = new BehaviorSubject<any>({ticker:"",flag:false});


  private buyAlertPort:BehaviorSubject<any> = new BehaviorSubject<any>({ticker:"",flag:false});
  private sellAlertPort:BehaviorSubject<any> = new BehaviorSubject<any>({ticker:"",flag:false});


  private showSellButton:BehaviorSubject<any> = new BehaviorSubject<any>(false);
  // private showContent:BehaviorSubject<any> = new BehaviorSubject<any>(false);
  constructor(private http: HttpClient, private dialog: MatDialog) { }

  // Company Details HTTP Call
  getCompanyData(symbol: string): Observable<any> {
    return this.http.get(env+`/api/company_description?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company data:', error);
        throw error;
      })
    );
  }

  // Company Price HTTP Call
  getCompanyPrice(symbol: string): Observable<any> {
    return this.http.get(env+`/api/company_latest_price?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company price:', error);
        throw error;
      })
    );
  }

  // Company Peers HTTP Call
  getCompanyPeers(symbol: string): Observable<any> {
    return this.http.get(env+`/api/company_peers?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company price:', error);
        throw error;
      })
    );
  }

  // Company News HTTP Call
  getCompanyNews(symbol: string): Observable<any> {
    return this.http.get(env+`/api/company_news?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company price:', error);
        throw error;
      })
    );
  }

  // Company Historical Data HTTP Call
  getCompanyHistoricalData(symbol: string): Observable<any> {
    return this.http.get(env+`/api/company_historical_data?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company Historical data:', error);
        throw error;
      })
    );
  }

  // Company Historical Data HTTP Call
  getCompanyHourlyData(symbol: string, from:string,to:string): Observable<any> {
    return this.http.get(env+`/api/company_hourly_data?symbol=${symbol}&from=${from}&to=${to}`).pipe(
      catchError(error => {
        console.error('Error fetching company Hourly data:', error);
        throw error;
      })
    );
  }

  // Company Recommendation Data HTTP Call
  getCompanyRecommendationData(symbol: string): Observable<any> {
    return this.http.get(env+`/api/company_recommendation_trends?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company recommendation data:', error);
        throw error;
      })
    );
  }

  // Company Earnings Data HTTP Call
  getCompanyEarningsData(symbol: string): Observable<any> {
    return this.http.get(env+`/api/company_earnings?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company recommendation data:', error);
        throw error;
      })
    );
  }

  // Company Earnings Data HTTP Call
  getCompanySentimentsData(symbol: string): Observable<any> {
    return this.http.get(env+`/api/company_insider_sentiments?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company sentiments data:', error);
        throw error;
      })
    );
  }

  // Company Autocomplete Data HTTP Call
  getCompanyAutocompleteData(symbol: string): Observable<any> {
    // this.http.get(`http://localhost:3000/api/company_autocomplete?symbol=${symbol}`).subscribe(data => console.log(data))
    return this.http.get(env+`/api/company_autocomplete?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company autocomplete data:', error);
        throw error;
      })
    );
  }
  

  // Fetch data from both APIs
  fetchData(symbol: string): Observable<[any, any, any, any, any, any, any, any, any]> {
    
    // if(!this.cachedData.has(symbol)){
      if (this.cachedData.has(symbol)) {
        console.log("Returning from chance")
        return of(this.cachedData.get(symbol));
      } else {
        console.log("Making API CAlls")
      const companyData$ = this.getCompanyData(symbol);
      const companyPrice$ = this.getCompanyPrice(symbol);
      const companyPeers$ = this.getCompanyPeers(symbol);
      const companyNews$ = this.getCompanyNews(symbol);
      const companyHistoricalData$ = this.getCompanyHistoricalData(symbol);
      
      let aDayBeforeFormatted:string=""
      let todayFormatted:string=""
      // let companyHourlyData$:any
      
      const companyHourlyData$ = companyPrice$.pipe(
        switchMap((data) => {
          const stockTimestamp = data.t * 1000;
          const currTime = Date.now();
          const diffTime = (currTime - stockTimestamp) / (1000 * 60);
  
          let aDayBeforeFormatted: string = "";
          let todayFormatted: string = "";
  
          if (diffTime < 5) {
            console.log("Plot graph from current to last date");
            let aDayBefore = new Date(currTime);
            aDayBefore.setDate(aDayBefore.getDate() - 1);
            // aDayBeforeFormatted = format(aDayBefore.toLocaleString(), 'yyyy-MM-dd');
            aDayBeforeFormatted = new Intl.DateTimeFormat("fr-CA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(aDayBefore);
            let today = new Date(currTime);
            // todayFormatted = format(today.toLocaleString(), 'yyyy-MM-dd');
            todayFormatted = new Intl.DateTimeFormat("fr-CA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(today);
          } else {
            console.log("Plot graph from closeDate to last date");

            // const formattedDate = new Intl.DateTimeFormat("fr-CA", {
            //   year: "numeric",
            //   month: "2-digit",
            //   day: "2-digit",
            // }).format(date);


            let aDayBefore = new Date(stockTimestamp);
            aDayBefore.setDate(aDayBefore.getDate() - 1);

            aDayBeforeFormatted = new Intl.DateTimeFormat("fr-CA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(aDayBefore);
            console.log("INTL Date", aDayBeforeFormatted);
            // aDayBeforeFormatted = format(aDayBefore.toLocaleString(), 'yyyy-MM-dd');
            let today = new Date(stockTimestamp);
            // todayFormatted = format(today.toLocaleString(), 'yyyy-MM-dd');
            todayFormatted = new Intl.DateTimeFormat("fr-CA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(aDayBefore);
            console.log("to Date", todayFormatted);
            console.log("From Date", aDayBeforeFormatted);
          }
  
          return this.getCompanyHourlyData(symbol, aDayBeforeFormatted, todayFormatted);
        })
      );
  
      console.log("Handled the hourly charts case properly");
  
      const companyRecommendationData$ = this.getCompanyRecommendationData(symbol);
      const companyEarningsData$ = this.getCompanyEarningsData(symbol);
      const companySentimentsData$ = this.getCompanySentimentsData(symbol);
  
      
      return forkJoin([companyData$, companyPrice$, companyPeers$, companyNews$, companyHistoricalData$, companyHourlyData$, companyRecommendationData$, companyEarningsData$, companySentimentsData$])
      .pipe(
        tap(data => {
          // Store the fetched data in the cache
          this.cachedData.set(symbol, data);
        }),
        catchError(error => {
          // Handle errors if any
          console.error('Error fetching data:', error);
          return [];
        })
      );
  
    
      }
    
  }

  setChache(symbol:string,data:any){
    this.cachedData.set(symbol, data);
  }

  getChache(symbol:string){
    return this.cachedData.get(symbol);
  }
  // Set company data
  setCompanyData(data: any): void {
    this.companyDataSubject.next(data);
  }

  // Get company data observable
  getCompanyDataObservable(): Observable<any> {
    return this.companyDataSubject.asObservable();
  }

  // Set company price data
  setCompanyPriceData(data: any): void {
    this.companyPriceDataSubject.next(data);
  }

  // Get company price data observable
  getCompanyPriceDataObservable(): Observable<any> {
    return this.companyPriceDataSubject.asObservable();
  }
  
  // Set company peers data
  setCompanyPeersData(data: any): void {
    this.companyPeersDataSubject.next(data);
  }

  getCompanyPeerseDataObservable(): Observable<any> {
    return this.companyPeersDataSubject.asObservable();
  }

  //Set input Ticker
  setInputTicker(data: any): void {
    this.inputTicker.next(data);
  }

  getInputTicker(): Observable<any> {
    return this.inputTicker.asObservable();
  }

  // Get company price data observable
  getCompanyNewsDataObservable(): Observable<any> {
    return this.companyNewsDataSubject.asObservable();
  }
  
  // Set company peers data
  setCompanyNewsData(data: any): void {
    this.companyNewsDataSubject.next(data);
  }

  // Get company price data observable
  getNewsModal(): Observable<any> {
    return this.newsModal.asObservable();
  }
  
  // Set company peers data
  setNewsModal(data: any): void {
    console.log("Receieved data to set ",data)
    this.newsModal.next(data);
  }

  // Get company Historical data observable
  getCompanyHistoricalDataObservable(): Observable<any> {
    return this.companyHistoricalData.asObservable();
  }
  
  // Set company peers data
  setCompanyHistoricalData(data: any): void {
    this.companyHistoricalData.next(data);
  }

  getCompanyHourlyDataObservable(): Observable<any> {
    return this.companyHourlyData.asObservable();
  }
  
  // Set company peers data
  setCompanyHourlyData(data: any): void {
    this.companyHourlyData.next(data);
  }

  getCompanyRecommendationDataObservable(): Observable<any> {
    return this.companyRecommendationData.asObservable();
  }
  
  // Set company peers data
  setCompanyRecommendationData(data: any): void {
    this.companyRecommendationData.next(data);
  }

  getCompanyEarningsDataObservable(): Observable<any> {
    return this.companyEarningsData.asObservable();
  }
  
  // Set company peers data
  setCompanyEarningsData(data: any): void {
    this.companyEarningsData.next(data);
  }

  getCompanySentimentsDataObservable(): Observable<any> {
    return this.companySentimentsData.asObservable();
  }
  
  // Set company peers data
  setCompanySentimentsData(data: any): void {
    this.companySentimentsData.next(data);
  }

  getShowContent(): Observable<any> {
    return this.showContent.asObservable();
  }
  
  // Set company peers data
  setShowContent(data: any): void {
    this.showContent.next(data);
  }


  getBuyAlert(): Observable<any> {
    return this.buyAlert.asObservable();
  }
  
  // Set company peers data
  setBuyAlert(data: any): void {
    this.buyAlert.next(data);
  }

  getSellAlert(): Observable<any> {
    return this.sellAlert.asObservable();
  }
  
  // Set company peers data
  setSellAlert(data: any): void {
    this.sellAlert.next(data);
  }

  getShowSellBtnt(): Observable<any> {
    return this.showSellButton.asObservable();
  }
  

  getBuyAlertPort(): Observable<any> {
    return this.buyAlertPort.asObservable();
  }
  
  // Set company peers data
  setBuyAlertPort(data: any): void {
    this.buyAlertPort.next(data);
  }

  getSellAlertPort(): Observable<any> {
    return this.sellAlertPort.asObservable();
  }
  
  // Set company peers data
  setSellAlertPort(data: any): void {
    this.sellAlertPort.next(data);
  }
  // Set company peers data
  setShowSellBtn(data: any): void {
    this.showSellButton.next(data);
  }

  // openDialog(content:any): void {
  //   // this.dialogRef = this.dialog.open(ModalComponent, {
  //   //   width: '400px',
  //   //   data:  content,
  //   // });
  //   // this.dialogRef.updatePosition({top:'0'})
  //   let modal=new ModalComponent()
  //   modal.open()
    
  // }

  // closeDialog(): void {
  //   if (this.dialogRef) {
  //     this.dialogRef.close();
  //   }
  // }
}

