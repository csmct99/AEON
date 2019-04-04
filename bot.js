//Libraries
let Discord = require('discord.io');
let auth = require('./auth.json');


//CONSTANTS

let unknownCommandErrorMessages = [    // Will pick one of these as the message to display if an unknown command is entered
	"Take that cock out of your mouth, I dont know what the hell you're trying to say, dumbass.",
	"What the fuck did you just say to me you little bitch?",
	"Are you fucking retarded?",
	"I dont know what you mean by 'AION stop pounding my ass'.",
	"Invalid input, dipshit.",
	"Im out of insults and I dont know what that command is.",
	"ERROR - unknown command"
]


//COMMAND ALIASES --- PLEASE WRITE ALL ALIASES AS LOWER CASE ---

let ALIAS_help = [
	"help",
	"whatdo",
	"what?",
	"what",
	"?",
	"h",
	"-?"
];

let ALIAS_testArg = [
	"test"
];

let ALIAS_echo = [
	"echo",
	"simonsays",
	"say",
	"repeat"
];


//GLOBAL VARIABLE GARBAGE

let lastMessegeChannelID;


// Initialize Discord Bot
let bot = new Discord.Client({

	token: auth.token,
	autorun: true

});


bot.on('ready', function (evt) {
	//logger.info

	console.log('Connected');
	console.log('Logged in as: ' + bot.username + ' - (' + bot.id + ')');

});


bot.on('message', function (user, userID, channelID, message, evt) {

	lastMessegeChannelID = channelID;

    if (message.substring(0, 1) == '!') { //Keyword for now, prob gunna change later

        let args = message.substring(1).split(' '); // Split at spaces
        let cmd = args[0].toLowerCase(); //after ! but before x y z args  ---->       !______ x y z

        args = args.splice(1); // list of everything after !command

		// Not the best way to go about command alias lookup but effiency isnt the goal, programming simplicity is.
		if(ALIAS_help.includes(cmd)){ //!help

			helpMenu();

		}else if(ALIAS_testArg.includes(cmd) && args.length > 2){ // !test arg arg arg
			sendMessage("test called and args > 2", lastMessegeChannelID);

			args.forEach(function(arg){
				sendMessage("argument: " + arg, lastMessegeChannelID);
			})

		}else if(ALIAS_echo.includes(cmd) && args.length > 0){ // !echo arg

			echoMessage(args); //Baiscally just batches and prints all args

		}else{ //If no valid command has been entered

			sendMessage(selectRandomFromList(unknownCommandErrorMessages), channelID);

		}

	}
});

//Display the help dialoge
function helpMenu(){
	sendMessage("***HELP MENU***", lastMessegeChannelID);
}

function echoMessage(args){
	let batch = "";

	args.forEach(function(arg){
		batch += arg + " ";
	})

	sendMessage(batch, lastMessegeChannelID);
}

//Sends message to the channel with ID ChannelID
function sendMessage(message, channelID){
	bot.sendMessage({ to: channelID, message: message });
	console.log(" Message send : ' " + message + " '");
}

//Select a random item from a list
function selectRandomFromList(randomList){

	let randomIndex = Math.floor(Math.random() * (randomList.length + 1)); // floor to convert to int. (max + 1) becuase otherwise it is exclusive upper range
	return randomList[randomIndex];

}
