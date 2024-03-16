import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{ AppComponent } from './app.component'
import {ContentComponent} from './content/content.component'
import {WatchlistComponent} from './watchlist/watchlist.component'
import { StockDetailsComponent } from './stock-details/stock-details.component'
import { SearchBarComponent } from './search-bar/search-bar.component';
const routes: Routes = [
  // Default route redirected to '/search/home'
  { path: '', redirectTo: '/search/home', pathMatch: 'full' },
  
  // // Search Details Route with a parameterized path
  // { path: 'search/:ticker', component: SearchDetailsComponent },

  // Home Route
  { path: 'search', component: SearchBarComponent, 
    children:[
      {
        path: 'home',
        component:SearchBarComponent
  
      },
    {
      path: ':query',
      component:ContentComponent

    }
  ]
},
  // { path: 'search/:query', component: SearchBarComponent },
  {path: 'watchlist',component:WatchlistComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
