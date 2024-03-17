import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router, ActivatedRoute} from '@angular/router';
import {CompanyDescriptionService} from '../services/company-description.service'
@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent {
watchlist:any
watchListData:any=[]
isEmpty:boolean=false
isLoading:boolean=true
constructor(private http: HttpClient,private route: ActivatedRoute,
  private router: Router, private companyDataApi: CompanyDescriptionService){
  
}

async ngOnInit() {
  this.isLoading=true
  try {
    this.watchlist = await new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve(this.checkInWatchList());
      }, 1000);
    });
    // setTimeout(() => {
      
    // }, 10000);
    // console.log(this.watchlist);
    if (this.watchlist) {
      for (let item in this.watchlist) {
        this.companyDataApi.getCompanyPrice(this.watchlist[item].name).subscribe(data=>{
          this.watchListData.push({
            name:this.watchlist[item].name,
            companyName:this.watchlist[item].companyName,
            c:data.c,
            d:data.d,
            dp:data.dp
          })
          // console.log(data)
        })
      }
      console.log(this.watchListData);
      this.isEmpty=false
      this.isLoading=false
    } else {
      console.log("Watchlist is empty");
      this.isEmpty=true
      this.isLoading=false
    }
  } catch (error) {
    console.error("Error fetching watchlist:", error);
  }
}

async checkInWatchList() {
  return new Promise<any>((resolve, reject) => {
    this.http.get('http://localhost:3000/api/watchlist').subscribe(
      (data) => {
        if (Object.keys(data).length > 0) {
          console.log("Watchlist data received:", data);
          resolve(data);
        } else {
          console.log("Watchlist is empty");
          resolve(null);
        }
      },
      (error) => {
        console.error('Error fetching watchlist:', error);
        reject(error);
      }
    );
  });
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

removeItem(removedItem:any){
  console.log(removedItem.name)
  this.watchListData = this.watchListData.filter((item:any) => item!=removedItem);
  this.deleteFromWatchList(removedItem.name)
  if(this.watchListData.length==0){
    this.isEmpty=true
  }
  // console.log(this.watchListData)
}

redirect(item:any){
  this.router.navigate(['/search', item.name]);
}
}

