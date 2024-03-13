import { Component } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service'
import { format } from 'date-fns';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css'
})
export class InsightsComponent {
  private recommendation:any
  private earnings:any
  totalMSPR:number=0
  posMSPR:number=0
  negMSPR:number=0
  totalChange:number=0
  posChange:number=0
  negChange:number=0
  symbol:any
  Highcharts_rec= Highcharts;

  chartOptions_rec: Highcharts.Options = {
  }

  Highcharts_eps= Highcharts;

  chartOptions_eps: Highcharts.Options = {
  }
    constructor(private companyDataAPI: CompanyDescriptionService) { }
    ngOnInit(): void {
    //Company Price
    this.companyDataAPI.getCompanyRecommendationDataObservable().subscribe(data => {
      if(data){
        this.recommendation=data
      }
    });
    console.log(this.recommendation[0].period)
    this.chartOptions_rec= {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Recommendation Trends',
          align: 'center'
      },
      xAxis: {
          categories: [this.recommendation[0].period.slice(0,-3), this.recommendation[1].period.slice(0,-3), this.recommendation[2].period.slice(0,-3), this.recommendation[3].period.slice(0,-3)]
      },
      yAxis: {
          min: 0,
          title: {
              text: '#Analysis',
              style:{textAlign:'center'}
          },
          stackLabels: {
              enabled: true
          }
      },
      legend: {
          // align: 'left',
          // x: 70,
          // verticalAlign: 'top',
          // y: 70,
          // floating: true,
          // backgroundColor:
          //     Highcharts.defaultOptions.legend.backgroundColor || 'white',
          // borderColor: '#CCC',
          // borderWidth: 1,
          shadow: false
      },
      tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}<br/>#Analysis: {point.stackTotal}'
      },
      plotOptions: {
          column: {
              stacking: 'normal',
              dataLabels: {
                  enabled: true
              }
          }
      },
      series: [{
          type: 'column',
          name: 'Strong Buy',
          data: [this.recommendation[0].strongBuy, this.recommendation[1].strongBuy, this.recommendation[2].strongBuy, this.recommendation[3].strongBuy],
          color:'#006630',
      }, {
          type: 'column',
          name: 'Buy',
          data: [this.recommendation[0].buy, this.recommendation[1].buy, this.recommendation[2].buy, this.recommendation[3].buy],
          color:'#13c253',
      },
        {
          type: 'column',
          name: 'Hold',
          data: [this.recommendation[0].hold, this.recommendation[1].hold, this.recommendation[2].hold, this.recommendation[3].hold],
          color:'#bd6c0f'
      },{
        type: 'column',
        name: 'Sell',
        data:[this.recommendation[0].sell, this.recommendation[1].sell, this.recommendation[2].sell, this.recommendation[3].sell],
        
        color:'#ff8d01'
    },{
      type: 'column',
      name: 'Strong Sell',
      data: [this.recommendation[0].strongSell, this.recommendation[1].strongSell, this.recommendation[2].strongSell, this.recommendation[3].strongSell],
      color:'#990c2a'
  },]
  }

  this.companyDataAPI.getCompanyEarningsDataObservable().subscribe(data => {
    if(data){
      
      for(let i=0; i<data.length; i++){
        Object.entries(data[i]).forEach((entry) => {
          const [key, value] = entry;
          if(value==null){
            console.log("Changed null")
            data[i].key=0
          }
          // console.log(`${key}: ${value}`);
        });
      }
      this.earnings=data
    }
  });

  let actual=[]
  let estimate=[]
  for(let i=0; i<this.earnings.length; i++){
    actual.push([this.earnings[i].period,this.earnings[i].actual])
    estimate.push([this.earnings[i].period,this.earnings[i].estimate])
  }

  this.chartOptions_eps={
    chart: {
        type: 'spline',
        // inverted: true
        
    },
    title: {
        text: 'Atmosphere Temperature by Altitude',
        align: 'center'
    },
    // subtitle: {
    //     text: 'According to the Standard Atmosphere Model',
    //     align: 'left'
    // },
    xAxis: {
        reversed: false,
        title: {
            // enabled: true,
        },
        categories:[`${this.earnings[0].period}<br>Surprise: ${this.earnings[0].surprise}`,`${this.earnings[1].period}<br>Surprise: ${this.earnings[1].surprise}`,`${this.earnings[2].period}<br>Surprise: ${this.earnings[2].surprise}`,`${this.earnings[3].period}<br>Surprise: ${this.earnings[3].surprise}`],
        
        // accessibility: {
        //     rangeDescription: 'Range: 0 to 80 km.'
        // },
        // maxPadding: 0.05,
        
        showLastLabel: true
    },
    yAxis: {
        title: {
            text: 'Quaterly EPS'
        },
        labels: {
            format: '{value}'
        },
        // accessibility: {
        //     rangeDescription: 'Range: -90°C to 20°C.'
        // },
        lineWidth: 2
    },
    legend: {
        enabled: true
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: 'Quaterly EPS: {point.y}'
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: true
            }
        }
    },
    series: [{
        type:'spline',
        name: 'Actual',
        data: actual
    },
    {
      type:'spline',
      name: 'Estimate',
      data: estimate
  }]
}
this.companyDataAPI.getCompanySentimentsDataObservable().subscribe(data => {
  if(data){
    this.symbol=data.symbol
    data=data.data
    for(let i=0; i<data.length; i++){
      console.log(data[i].mspr)
      this.totalMSPR+=data[i].mspr
      if(data[i].mspr>=0){
       this.posMSPR+=data[i].mspr
      }
      else if(data[i].mspr<0){
        this.negMSPR+=data[i].mspr
       }
      
      this.totalChange+=data[i].change
      if(data[i].change>=0){
       this.posChange+=data[i].change
      }
      else if(data[i].change<0){
        this.negChange+=data[i].change
       }

    }
    this.totalMSPR=Math.round(this.totalMSPR*100/data.length)/100
    this.posMSPR= Math.round(this.posMSPR*100/data.length)/100
    this.negMSPR=Math.round(this.negMSPR*100/data.length)/100
    this.totalChange=Math.round(this.totalChange*100/data.length)/100
    this.posChange=Math.round(this.posChange*100/data.length)/100
    this.negChange=Math.round(this.negChange*100/data.length)/100
    console.log("total Change",this.totalChange)
  }
})
  }
}
