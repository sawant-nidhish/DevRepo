const express = require('express');
const axios = require('axios');
const cors = require('cors');
const moment = require('moment');

const app = express();
const PORT = 3000;

const API_KEY = 'cmtjpqpr01qqtangt8mgcmtjpqpr01qqtangt8n0';
const POLYGON_KEY = 'sHItDAscBrHfX9CxLM9G31Rc36d1dRaP';
app.use(cors());

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});