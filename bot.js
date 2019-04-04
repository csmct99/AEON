//Libraries
let Discord = require('discord.io');
let auth = require('./auth.json');


//CONSTANTS

let unknownCommandErrorMessages = [    // Will pick one of these as the message to display if an unknown command is entered
	"Take that cock out of your mouth, I dont know what the hell you're trying to say.",
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

let ALIAS_styles = [
	"showStyles",
	"styles"

];

let DOC_help = `
***-- Help --***

Displays help information on the given command

***-- Usage --***

expects one argument
\`\`\`!help COMMAND_NAME\`\`\`
`;

let DOC_styles = `
Shows an example of styles avaliable and their usage.

usage
\'\'\'!styles\'\'\'
`

//GLOBAL VARIABLE GARBAGE

let lastMessegeChannelID; // Savess the most recent message sent on a visable channel to the bot
let allCommands = []; //Master command array


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


//Initialize Bot Commands / Command Logic

/*
Class used to store command information. Automatically added to the master class array
Class used to store command information. Automatically added to the master class array

Command name              :    String
Command aliases           :    List
Command documentation     :    String
Command Logic             :    Function
*/
class command{

	// I dont like how JS doesnt force you to Initialize your local variables in classes :(
	constructor(name, aliases, documentation, logic){

		this.name = name;
		this.aliases = aliases;
		this.documentation = documentation;
		this.logic = logic;

		allCommands.push(this); //Add this command to the master list

	}

	execute(user, userID, channelID, message, cmd, args){
		this.logic(user, userID, channelID, message, cmd, args);
	}

	toString(){
		return "Function name : " + this.name + "\nFunction aliases: " + this.alias + "\n function documentation: ";
	}
}

//Commands

new command("Help", ALIAS_help, DOC_help, function(user, userID, channelID, message, cmd, args){
	sendMessage(this.documentation, lastMessegeChannelID);
})

new command("StylesTest", ALIAS_styles, DOC_styles, function(user, userID, channelID, message, cmd, args){
	sendMessage(`
	__***STYLES***__

	__Underscore__
	\\_\\_Underscore\\_\\_

	*Italics*
	\\*Italics\\*

	**Bold**
	\\*\\*Bold\\*\\*

	***ItalicsBold***
	\\*\\*\\*ItalicsBold\\*\\*\\*

	~~Strike through~~
	\\~\\~Strike through\\~\\~

	||Censor||
	\\|\\|Censor\\|\\|

	\`\`\`Code Block\`\`\`
	\\\`\\\`\\\`Code Block\\\`\\\`\\\`
	
	\n	New line
	`, lastMessegeChannelID);
})



bot.on('message', function (user, userID, channelID, message, evt) {

	lastMessegeChannelID = channelID;

    if (message.substring(0, 1) == '!') { //Keyword for now, prob gunna change later

        let args = message.substring(1).split(' '); // Split at spaces
        let cmd = args[0].toLowerCase(); //after ! but before x y z args  ---->       !______ x y z

        args = args.splice(1); // list of everything after !command

		let commandAliasMatch = false; //flag for if the command matches any in the master list

		allCommands.forEach(function(command){  // for each command in the master list
			if(command.aliases.includes(cmd)){  //If the command has an alias in this command's alias list
				command.execute(user, userID, channelID, message, cmd, args);
				commandAliasMatch = true
			}
		})

		if(!commandAliasMatch){ //No command matches the given input AKA wtf does the user want?
			sendMessage(selectRandomFromList(unknownCommandErrorMessages), channelID); // Send a random "invalid command" message back
		}


	}
});

//Display the help dialoge
function helpMenu(){
	sendMessage("***HELP MENU***", lastMessegeChannelID);
}

//Batches all args and sends them as a single message
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
	console.log(" [*] MESSAGE : \" " + message + " \"");
}

//Select a random item from a list
function selectRandomFromList(randomList){

	let randomIndex = Math.floor(Math.random() * (randomList.length + 1)); // floor to convert to int. (max + 1) becuase otherwise it is exclusive upper range
	return randomList[randomIndex];

}
