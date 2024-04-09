package com.example.stocks;

public class PortfolioModel {
    private String tokenName;
    private Integer numShares;
    private Integer totalCost;
    private Integer changePrice;
    private Integer changePercent;

    public Integer getAvgPrice() {
        return avgPrice;
    }

    public void setAvgPrice(Integer avgPrice) {
        this.avgPrice = avgPrice;
    }

    private Integer avgPrice;

    public Integer getLatestPrice() {
        return latestPrice;
    }

    public void setLatestPrice(Integer latestPrice) {
        this.latestPrice = latestPrice;
    }

    private Integer latestPrice;
    public Integer getNumShares() {
        return numShares;
    }

    public void setNumShares(Integer numShares) {
        this.numShares = numShares;
    }

    public Integer getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Integer totalCost) {
        this.totalCost = totalCost;
    }

    public Integer getChangePrice() {
        return changePrice;
    }

    public void setChangePrice(Integer changePrice) {
        this.changePrice = changePrice;
    }

    public Integer getChangePercent() {
        return changePercent;
    }

    public void setChangePercent(Integer changePercent) {
        this.changePercent = changePercent;
    }

    public PortfolioModel(String tokenName, Integer numShares, Integer totalCost,  int avgPrice, int latestPrice) {
        this.tokenName = tokenName;
        this.numShares = numShares;
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


