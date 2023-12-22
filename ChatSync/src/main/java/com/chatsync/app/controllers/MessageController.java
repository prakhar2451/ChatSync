package com.chatsync.app.controllers;

import com.chatsync.app.models.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;
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

    @MessageMapping("/join")
    @SendTo("/topic/return-to")
    public Message joinChat(Principal principal) {

        if (principal != null) {
            String userName = principal.getName();
            Message joiningMessage = new Message(userName," has joined the chat","join");
            return joiningMessage;
        }
        return null;
    }
}
