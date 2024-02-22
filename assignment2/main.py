from flask import Flask, send_from_directory, request, jsonify, redirect, url_for
from dotenv import load_dotenv
import os
import requests
from datetime import datetime
from dateutil.relativedelta import relativedelta

load_dotenv()
app = Flask(__name__)

@app.route('/')
def start():
    return redirect(url_for('serve_html'))
@app.route('/homepage.html')
def serve_html():
    # Specify the path to your HTML file
    html_file_path = 'templates/homepage.html'
    return send_from_directory('templates','homepage.html')

##Company profile 2 API CALL
@app.route('/company')
def company():
    # Specify the path to your HTML file
    ticker=request.args.get('ticker').upper()

    #Finhub company tab API call
    response = requests.get("https://finnhub.io/api/v1/stock/profile2?symbol={}&token={}".format(ticker,os.getenv("FINNHUB_API_KEY")))
    data={}
    if(len(response.json())==0):
        # print("Incorrect input")
        pass
    else:
        data=response.json()

    return jsonify(data)
 
##Summary API call
@app.route('/summary')
def summary():
    # Specify the path to your HTML file
    ticker=request.args.get('ticker').upper()
    
    #Finhub "Qoute Services" tab API call
    response = requests.get("https://finnhub.io/api/v1/quote?symbol={}&token={}".format(ticker,os.getenv("FINNHUB_API_KEY")))
    
    data={}
    if(len(response.json())==0):
        pass
        # print("Incorrect input")
    else:
        data=response.json()
        data['ticker']=ticker
        # print(data)

    return jsonify(data)
 
#Recommendations API call
@app.route('/recommendation_trends')
def recommendations():
    # Specify the path to your HTML file
    ticker=request.args.get('ticker').upper()
    # print("From app",ticker)
    
    #Finhub "Qoute Services" tab API call
    response = requests.get("https://finnhub.io/api/v1/stock/recommendation?symbol={}&token={}".format(ticker,os.getenv("FINNHUB_API_KEY")))
    data={}
    if(len(response.json())==0):
        pass
        # print("Incorrect input")
    else:
        data=response.json()
        # print("Lenght of response for recommendation",len(data))

    return jsonify(data)

#Charts Tab API call
@app.route('/charts')
def charts():
    # Specify the path to your HTML file
    ticker=request.args.get('ticker').upper()
    # print("From app",ticker)
    # Get the current date
    current_date = datetime.now()

    # Calculate the date 30 days prior to the current date
    date_6_months_ago = (current_date - relativedelta(months=6,days=1)).strftime('%Y-%m-%d')

    current_date=current_date.strftime('%Y-%m-%d')
    #Finhub "Qoute Services" tab API call
    print("Today's date",current_date)
    print("Day 6 monhts and a day ago",date_6_months_ago)
    response = requests.get("https://api.polygon.io/v2/aggs/ticker/{}/range/1/day/{}/{}?adjusted=true&sort=asc&apiKey={}".format(ticker,date_6_months_ago,current_date,os.getenv("POLYGON_API_KEY")))
    data={}
    data={}
    if(len(response.json())==0):
        # print("Incorrect input")
        pass
    else:
        data=response.json()
        data['ticker']=ticker
        data['currentDate']=current_date
    #Finhub summary tab API cal;
    # return date_30_days_ago.strftime('%Y-%m-%d')
    return jsonify(data)

##Latest News API call
@app.route('/news')
def news():
    # Specify the path to your HTML file
    ticker=request.args.get('ticker').upper()
    # print("From app",ticker)
    # Get the current date
    current_date = datetime.now()

    # Calculate the date 30 days prior to the current date
    date_30_days_ago = (current_date - relativedelta(days=30)).strftime('%Y-%m-%d')
    current_date=current_date.strftime('%Y-%m-%d')
    #Finhub "Qoute Services" tab API call
    # print(current_date)
    # print(date_30_days_ago)
    response = requests.get("https://finnhub.io/api/v1/company-news?symbol={}&from={}&to={}&token={}".format(ticker,date_30_days_ago,current_date,os.getenv("FINNHUB_API_KEY")))
    data={}
    if(len(response.json())==0):
        # print("Incorrect input")
        pass
    else:
        data=response.json()
    
    # print("Recommendation Trends tab",response.json()[0])
    #Finhub summary tab API cal;
    # return date_30_days_ago.strftime('%Y-%m-%d')
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)