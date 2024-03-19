const express = require('express');
const axios = require('axios');
const cors = require('cors');
const moment = require('moment');
const {MongoClient} =require('mongodb');
const { resourceLimits } = require('worker_threads');

const app = express();
const PORT = 3000;

const API_KEY = 'cmtjpqpr01qqtangt8mgcmtjpqpr01qqtangt8n0';
const POLYGON_KEY = 'sHItDAscBrHfX9CxLM9G31Rc36d1dRaP';
app.use(cors());
app.use(express.json())
function connect(){
  const uri='mongodb+srv://nidhishsawant135:QMcqhyI5g53sFzjR@homework3.j2ujlwy.mongodb.net/?retryWrites=true&w=majority&appName=Homework3'

  const client = new MongoClient(uri);
  
  try{
      client.connect();
      console.log("Connectd to DataBase Successfully");

      const db=client.db('homework_3')
      const collection=db.collection('wallet')
      
      const query={name:"wallet"}
      const update ={$set:{name:"wallet",money:25000}};

    const result=collection.findOneAndUpdate(query,update,{upsert:true}).then(result=>console.log(result))
      // collection.findOne().then(result=>console.log(result))
      return client
  }
  catch (e){
      console.error(e);
  }
}

async function findWatchList(client){
  const cursor = await client.db('homework_3').collection('watchlist').find()
  const result = await cursor.toArray()
  console.log(result)
  return result
}

async function findOneStock(client,query){
  const result = await client.db('homework_3').collection('watchlist').findOne(query)
  // const result = await cursor.toArray()
  console.log(result)
  return result
}

async function deleteWathcList(client,watchlist){
  const result = await client.db('homework_3').collection('watchlist').deleteOne(watchlist)
  console.log("Deleted ",result)
}




async function findPortfolio(client){
  const cursor = await client.db('homework_3').collection('portfolio').find()
  const result = await cursor.toArray()
  console.log(result)
  return result
}

async function findOneStockPortfolio(client,query){
  const result = await client.db('homework_3').collection('portfolio').findOne(query)
  // const result = await cursor.toArray()
  console.log(result)
  return result
}

async function deleteWathcList(client,portfolio){
  const result = await client.db('homework_3').collection('portfolio').deleteOne(portfolio)
  console.log("Deleted ",result)
}

const client=connect()

//Degine a endpoint to get the list wathclist
app.get('/api/watchList', async (req, res) => {
  try{
    const symbol = req.query.symbol;
    if (!symbol) {
      data=await findWatchList(client)
      res.json(data);
    }
    else{
      data=await findOneStock(client,{name:symbol})
      res.json(data);
    }
    
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

//Define a endpoint to update the list wathclist
app.post('/api/watchList', async (req, res) => {
  try{
    newItem=req.body
    console.log("New Itme is",newItem)

    const db=client.db('homework_3')
    const collection=db.collection('watchlist');
    // console.log(watchlist.name)
    const query={name:newItem.name}
    const update ={$set:newItem};

    const result=await collection.findOneAndUpdate(query,update,{upsert:true})

    // data=await findWatchList(client)
    res.json("Posted Data Successfully!!!");
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

//Degine a endpoint to delete the list wathclist
app.delete('/api/watchList', async (req, res) => {
  try{
    const symbol = req.query.symbol;
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    data=await deleteWathcList(client,{name:symbol})
    res.json(`Deleted ${symbol} successfully`);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});


//Degine a endpoint to get the list wallet
app.get('/api/wallet', async (req, res) => {
  try{
    
    const db=client.db('homework_3')
    const collection=db.collection('wallet')
    
    data=await collection.findOne()

    // data=await findOneStock(client,{name:symbol})
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

//Degine a endpoint to post the Data wallet
app.post('/api/wallet', async (req, res) => {
  try{
    
    newItem=req.body
    console.log("New Itme is",newItem)

    const db=client.db('homework_3')
    const collection=db.collection('wallet');
    // console.log(watchlist.name)
    const query={name:newItem.name}
    const update ={$set:newItem};

    const result=await collection.findOneAndUpdate(query,update,{upsert:true})

    console.log("Updated wallet successfully")
    // data=await findOneStock(client,{name:symbol})
    res.json("Updated wallet successfully");
    
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

//Degine a endpoint to get the list portfolio
app.get('/api/portfolio', async (req, res) => {
  try{
    const symbol = req.query.symbol;
    if (!symbol) {
      data=await findPortfolio(client)
      res.json(data);
    }
    else{
      data=await findOneStockPortfolio(client,{name:symbol})
      res.json(data);
    }
    
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});


//Degine a endpoint to post the Portfolio
app.post('/api/portfolio', async (req, res) => {
  try{
    
    newItem=req.body
    buy=req.query.buy
    console.log("New Itme is",newItem)

    const db=client.db('homework_3')
    const collection=db.collection('portfolio');
    // console.log(watchlist.name)
    const query={name:newItem.name}

    data=await findOneStockPortfolio(client,{name:newItem.name})
    if(data){
      if(buy=='true'){
        console.log("Updating the data in the buy db",data)
        newItem.totalCost=data.qty*data.avgCost + newItem.qty*newItem.avgCost
        newItem.qty=newItem.qty+data.qty
        newItem.avgCost=newItem.totalCost/newItem.qty
      }
      else{
        console.log("Updating the data in the sell db",(data.qty-newItem.qty)*data.avgCost)
        
        newItem.qty=data.qty-newItem.qty
        newItem.totalCost=newItem.qty*data.avgCost
      }
      
    }
    else{
      console.log("Buying stock fro the first time")
    }
    console.log(newItem)
    const update ={$set:newItem};

    const result=await collection.findOneAndUpdate(query,update,{upsert:true})

    console.log("Updated portfolio successfully")
    // data=await findOneStock(client,{name:symbol})
    res.json("Updated portfolio successfully");
    
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

// Define route to fetch data from Finnhub API
app.get('/api/company_description', async (req, res) => {
  try {
    const symbol = req.query.symbol;
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }

    const apiUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`;
    const response = await axios.get(apiUrl);
    // console.log(response)
    // // Extract necessary data from the response
    const { data } = response;
    // const { name, exchange, industry, country, logo } = data;

    // // Send extracted data in the response
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});



//Get the data for the company price
app.get('/api/company_latest_price', async (req, res) => {
    try {
      const symbol = req.query.symbol;
      if (!symbol) {
        return res.status(400).json({ error: 'Symbol parameter is required' });
      }
  
      const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
      const response = await axios.get(apiUrl);
      // console.log(response)
      // // Extract necessary data from the response
      const { data } = response;
      // const { name, exchange, industry, country, logo } = data;
  
      // // Send extracted data in the response
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  });

  //Get the data for the company peers
    app.get('/api/company_peers', async (req, res) => {
        try {
        const symbol = req.query.symbol;
        if (!symbol) {
            return res.status(400).json({ error: 'Symbol parameter is required' });
        }
    
        const apiUrl = `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${API_KEY}`;
        const response = await axios.get(apiUrl);
        // console.log(response)
        // // Extract necessary data from the response
        const { data } = response;
        // const { name, exchange, industry, country, logo } = data;
    
        // // Send extracted data in the response
        res.json(data);
        } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching data' });
        }
  });

  app.get('/api/company_news', async (req, res) => {
    try {
    const symbol = req.query.symbol;
    if (!symbol) {
        return res.status(400).json({ error: 'Symbol parameter is required' });
    }

    // Get the current date
    const currentDate = moment();

    // Calculate the date one week ago
    const oneWeekAgo = currentDate.subtract(1, 'weeks');

    // Format the date to your desired format (e.g., YYYY-MM-DD)
    const formattedPrevDate = oneWeekAgo.format('YYYY-MM-DD');
    const formattedCurrDate = currentDate.format('YYYY-MM-DD');
    const apiUrl = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${formattedPrevDate}&to=${formattedCurrDate}&token=${API_KEY}`;
    const response = await axios.get(apiUrl);
    // console.log(response)
    // // Extract necessary data from the response
    const { data } = response;
    // const { name, exchange, industry, country, logo } = data;

    // // Send extracted data in the response
    res.json(data);
    } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.get('/api/company_historical_data', async (req, res) => {
  try {
  const symbol = req.query.symbol;
  if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  // Get the current date
  const currentDate = moment();
  const formattedCurrDate = currentDate.format('YYYY-MM-DD');
  // Calculate the date one week ago
  const twoYearsAgo = currentDate.subtract(2, 'years');

  // Format the date to your desired format (e.g., YYYY-MM-DD)
  const formattedPrevDate = twoYearsAgo.format('YYYY-MM-DD');
  
  console.log("Calling historical data for",symbol)

  const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${formattedPrevDate}/${formattedCurrDate}?adjusted=true&
  // sort=asc&apiKey=${POLYGON_KEY}`;
  // const apiUrl='https://demo-live-data.highcharts.com/aapl-ohlcv.json'
  const response = await axios.get(apiUrl);
  // console.log(response)
  // // Extract necessary data from the response
  const { data } = response;
  // const { name, exchange, industry, country, logo } = data;

  // // Send extracted data in the response
  res.json(data);
  } catch (error) {
  console.error('Error fetching historical data:', error.message);
  res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.get('/api/company_hourly_data', async (req, res) => {
  try {
  const symbol = req.query.symbol;
  // const time = req.query.time;
  if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
  }
  // Get the current date
  const currentDate = moment();
  const formattedCurrDate = currentDate.format('YYYY-MM-DD');
  // Calculate the date 6 hours ago
  const twoYearsAgo = currentDate.subtract(5, 'day');

  // Format the date to your desired format (e.g., YYYY-MM-DD)
  const formattedPrevDate = twoYearsAgo.format('YYYY-MM-DD');
  
  console.log("Calling hourly data for",formattedCurrDate)

  const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/hour/${formattedPrevDate}/${formattedCurrDate}?adjusted=true&
  // sort=asc&apiKey=${POLYGON_KEY}`;
  // const apiUrl='https://demo-live-data.highcharts.com/aapl-ohlcv.json'
  const response = await axios.get(apiUrl);
  // console.log(response)
  // // Extract necessary data from the response
  const { data } = response;

  // const { name, exchange, industry, country, logo } = data;

  // // Send extracted data in the response
  res.json(data);
  } catch (error) {
  console.error('Error fetching Hourly data:', error.message);
  res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

//Get the data for the company sentiments
app.get('/api/company_insider_sentiments', async (req, res) => {
  try {
  const symbol = req.query.symbol;
  if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  const apiUrl = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&from=2022-01-01&token=${API_KEY}`
  const response = await axios.get(apiUrl);
  // console.log(response)
  // // Extract necessary data from the response
  const { data } = response;
  // const { name, exchange, industry, country, logo } = data;

  // // Send extracted data in the response
  res.json(data);
  } catch (error) {
  console.error('Error fetching sentiments data:', error.message);
  res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});


//Get the data for the company sentiments
app.get('/api/company_recommendation_trends', async (req, res) => {
  try {
  const symbol = req.query.symbol;
  if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  const apiUrl = `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${API_KEY}`
  
  const response = await axios.get(apiUrl);
  // console.log(response)
  // // Extract necessary data from the response
  const { data } = response;
  // const { name, exchange, industry, country, logo } = data;

  // // Send extracted data in the response
  res.json(data);
  } catch (error) {
  console.error('Error fetching sentiments data:', error.message);
  res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

//Get the data for the company sentiments
app.get('/api/company_earnings', async (req, res) => {
  try {
  const symbol = req.query.symbol;
  if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  const apiUrl = `https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&token=${API_KEY}`
  
  const response = await axios.get(apiUrl);
  // console.log(response)
  // // Extract necessary data from the response
  const { data } = response;
  // const { name, exchange, industry, country, logo } = data;

  // // Send extracted data in the response
  res.json(data);
  } catch (error) {
  console.error('Error fetching sentiments data:', error.message);
  res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});


//Get the data for the company autocomplete
app.get('/api/company_autocomplete', async (req, res) => {
  try {
  const symbol = req.query.symbol;
  if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
  }
  
  const apiUrl = `https://finnhub.io/api/v1/search?q=${symbol}&token=${API_KEY}`
  
  const response = await axios.get(apiUrl);
  // console.log(response)
  // // Extract necessary data from the response
  const { data } = response;
  // const { name, exchange, industry, country, logo } = data;

  // // Send extracted data in the response
  res.json(data);
  } catch (error) {
  console.error('Error fetching sentiments data:', error.message);
  res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});