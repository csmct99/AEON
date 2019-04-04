var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');


//CONSTANTS

var unknownCommandErrorMessages = [    // WIll pick one of these as the message to display if an unknown command is entered
"Take that cock out of your mouth, I dont know what the hell you're trying to say, dumbass.",
"What the fuck did you just say to me you little bitch?",
"Are you fucking retarded?",
"I dont know what you mean by 'AION stop pounding my ass'.",
"Invalid input, dipshit.",
"Im out of insults and I dont know what that command is.",
"ERROR - unknown command"
]


//COMMAND ALIASES --- PLEASE WRITE ALL ALIASES AS LOWER CASE ---

var ALIAS_help = [
"help",
"whatdo",
"what?",
"what",
"?",
"h",
"-?"
]

var ALIAS_testArg = [
"test"
]

var ALIAS_echo = {
"echo",
"simonsays",
"say"
}
//GLOBAL GARBAGE

var lastMessegeChannelID;

// Configure logger settings
logger.remove(logger.transports.Console);

logger.add(new logger.transports.Console, {
	
    colorize: true
	
});

logger.level = 'debug';


// Initialize Discord Bot
var bot = new Discord.Client({
	
   token: auth.token,
   autorun: true
   
});


bot.on('ready', function (evt) {
	
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
	
});


bot.on('message', function (user, userID, channelID, message, evt) {
	
	lastMessegeChannelID = channelID; 
	
    if (message.substring(0, 1) == '!') {
		
        var args = message.substring(1).split(' ');
        var cmd = args[0].toLowerCase();
		
        args = args.splice(1);
		
		// Not the best way to go about command alias lookup but effiency isnt the goal, programming simplicity is.
		if(ALIAS_help.includes(cmd)){
			
			helpMenu()
			
		}else if(ALIAS_testArg.includes(cmd) && args.length > 3){
			sendMessage("test called and args > 3", lastMessegeChannelID)
			
			args.forEach(function(arg){
				sendMessage("argument: " + arg, lastMessegeChannelID)
			})
			
		}else{ //If no valid command has been entered
		
			sendMessage(selectRandomFromList(unknownCommandErrorMessages), channelID)
			
		}
		
     }
});

function helpMenu(){
	sendMessage("***HELP MENU***", lastMessegeChannelID)
}

function sendMessage(message, channelID){
	
	bot.sendMessage({ to: channelID, message: message }); // JS syntax is weird ngl
	
}


function selectRandomFromList(randomList){
	
	let randomIndex = Math.floor(Math.random() * (randomList.length + 1))
	return randomList[randomIndex]
	
}




