package com.chatsync.app.models;

public class Message {

    private String name;
    private String content;
    private String type;

    public Message(String name, String content, String type) {
        this.name = name;
        this.content = content;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
