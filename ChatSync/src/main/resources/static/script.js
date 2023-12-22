var stompClient = null
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

// Add a new function to enable chat controls
function enableChatControls() {
    $("#message-value").prop("disabled", false);
    $("#send-btn").prop("disabled", false);
    $("#logout-btn").prop("disabled", false);
}



function showMessage(message) {
    if (message.type === "leave") {
        $("#message-container-table").prepend(`<tr><td><i>${message.name}${message.content}</i></td></tr>`);
    } else if (message.type === "join") {
        $("#message-container-table").prepend(`<tr><td><i>${message.name}${message.content}</i></td></tr>`);
    } else {
        $("#message-container-table").prepend(`<tr><td><b>${message.name} :</b> ${message.content}</td></tr>`);
    }
}


function sendMessage() {
    if (stompClient && stompClient.connected) {
        let jsonObj = {
            name: localStorage.getItem("name"),
            content: $("#message-value").val()
        };

        stompClient.send("/app/message", {}, JSON.stringify(jsonObj));
    } else {
        console.error("WebSocket connection is not established yet. Please wait for the connection to be established.");
    }
}

$(document).ready(()=>{

    $("#login").click(() => {
        let name = $("#name-value").val().trim();

        if (name !== "") {
            localStorage.setItem("name", name);
            $("#name-title").html(`Welcome, <b>${name}</b>`);
            connect(); // Ensure connect is called first
            sendMessage(); // Then call sendMessage if needed
        } else {
            // Show an error message or handle the case where the name is blank
            console.error("Please enter a valid name.");
        }
    });


    $("#send-btn").click(()=>{
        sendMessage();
    })

    $("#logout-btn").click(() => {
            // Send a "leave" message
            let leaveMessage = {
                name: localStorage.getItem("name"),
                content: " has left the chat",
                type: "leave"
            };

            // Send the message to the server
            stompClient.send("/app/leave", {}, JSON.stringify(leaveMessage));

            // Show the logout modal (optional)
            $("#logoutModal").modal("show");

            // Hide the chat room after a delay (optional)
            setTimeout(() => {
                $("#name-form").removeClass('d-none');
                $("#chat-room").addClass('d-none');
                // Close the modal after hiding the chat room (optional)
                $("#logoutModal").modal("hide");
            }, 2000); // Adjust the delay as needed

            // Handle the case where the user name is not available in localStorage
            console.error("User name not found in localStorage.");
        });
})