import { Component } from '@angular/core';
// import * as Highcharts from 'highcharts/highstock';
import { CompanyDescriptionService } from '../services/company-description.service'
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_indicators from 'highcharts/indicators/indicators'; // Import Highcharts indicators module
import HC_vbp from 'highcharts/indicators/volume-by-price'; // Import Highcharts VB
import HC_candlestick from 'highcharts/modules/stock';
import HC_stockTools from 'highcharts/modules/stock-tools';
import { isPlatformBrowser } from '@angular/common';
import{PLATFORM_ID, Inject} from '@angular/core';

import { platform } from 'os';
// HC_exporting(Highcharts);
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent {
  
  constructor(private companyDataAPI: CompanyDescriptionService, @Inject(PLATFORM_ID) private platformId: Object){
    if(isPlatformBrowser(this.platformId)){
      HC_exporting(Highcharts);
      HC_indicators(Highcharts);
      HC_vbp(Highcharts);
      HC_candlestick(Highcharts);
    }
    
  }
Highcharts= Highcharts;

chartOptions: Highcharts.Options = {
  
}
ngOnInit(){
  
  this.companyDataAPI.getCompanyHistoricalDataObservable().subscribe(data => {
    if(data){
      console.log("Chart results",data)
        let results=data['results']
        // let results=data
        let ohlc=[]
        let volume=[]
        
        for (let i = 0; i < results.length; i += 1) {
          ohlc.push([
            results[i]['t'], // the date
            results[i]['o'], // open
            results[i]['h'], // high
            results[i]['l'], // low
            results[i]['c'] // close
            // results[i]['0'], // the date
            // results[i]['1'], // open
            // results[i]['2'], // high
            // results[i]['3'], // low
            // results[i]['4'] // close
          ]);
          if(results[i]['v']==undefined)
              console.log("Undefined")
          volume.push([
            results[i]['t'], // the date
            results[i]['v'] // the volume
            // results[i]['0'], // the date
            // results[i]['5'] // the volume
            
          ]);
      }
      const groupingUnits: [string, number[] | null][] = [
        ['week', [1]],
        ['month', [1, 2, 3, 4, 6]]
      ];
      console.log("OHLC",ohlc) 
      console.log("Volume",volume)  

      const ohlcSeries: Highcharts.SeriesOptionsType = {
        type: 'candlestick',
        name: 'OHLC',
        data: ohlc
      };

      // Create the Volume series
      const volumeSeries: Highcharts.SeriesOptionsType = {
        type: 'column',
        name: 'Volume',
        data: volume,
        yAxis: 1
      };

      this.chartOptions = {

          // rangeSelector: {
          //     selected: 2
          // },
  
          title: {
              text: data.ticker + ' Historical'
          },
  
          subtitle: {
              text: 'With SMA and Volume by Price technical indicators'
          },
          navigator: {
            enabled: true // Enable the navigator (zoom bar)
        },
        chart:{
          height:'60%'
        },
        stockTools: {
          gui: {
            enabled: true,
            buttons: ['rangeSelector', 'datepicker'] // Add 'datepicker' button
          }
        },
          xAxis:{
            type:'datetime',
            range: 6 * 30 * 24 * 3600 * 1000 // six months
          },
          yAxis: [{
              startOnTick: false,
              endOnTick: false,
              labels: {
                  align: 'right',
                  x: -3
              },
              title: {
                  text: 'OHLC'
              },
              height: '60%',
              lineWidth: 2,
              resize: {
                  enabled: true
              }
          }, {
              labels: {
                  align: 'right',
                  x: -3
              },
              title: {
                  text: 'Volume'
              },
              top: '65%',
              height: '35%',
              offset: 0,
              lineWidth: 2
          }],
  
          tooltip: {
              split: true
          },

          rangeSelector: {
            selected: 0, // Set the initially selected range (e.g., 2 for 1 month)
            enabled:true,
            inputEnabled: true, // Disable manual date range input
            buttons: [
                {
                    type: 'month',
                    count: 1,
                    text: '1m'
                },
                {
                  type: 'month',
                  count: 3,
                  text: '3m'
              },
              {
                type: 'month',
                count: 6,
                text: '6m'
            },
            {
                type: 'ytd', // Year to date
                text: 'YTD'
            },
            {
                type: 'all', // Show entire data range
                text: 'All'
            }
            ]
        },
          series: [{
              type: 'candlestick',
              name: data.ticker,
              id: "OHLC",
              zIndex: 2,
              pointWidth:5,
              data: ohlc
          }, {
              type: 'column',
              name: 'Volume',
              id: 'volume',
              data: volume,
              yAxis: 1
          }, {
              type: 'vbp',
              linkedTo: "OHLC",
              params: {
                  volumeSeriesID: 'volume'
              },
              dataLabels: {
                  enabled: false
              },
              zoneLines: {
                  enabled: false
              }
          }, {
              type: 'sma',
              linkedTo: "OHLC",
              zIndex: 1,
              marker: {
                  enabled: false
              }
          }]
      }
      }
      
    }
    )
}
}
