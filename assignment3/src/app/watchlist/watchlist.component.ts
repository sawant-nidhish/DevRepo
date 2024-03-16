import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent {
watchlist:any
constructor(private http: HttpClient){
  
}

ngOnInit(){
  this.checkInWatchList()  
}

checkInWatchList(){
  let response=this.http.get(`http://localhost:3000/api/watchlist`).pipe(
  catchError(error => {
    console.error('Error fetching company data:', error);
    throw error;
  })
);
response.subscribe(data=>{
  if(Object.keys(data).length>0){
    this.watchlist=data
  }
  else{
    
  }
    console.log("This is the data from the wathclist endpoint",Object.keys(data).length)
  
})
}

deleteFromWatchList(){
  const response=this.http.delete(`http://localhost:3000/api/watchlist?symbol="AAPL"`).pipe(
    catchError(error => {
      console.error('Error fetching company data:', error);
      throw error;
    })
  );
  response.subscribe(data=>{
    console.log("This is the data from the wathclist endpoint",data)
  });
}
}

