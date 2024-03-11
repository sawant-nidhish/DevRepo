import { Component, OnDestroy } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnDestroy {
  inputTicker: string = '';
  isInvalidTicker: boolean = false;
  isEmptyTicker: boolean = false;
  isLoading: boolean = false;
  showContent: boolean = false;
  private timerSubscription: Subscription | undefined;
  constructor(private companyDataAPI: CompanyDescriptionService, private router: Router, private route: ActivatedRoute,) {}

  ngOnInit(): void {
    this.companyDataAPI.getInputTicker().subscribe(data=>this.inputTicker=data)
    // this.route.params.subscribe(params => {
    //   console.log("Ng on inint is called",params['query'])
    //   this.inputTicker = params['query'] || '';
    // });
  }

  getData(): void {
    //add the route call here so that when some thing is searched the app redirects to that route
    this.showContent = false;
    this.isInvalidTicker = false;
    this.isEmptyTicker = false;
    this.isEmptyTicker = this.inputTicker.length === 0;

    if (!this.isEmptyTicker) {
      
      this.showContent=true
      if (this.inputTicker.trim() !== '') {
        // this.loadingService.setIsLoading(true);
        this.router.navigate(['/search', this.inputTicker]);
      }

      // this.isLoading = true;

      // this.companyDataAPI.fetchData(this.inputTicker).subscribe({
      //   next: ([companyData, companyPrice, companyPeers]) => {
      //     if (Object.keys(companyData).length === 0 || Object.keys(companyPrice).length === 0) {
      //       this.isInvalidTicker = true;
      //       this.isLoading = false;
      //       this.showContent = false;
            
      //     } else {
      //       this.companyDataAPI.setCompanyData(companyData);
      //       this.companyDataAPI.setCompanyPriceData(companyPrice);
      //       this.companyDataAPI.setCompanyPeersData(companyPeers);

      //       this.isLoading = false;
      //       this.showContent = true;
      //       // Call the API every 15 seconds
      //       this.timerSubscription = timer(15000, 15000)
      //         .pipe(
      //           switchMap(() => this.companyDataAPI.fetchData(this.inputTicker))
      //         )
      //         .subscribe({
      //           next: ([updatedCompanyData, updatedCompanyPrice, updatedCompanyPeers]) => {
      //             // Update the company data and price
      //             this.companyDataAPI.setCompanyData(updatedCompanyData);
      //             this.companyDataAPI.setCompanyPriceData(updatedCompanyPrice);
      //             this.companyDataAPI.setCompanyPeersData(updatedCompanyPeers);

      //             console.log("Called the data");
      //           },
      //           error: error => {
      //             console.error('Error fetching updated data:', error);
      //           }
      //         });
      //     }
      //   },
      //   error: error => {
      //     console.error('Error fetching data:', error);
      //     this.isLoading = false;
      //   }
      // });
    } else {
      this.isInvalidTicker = false;
      this.showContent = false;
    }
  }
  ngOnDestroy(): void {
    // Unsubscribe from the timer subscription when the component is destroyed
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
