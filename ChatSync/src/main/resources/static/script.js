var stompClient = null
function connect() {
    let socket = new SockJS("/server1")

    stompClient = Stomp.over(socket)

    stompClient.connect({},function (frame){
        console.log("Connected: " +frame)

        $("#name-form").addClass('d-none')
        $("#chat-room").removeClass('d-none')

        //subscribe
        stompClient.subscribe("/topic/return-to", function (response){
            showMessage(JSON.parse(response.body))

        })


    })
}

function showMessage(message) {
    console.log("Received message:", message);
    if (message.type === "leave") {
        console.log("Processing leave message:", message);
        $("#message-container-table").prepend(`<tr><td><i>${message.name} ${message.content}</i></td></tr>`);
    } else {
        console.log("Processing regular message:", message);
        $("#message-container-table").prepend(`<tr><td><b>${message.name} :</b> ${message.content}</td></tr>`);
    }
}


function sendMessage(){
    let jsonObj = {
        name: localStorage.getItem("name"),
        content: $("#message-value").val()
    }

    stompClient.send("/app/message",{},JSON.stringify(jsonObj))
}

$(document).ready(()=>{

    $("#login").click(()=>{

       let name = $("#name-value").val().trim()

        if (name !== "") {
            localStorage.setItem("name", name)
            $("#name-title").html(`Welcome, <b>${name}</b>`)
            connect();
        } else {
            alert("Enter a valid name.")
        }
    })

    $("#send-btn").click(()=>{
        sendMessage();
    })

    $("#logout-btn").click(() => {
        // Check if the name is available in localStorage
        let userName = localStorage.getItem("name");

        if (userName) {
            // Send a "leave" message
            let leaveMessage = {
                name: userName,
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
        } else {
            // Handle the case where the user name is not available in localStorage
            console.error("User name not found in localStorage.");
        }
    });


})