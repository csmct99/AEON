//Libraries
const Discord = require('discord.io');
const auth = require('./auth.json');
const debug = require("./debugUtils.js");
const colors = require('colors');
const alias = require("./aliases.js");
const doc = require("./docs.js");


//CONSTANTS

const UNKNOWN_COMMAND_MESSAGE = [    // Will pick one of these as the message to display if an unknown command is entered
	"Take that cock out of your mouth, I dont know what the hell you're trying to say.",
	"What the fuck did you just say to me you little bitch?",
	"Are you fucking retarded?",
	"I dont know what you mean by 'AION stop pounding my ass'.",
	"Invalid input, dipshit.",
	"Im out of insults and I dont know what that command is.",
	"ERROR - unknown command"
];


//GLOBAL VARIABLE GARBAGE

let lastMessageChannelID; // Saves the most recent message sent on a channel visible to the bot
let allCommands = []; //Master command array


// Initialize Discord Bot
debug.log("Initializing ...");
let bot = new Discord.Client({
	token: auth.token,
	autorun: true
});

bot.on('ready', function (evt) {

	debug.logSuccess('Connected');
	debug.log('Logged in as: ' + bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {

	lastMessageChannelID = channelID;

    if (message.substring(0, 1) === '!') { //Keyword for now, prob gunna change later

        let args = message.substring(1).split(' '); // Split at spaces
        let cmd = args[0].toLowerCase(); //after ! but before x y z args  ---->       !______ x y z

        args = args.splice(1); // list of everything after !command

		let commandAliasMatch = false; //flag for if the command matches any in the master list

		allCommands.forEach(function(command){  // for each command in the master list
			if(command.aliases.includes(cmd)){  //If the command has an alias in this command's alias list
				command.execute(user, userID, channelID, message, cmd, args);
				commandAliasMatch = true
			}
		});

		if(!commandAliasMatch){ //No command matches the given input AKA wtf is the user trying to say?
			sendMessage(selectRandomFromList(UNKNOWN_COMMAND_MESSAGE), channelID); // Send a random "invalid command" message back
		}

	}
});


//Setup commands

/**
  Class used to store command information. Automatically added to the master class array

  Command name              :    String
  Command aliases           :    List
  Command documentation     :    String
  Command Logic             :    Function
 */
class command{

	/**
	 * @param name STRING : ame of the command, only gets used when looking at the command in a menu
	 * @param aliases LIST : STRING : a list of aliases used by this command
	 * @param documentation STRING : documentation regarding the command. Please include example usage if it can use arguments
	 * @param logic FUNCTION : the function to be run when this command is called. make sure it takes in (user, userID, channelID, message, cmd, args)
	 */
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
		return "Function name : " + this.name + "\nFunction aliases: " + this.aliases + "\n function documentation: ";
	}
}

//Commands
new command("Help", alias.help, doc.help, function(user, userID, channelID, message, cmd, args){
	if(args.length === 1){ //If there is an argument

		let commandAliasMatch = false; //flag for if the arg matches any in the master list

		allCommands.forEach(function(command){  // for each command in the master list
			if(command.aliases.includes(args[0])){  //If the arg has a matching alias in this command's alias list
				let helpMsg = "**-- " + command.name + " --**\n\n" + command.documentation;
				sendMessage(helpMsg, lastMessageChannelID);
				commandAliasMatch = true
			}
		});

		if(!commandAliasMatch){ //If the command was never found
			debug.logError("Failed to find command : " + args[0]);
			sendMessage("Command could not be found. ", lastMessageChannelID);
		}

	}else if(args.length > 1){ //Wrong arg length
		sendMessage( this.name + " - only accepts one argument", lastMessageChannelID);

	}else{ //No argument sent in
		let helpMsg = "**-- " + command.name + " --**\n\n" + command.documentation;
		sendMessage(helpMsg, lastMessageChannelID);
	}
});

new command("Styles", alias.styles, doc.styles, function(user, userID, channelID, message, cmd, args){
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

	New line
	\\n
	`, lastMessageChannelID);
})

new command("Aliases", alias.alias, doc.alias, function(user, userID, channelID, message, cmd, args){

	let batch = "";

	allCommands.forEach(function(command){  // for each command in the master list

		batch += "**" + command.name + "**\n";

		command.aliases.forEach(function(alias){
			batch += "*" + alias + "*,  ";
		});

		batch += "\n\n"

	});

	sendMessage(batch, lastMessageChannelID);

});

new command("Echo", alias.echo, doc.echo, function(user, userID, channelID, message, cmd, args){
	let batch = "";

	args.forEach(function(arg){
		batch += arg + " ";
	});

	sendMessage(batch, lastMessageChannelID);
});

new command("eval", ALIAS_eval, DOC_eval, function(user, userID, channelID, message, cmd, args){

	let code = message.substr(message.indexOf(" ") + 1);

	let silence = code.includes('-s');

	if(silence) {
		code = code.replace('-s', ' ');
	}

	if(code.includes('while') || code.includes('for')) {
		sendMessage('Nice Try Fag', lastMessegeChannelID);
	} else {

		try {

			let output = eval(code);

			if(!silence) {
				sendMessage('Output: ' + output, lastMessegeChannelID);
			}


		} catch(err) {
			sendMessage('Learn to code retard: ' + err.message, lastMessegeChannelID);
		}
	}
});


new command("create", ALIAS_create, DOC_create, function(user, userID, channelID, message, cmd, args){
	let _message = message.substr(message.indexOf(" ") + 1);
	let token = _message.substr(0, _message.indexOf(" "));

	if(token === 'cmd') {
		_message = _message.substr(_message.indexOf(" ") + 1);
		let name = _message.substr(0, _message.indexOf(" "));

		let logic_str = _message.substr(_message.indexOf(" ") + 1);


		eval('function logic(user, userID, channelID, message, cmd, args) { ' + logic_str + ' };');

		new command(name, [name], name, logic);

		sendMessage("Done!", lastMessegeChannelID);
	}
});


/**
 * Sends message to the channel with ID ChannelID
 * @param message STRING : message to be sent
 * @param channelID INT : channelID that the message should be sent to. (You get this manually in discord its static)
 */
function sendMessage(message, channelID){
	bot.sendMessage({ to: channelID, message: message });
	debug.log("Sent Message : \n\n" + message);
}

/**
 * Randomly selects and item from the list and returns it
 * @param randomList LIST : OBJECT a list of objects
 * @returns item OBJECT : item of the list
 */
function selectRandomFromList(randomList){

	let randomIndex = Math.floor(Math.random() * (randomList.length + 1)); // floor to convert to int. (max + 1) becuase otherwise it is exclusive upper range
	return randomList[randomIndex];

}
