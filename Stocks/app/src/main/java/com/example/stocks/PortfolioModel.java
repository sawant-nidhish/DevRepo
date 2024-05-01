package com.example.stocks;

public class PortfolioModel {
    private String tokenName;
    private Double numShares;
    private Double totalCost;
    private Double changePrice;
    private Double changePercent;

    public Double getAvgPrice() {
        return avgPrice;
    }

    public void setAvgPrice(Double avgPrice) {
        this.avgPrice = avgPrice;
    }

    private Double avgPrice;

    public Double getLatestPrice() {
        return latestPrice;
    }

    public void setLatestPrice(Double latestPrice) {
        this.latestPrice = latestPrice;
    }

    private Double latestPrice;
    public Double getNumShares() {
        return numShares;
    }

    public void setNumShares(Double numShares) {
        this.numShares = numShares;
    }

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public Double getChangePrice() {
        return changePrice;
    }

    public void setChangePrice(Double changePrice) {
        this.changePrice = changePrice;
    }

    public Double getChangePercent() {
        return changePercent;
    }

    public void setChangePercent(Double changePercent) {
        this.changePercent = changePercent;
    }

    public PortfolioModel(String tokenName, Integer numShares, Double totalCost,  double avgPrice, double latestPrice) {
        this.tokenName = tokenName;
        this.numShares = Double.valueOf(numShares);
        this.totalCost = totalCost;
        this.latestPrice = latestPrice;
        this.avgPrice = avgPrice;

    }

    public String getTokenName() {
        return tokenName;
    }

    public void setTokenName(String tokenName) {
        this.tokenName = tokenName;
    }
}


