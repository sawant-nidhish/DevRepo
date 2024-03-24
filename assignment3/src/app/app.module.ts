import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AlertsComponent } from './alerts/alerts.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { TabsContentComponent } from './tabs-content/tabs-content.component';
import {MatTabsModule} from '@angular/material/tabs';
import { SummaryComponent } from './summary/summary.component';
import { RouterModule, Routes} from '@angular/router';
import { ContentComponent } from './content/content.component';
import { NewsComponent} from './news/news.component';
import {MatDialogModule} from '@angular/material/dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ChartsComponent} from './charts/charts.component';
import { HighchartsChartModule } from 'highcharts-angular';
import {CommonModule} from '@angular/common';
import { InsightsComponent } from './insights/insights.component'
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { TestComponent } from './test/test.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

// import{NgbdModalComponent} from '../app/ng-modal/ng-modal.component'
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SearchBarComponent,
    AlertsComponent,
    StockDetailsComponent,
    TabsContentComponent,
    SummaryComponent,
    ContentComponent,
    ChartsComponent,
    InsightsComponent,
    WatchlistComponent,
    PortfolioComponent,
    
    
    // HighchartsChartComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    RouterModule,
    MatDialogModule,
    NgbModule,
    HighchartsChartModule,
    NewsComponent,
    // NgbdModalComponent,
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    TestComponent
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
