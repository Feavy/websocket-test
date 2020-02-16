import io from "socket.io-client"

const socket = io.connect("https://productive-chocolate-45ohn8wqtg.glitch.me");
const players = new Map();

const playerUsername = prompt("Entrez votre pseudo :");
onPlayerJoin(playerUsername);

socket.emit("initialize", playerUsername);


socket.on("initialize", initialize);
socket.on("player_joined", onPlayerJoin);
socket.on("player_left", onPlayerLeave);
socket.on("player_moved", onPlayerMove);

function initialize(localPlayers) {
    console.log(localPlayers);
    for(var player in localPlayers) {
        console.log(player);
        onPlayerJoin(localPlayers[player].username);
        onPlayerMove(localPlayers[player].username, localPlayers[player].x, localPlayers[player].y);
    }
}

function onPlayerJoin(username) {
    const playerDiv = document.createElement("div");
    playerDiv.className = "player";

    const playerName = document.createElement("p");
    playerName.innerText = username;

    playerDiv.appendChild(playerName);

    players.set(username, playerDiv);

    document.getElementsByTagName("body")[0].appendChild(playerDiv);
}

function onPlayerLeave(username) {
    players.get(username).remove();
    players.set(username, null);
}

function onPlayerMove(username, x, y) {
    players.get(username).style.left = `calc(${(x*100)}% - 25px)`;
    players.get(username).style.top = `calc(${(y*100)}vh - 73px)`;
}

document.addEventListener("click", (click) => {
    socket.emit("player_moved", click.x/window.innerWidth, click.y/window.innerHeight);
    onPlayerMove(playerUsername, click.x/window.innerWidth, click.y/window.innerHeight);
});