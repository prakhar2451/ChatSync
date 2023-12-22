package com.chatsync.app.controllers;

import com.chatsync.app.models.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    @MessageMapping("/message")
    @SendTo("/topic/return-to")
    public Message getContent (@RequestBody Message message) {
        return  message;
    }

    @MessageMapping("/leave")
    @SendTo("/topic/return-to")
    public  Message leaveChat() {
        Message leaveMessage = new Message("User", " has left the chat", "leave");
        return leaveMessage;
    }
}
