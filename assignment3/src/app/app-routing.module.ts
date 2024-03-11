import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{ AppComponent } from './app.component'
import {ContentComponent} from './content/content.component'
import { StockDetailsComponent } from './stock-details/stock-details.component'
const routes: Routes = [
  // Default route redirected to '/search/home'
  { path: '', redirectTo: '/search/home', pathMatch: 'full' },
  
  // // Search Details Route with a parameterized path
  // { path: 'search/:ticker', component: SearchDetailsComponent },

  // Home Route
  { path: 'search/home', component: AppComponent },
  { path: 'search/:query', component: ContentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
