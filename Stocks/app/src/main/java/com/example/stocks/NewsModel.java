package com.example.stocks;

public class NewsModel {

    private String heading;
    private String source;

    private String imgUrl;

    private String timeElpased;

    private String summary;
    private String srcUrl;
    private final String simpleTime;

    public String getSimpleTime() {
        return simpleTime;
    }

    public String getSrcUrl() {
        return srcUrl;
    }

    public void setSrcUrl(String srcUrl) {
        this.srcUrl = srcUrl;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getTimeElpased() {
        return timeElpased;
    }

    public void setTimeElpased(String timeElpased) {
        this.timeElpased = timeElpased;
    }


    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public NewsModel(String heading, String source, String timeElpased, String imgUrl, String summary, String srcUrl, String simpleTime) {
        this.heading = heading;
        this.source = source;
        this.timeElpased = timeElpased;
        this.imgUrl = imgUrl;
        this.summary = summary;
        this.srcUrl = srcUrl;
        this.simpleTime = simpleTime;
    }

    public String getHeading() {
        return heading;
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }
}
