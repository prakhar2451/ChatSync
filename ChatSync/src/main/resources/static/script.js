var stompClient = null;

function connect() {
    let socket = new SockJS("/server1");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log("Connected: " + frame);

        $("#name-form").addClass('d-none');
        $("#chat-room").removeClass('d-none');

        // Subscribe
        stompClient.subscribe("/topic/return-to", function (response) {
            showMessage(JSON.parse(response.body));
        });

        // After connecting, enable the message input field and buttons
        enableChatControls();
    });
}

function enableChatControls() {
    $("#message-value").prop("disabled", false);
    $("#send-btn").prop("disabled", false);
    $("#logout-btn").prop("disabled", false);
}

function showMessage(message) {
    let messageContent;
    if (message.type === "leave") {
        messageContent = `<tr><td><i>${message.name} ${message.content}</i></td></tr>`;
    } else if (message.type === "join") {
        messageContent = `<tr><td><i>${message.name} ${message.content}</i></td></tr>`;
    } else {
        messageContent = `<tr><td><b>${message.name} :</b> ${message.content}</td></tr>`;
    }
    $("#message-container-table").prepend(messageContent);
}

function sendMessage() {
    if (stompClient && stompClient.connected) {
        let jsonObj = {
            name: localStorage.getItem("name"),
            content: $("#message-value").val()
        };

        stompClient.send("/app/message", {}, JSON.stringify(jsonObj));
        $("#message-value").val(''); // Clear the input field after sending the message
    } else {
        console.error("WebSocket connection is not established yet. Please wait for the connection to be established.");
    }
}

$(document).ready(() => {

    $("#login").click(() => {
        let name = $("#name-value").val().trim();

        if (name !== "") {
            localStorage.setItem("name", name);
            $("#name-title").html(`Welcome, <b>${name}</b>`);
            connect();
        } else {
            console.error("Please enter a valid name.");
        }
    });

    $("#send-btn").click(() => {
        sendMessage();
    });

    $("#logout-btn").click(() => {
        let name = localStorage.getItem("name");
        if (name) {
            let leaveMessage = {
                name: name,
                content: " has left the chat",
                type: "leave"
            };

            stompClient.send("/app/leave", {}, JSON.stringify(leaveMessage));

            $("#logoutModal").modal("show");

            setTimeout(() => {
                $("#name-form").removeClass('d-none');
                $("#chat-room").addClass('d-none');
                $("#logoutModal").modal("hide");
                localStorage.removeItem("name"); // Clear name from localStorage
                stompClient.disconnect(() => {
                    console.log("Disconnected");
                });
            }, 2000);
        } else {
            console.error("User name not found in localStorage.");
        }
    });
});
