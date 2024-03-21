import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{ AppComponent } from './app.component'
import {ContentComponent} from './content/content.component'
import {WatchlistComponent} from './watchlist/watchlist.component'
import { StockDetailsComponent } from './stock-details/stock-details.component'
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
const routes: Routes = [
  // Default route redirected to '/search/home'
  { path: '', redirectTo: 'search/home', pathMatch: 'full' },
  
  // // Search Details Route with a parameterized path
  // { path: 'search/:ticker', component: SearchDetailsComponent },

  // Home Route
  { path: 'search', component: SearchBarComponent, 
    children:[
      {
        path: ':query',
        component:ContentComponent
  
      },
      {
        path: 'home',
        component:SearchBarComponent
  
      }
    
  ]
},
// {path:'search', component:SearchBarComponent},
// {path:'search/home', component:SearchBarComponent},
// {path:'search/:query', component:SearchBarComponent},
{path:'search/:query', component:ContentComponent},
  // { path: 'search/:query', component: SearchBarComponent },
  {path: 'watchlist',component:WatchlistComponent},
  {path: 'portfolio',component:PortfolioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
