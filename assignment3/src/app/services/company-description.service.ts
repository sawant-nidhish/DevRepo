import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CompanyDescriptionService {

  private companyDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private companyPriceDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private companyPeersDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private companyNewsDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private inputTicker: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private newsModal: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private companyHistoricalData:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient, private dialog: MatDialog) { }

  // Company Details HTTP Call
  getCompanyData(symbol: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/company_description?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company data:', error);
        throw error;
      })
    );
  }

  // Company Price HTTP Call
  getCompanyPrice(symbol: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/company_latest_price?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company price:', error);
        throw error;
      })
    );
  }

  // Company Peers HTTP Call
  getCompanyPeers(symbol: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/company_peers?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company price:', error);
        throw error;
      })
    );
  }

  // Company News HTTP Call
  getCompanyNews(symbol: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/company_news?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company price:', error);
        throw error;
      })
    );
  }

  // Company Historical Data HTTP Call
  getCompanyHistoricalData(symbol: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/company_historical_data?symbol=${symbol}`).pipe(
      catchError(error => {
        console.error('Error fetching company Historical data:', error);
        throw error;
      })
    );
  }

  // Fetch data from both APIs
  fetchData(symbol: string): Observable<[any, any, any, any, any]> {
    const companyData$ = this.getCompanyData(symbol);
    const companyPrice$ = this.getCompanyPrice(symbol);
    const companyPeers$ = this.getCompanyPeers(symbol);
    const companyNews$ = this.getCompanyNews(symbol);
    const companyHistoricalData$ = this.getCompanyHistoricalData(symbol);
    return forkJoin([companyData$, companyPrice$, companyPeers$, companyNews$, companyHistoricalData$]);
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

