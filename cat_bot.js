const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  enterRoom(getRandomChannel());
  setTimeout(startRandomAction, 2000);
});

currentRoom = null;
friendUser = null;
onLap = false;

client.on('message', msg => {
    if (!msg.author.bot){
        if (msg.channel == currentRoom){   
            activity = getRandomInt(75);    
            
			cat_emojis = ['🐱', '😿', '😻', '😹', '😾', '😺', '😼', '😽', '🙀', '😸' ];
            if(activity < cat_emojis.length){
                msg.react(cat_emojis[activity]);
            }
        
            if (msg.content.toLowerCase().includes('pet') && msg.content.toLowerCase().includes(client.user.username.toLowerCase())){
                setTimeout(meow, getRandomInt(1000));
            }
        }
        if (msg.content.toLowerCase().includes('pspsps')){
            chance = getRandomInt(100);
            if (currentRoom != msg.channel && chance < 33){
                leaveRoom();
                enterRoom(msg.channel);
            }
        }
    }
});

client.login('your-token-goes-here');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomChannel() {
    return client.channels.cache.filter(c => c.type == 'text').random();
}

function getRandomUser() {
    return client.users.cache.filter(u => u.presence.status == "online" && !u.bot).random();
}

function getRandomNearbyUser() {
    if (currentRoom != null){
        return client.users.cache.filter(u => u.presence.status == "online" && !u.bot && u.lastMessageChannelID == currentRoom.id).random();
    }
    return getRandomUser();
}

function meow(){
    if (currentRoom != null){
        if (onLap && friendUser != null){
            friendUser.send("*purr*");
        }
        else{
            words = ["*meow*", "*mew*", "*licks*", "*blinks*", "*jumps*", "*flicks tail*", "reaches with paw*"]
            picker = getRandomInt(words.length);
            currentRoom.send(words[picker]);
            console.log(words[picker]);
        }
    }
}

function watch(){
    if (currentRoom != null){
        if (getRandomInt(1)){
            friendUser = getRandomNearbyUser();
            if (friendUser != null){
                console.log("watching someone");
                client.user.setActivity(friendUser.username, { type: 'WATCHING' });
            }
        }
        else{
            console.log("watching window");
            client.user.setActivity("the window", { type: 'WATCHING' });
        }
    }
}

function play(){
    console.log("playing with string");
    client.user.setActivity('with string', { type: 'PlAYING' });
}

function leaveLap(){
    if (onLap && friendUser != null && currentRoom != null){
        currentRoom.send("*leaves <@" + friendUser.id + ">'s lap*");
        onLap = false;
        friendUser = null;
        console.log("left lap");
    }
}

function sitOnLap(){
    if (!onLap && currentRoom != null){
        friendUser = getRandomNearbyUser();
        if (friendUser != null && onLap == false){
            currentRoom.send("*sits on <@" + friendUser.id + ">'s lap*");
            console.log("sits on lap: " + friendUser.username);
            onLap = true;
            setTimeout(leaveLap, getRandomInt(1000) * 1000);
        }
    }
}
    
function leaveRoom(){
    if (onLap){
        leaveLap();
    }
    if (currentRoom != null){
        currentRoom.send("*leaves the room*");
        console.log("Left the channel: " + currentRoom.id);
    }
    currentRoom = null;
}

function enterRoom(channel){
    currentRoom = channel;
    if (currentRoom != null){
        currentRoom.send("*enters the room*");
        console.log("Entered a channel: " + currentRoom.id);
    }
}

function changeRooms(){
    leaveRoom();
    setTimeout(enterRoom, getRandomInt(20000) + 5000, getRandomChannel());
}

function startRandomAction(){
    picker = getRandomInt(100);
    console.log("tick " + picker);
    if (picker < 20) {
        picker = getRandomInt(5);
        console.log("action confirmed " + picker);
        switch (picker){
            case 0:
                meow();
                break;
            case 1:
                changeRooms();
                break;
            case 2:
                sitOnLap();
                break;
            case 3:
                watch();
                break;
            case 4:
                play();
                break;
        }
    }
    setTimeout(startRandomAction, getRandomInt(50000) + 20000);
}
