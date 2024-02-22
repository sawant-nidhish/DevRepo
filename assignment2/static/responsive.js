function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}

function hideContent(){
  document.querySelector('.tab_container').style.display='none';
  document.querySelector('.error').style.display='flex';
}

function showContent(){
  document.querySelector('.tab_container').style.display='flex';
  document.querySelector('.error').style.display='none';
}

// This code is the show and hide the tabs
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

function clearScreen(event){
  document.querySelector('.tab_container').style.display="none";
  document.querySelector('.error').style.display="none";
  document.getElementById('ticker').value="";
}
// Code to send the Ticker to flask proxy after the search button is clicked
async function getStock(event){
  
  var search_bar=document.getElementById('ticker');

  // search_bar.value;
  let ticker=search_bar.value
  if(ticker.trim()==""){
    return false;
  }
  event.preventDefault();
  console.log("Printing the ticker value",ticker);
    //Fetch company data
  fetch(`/company?ticker=${ticker}`)
  .then(function(data){ 
    console.log(data)
    return data.json()})
  .then(function(json){
    if(isEmpty(json)){
      //Do some thing to the html
      hideContent();
      console.log("Empty JSON")
      // document.querySelector('#Company').innerHTML=json["ticker"];
    }
    else{
      //display in inner html of company tab
      showContent();
      
      let children = document.querySelector("#company_table").children[0].children;
      console.log("#####first child",children); 
      document.querySelector("#logo").innerHTML=`<img class="logo_img" src="${json['logo']}">`;
      console.log(json);
      for(var i=0; i<children.length; i++){
        if(children[i].id=='company_name'){
          children[i].children[1].innerHTML=json['name'];
        }
        if(children[i].id=='stock_ticker_symbol'){
          children[i].children[1].innerHTML=json['ticker'];
        }
        if(children[i].id=='stock_exchange_code'){
          children[i].children[1].innerHTML=json['exchange'];
        }
        if(children[i].id=='company_ipo_date'){
          children[i].children[1].innerHTML=json['ipo'];
        }
        if(children[i].id=='category'){
          children[i].children[1].innerHTML=json['finnhubIndustry'];
        }
      }
      
    }
    console.log("Type of object "+ isEmpty(json))
    return json;
  })
  .catch(err=>console.log(err));


  //Summary tab data
  fetch(`/summary?ticker=${ticker}`)
  .then(function(data){ 
    console.log(data)
    return data.json()})
  .then(function(json){
    if(isEmpty(json)|| json['t']==0){// 
      //Do some thing to the html
      hideContent();
      // document.querySelector('#Company').innerHTML=json["ticker"];
    }
    else{
      //display in inner html of company tab
      showContent();
      console.log("Printing json",json);
      let children = document.querySelector("#summary_table").children[0].children;
      for(var i=0; i<children.length; i++){
        if(children[i].id=='stock_ticker_symbol_2'){
          children[i].children[1].innerHTML=json['ticker'];
        }
        if(children[i].id=='trading_day'){
          children[i].children[1].innerHTML=new Date(json['t']*1000).toLocaleDateString('en-us', {  month:"long", day:"numeric", year:"numeric"}) ;
        }
        if(children[i].id=='previous_closing_price'){
          children[i].children[1].innerHTML=json['pc'];
        }
        if(children[i].id=='opening_price'){
          children[i].children[1].innerHTML=json['o'];
        }
        if(children[i].id=='high_price'){
          children[i].children[1].innerHTML=json['h'];
        }
        if(children[i].id=='low_price'){
          children[i].children[1].innerHTML=json['l'];
        }
        if(children[i].id=='change'){
          if(json['d']>=0){
            children[i].children[1].innerHTML=`<div>${json['d']}<img src="static/images/GreenArrowUp.png" style="height:1em;width:1em;"></div>`;
          }
          else{
            children[i].children[1].innerHTML=`<div>${json['d']}<img src="static/images/RedArrowDown.png" style="height:1em;width:1em;"></div>`;
          }
          
        }
        if(children[i].id=='change_percent'){
          if(json['dp']>=0){
            children[i].children[1].innerHTML=`<div>${json['dp']}<img src="static/images/GreenArrowUp.png" style="height:1em;width:1em;"></div>`;
          }
          else{
            children[i].children[1].innerHTML=`<div>${json['dp']}<img src="static/images/RedArrowDown.png" style="height:1em;width:1em;"></div>`;
          }
        }
      }
      
    }
    console.log("Type of object "+ isEmpty(json))
    return json;
  })
  .catch(err=>console.log(err));

fetch(`/recommendation_trends?ticker=${ticker}`)
  .then(function(data){ 
    console.log(data)
    return data.json()})
  .then(function(json){
    if(isEmpty(json)){
      //Do some thing to the html
      hideContent();
      // document.querySelector('#Company').innerHTML=json["ticker"];
    }
    else{
      //display in inner html of company tab
      showContent();
      
      // let children = document.querySelector("#company_table").children[0].children;
      // children[0].children[0].innerHTML=`<img src="${json['logo']}">`;
      let children=document.querySelector('#recommendations').children;
      for(var i=0; i<children.length; i++){
        if(children[i].id=='ss'){
          children[i].innerHTML=json[0]['strongSell'];
        }
        if(children[i].id=='s'){
          children[i].innerHTML=json[0]['sell'];
        }
        if(children[i].id=='h'){
          children[i].innerHTML=json[0]['hold'];
        }
        if(children[i].id=='b'){
          children[i].innerHTML=json[0]['buy'];
        }
        if(children[i].id=='sb'){
          children[i].innerHTML=json[0]['strongBuy'];
        }
      }
      console.log(json);
    }
    console.log("Type of object "+ isEmpty(json))
    return json;
  })
  .catch(err=>console.log(err));

  //Charts tab API call
  fetch(`/charts?ticker=${ticker}`)
  .then(function(data){ 
    console.log(data)
    return data.json()})
  .then(function(json){
    if(isEmpty(json)||json['queryCount']==0){//
      //Do some thing to the html
      hideContent();
      // document.querySelector('#Company').innerHTML=json["ticker"];
    }
    else{
      //display in inner html of company tab
      showContent();
      data1=[];
      data2=[];
      let maxVol=0;
      console.log(json['results'].length);
      for(let i=0; i<json['results'].length; i++){
        data1.push([json['results'][i]['t'],json['results'][i]['c']]);
        data2.push([json['results'][i]['t'],json['results'][i]['v']]);
        if(json['results'][i]['v']>maxVol){
          maxVol=json['results'][i]['v'];
        }
        console.log("asdasd",i);
      }
      console.log("Max value",maxVol)
      console.log("Last day Stock Prce",data1.at(-1)[1])
      console.log("Last date for the stock price chart",new Date(data1.at(-1)[0]).toUTCString('en-us', {  month:"long", day:"numeric", year:"numeric"}))
      console.log("Last day volume",data2[data2.length-1][1])
      console.log("Last date for the volume chart",new Date(data2[data2.length-1][0]).toUTCString('en-us', {  month:"long", day:"numeric", year:"numeric"}))
      // console.log("Printing the latest date given by the the api",new Date(data2[data2.length-1][0]).toLocaleDateString('en-us', {  month:"long", day:"numeric", year:"numeric"}))
      todays_date=json['currentDate'];
      ticker=json['ticker'];
      // create the chart
      Highcharts.stockChart('charts_container', {
        
        
          title: {
              text: `Stock Price ${ticker} ${todays_date}`
          },
  
          subtitle: {
              text: '<a href="https://polygon.io/" style="text-decoration: underline;color:blue;">Source:Polygon.io</a>'
          },
  
          xAxis: {
              gapGridLineWidth: 0,
              minPadding:0,
              maxPadding: 0,
              min:data1[0][0],
              max:data1.at(-1)[0],
              tooltip: {
                // Optionally, you can specify a different tooltip format for the x-axis
                formatter: function() {
                    // Your custom tooltip formatting logic here
                    return 'Date: ' + Highcharts.dateFormat('%Y-%m-%d', this.point)
                }
            }
          },
          yAxis:[ {
            
            opposite:false,
            // height:"200",
            tickAmount:6,
            
            title: {
                text:'Stock Price',
                margin: 30
            }
            
          },{
          opposite:true,
          // height:"200",
          alignedTicks:false,
          // tickLength:10,
          tickAmount:6,
          tickInterval:Math.floor(maxVol/2 / 10000000)*10000000,
          title: {
              text:'Volume',
              margin: 30
          },
          labels: {
            formatter: function() {
                // Round the value to the nearest million (M)
                var roundedValue = Math.floor(this.value / 10000000)*10;
                console.log(roundedValue);
                return roundedValue + 'M';
            }
        }
      },],
  
          rangeSelector: {
              buttons: [{
                  type: 'day',
                  count: 7,
                  text: '7D'
                },
                {
                type: 'day',
                count: 15,
                text: '15D'
                },
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
              ],
              selected: 4,
              inputEnabled: false
          },
          plotOptions: {
            series: {
                pointWidth: 5
            },
            column: {
              // pointPadding: 0,
              // groupPadding: -1,
              pointPlacement:'on',
          }
  
        },
  
          series: [{
              name: `${ticker}`,
              type: 'area',
              data: data1,
              gapSize: 5,
              yAxis: 0,
              tooltip: {
                  valueDecimals: 2
              },
              fillColor: {
                  linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1
                  },
                  stops: [
                      [0, Highcharts.getOptions().colors[0]],
                      [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                  ]
              },
              threshold: null
          },
          {
            type: 'column',
            name: 'Volume',
            data: data2,
            yAxis: 1,
            color: "black",
            // height:'50%',
            
            
          }
        ]
      });

      // console.log("prinitng volume",volume);
    }
    return json;
  })
  .catch(err=>console.log(err));

  //News tab API call
  fetch(`/news?ticker=${ticker}`)
  .then(function(data){ 
    console.log(data)
    return data.json()})
  .then(function(json){
    if(isEmpty(json)){
      //Do some thing to the html
      hideContent();
      // document.querySelector('#Company').innerHTML=json["ticker"];
    }
    else{
      //display in inner html of company tab
      showContent();
      
      // let children = document.querySelector("#company_table").children[0].children;
      // children[0].children[0].innerHTML=`<img src="${json['logo']}">`;
      let company_container=document.querySelector('#latest_news_contianer');
      let img_url;
      let heading;
      let date;
      let url;
      console.log(json[0]);
      company_container.innerHTML="";
      for(var i=0; i<json.length&&i<5; i++){
        img_url=json[i]['image'];
        heading=json[i]['headline'];
        date=new Date(json[i]['datetime']*1000).toLocaleDateString('en-us', {  month:"long", day:"numeric", year:"numeric"});
        url=json[i]['url'];
        let news_box=`<div class="news_box">
                      
                      <div class="news_image_container">
                      <img src=${img_url} class="news_image" alt="Image not Avaialbe">
                      </div>
                      <div class="news_content">
                      <p class="news_heading">${heading}</p>
                      <p class="news_date">${date}</p>
                      <p class="news_link"><a href="${url}" target="_blank">See Original Post</a></p>
                      </div>
                    </div>`;
        company_container.innerHTML+=news_box;
      }
      console.log(json);
    }
    console.log("Type of object "+ isEmpty(json))
    return json;
  })
  .catch(err=>console.log(err));
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    document.querySelector('.tab').children[0].className += " active";
    //display the company tab
    document.getElementById('company_container').style.display='block';

}