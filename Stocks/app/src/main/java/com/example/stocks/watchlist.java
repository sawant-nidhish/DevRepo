package com.example.stocks;

public class watchlist {
    private String symbol;
    private String company_name;
    private Double current_price;
    private Double change;
    private Double change_percent;

    public String getCompany_name() {
        return company_name;
    }

    public void setCompany_name(String company_name) {
        this.company_name = company_name;
    }

    public Double getCurrent_price() {
        return current_price;
    }

    public void setCurrent_price(Double current_price) {
        this.current_price = current_price;
    }

    public Double getChange() {
        return change;
    }

    public void setChange(Double change) {
        this.change = change;
    }

    public Double getChange_percent() {
        return change_percent;
    }

    public void setChange_percent(Double change_percent) {
        this.change_percent = change_percent;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public watchlist(String symbol, String company_name, Double current_price, Double change, Double change_percent) {
        this.symbol = symbol;
        this.company_name = company_name;
        this.current_price = current_price;
        this.change = change;
        this.change_percent = change_percent;
    }
}
