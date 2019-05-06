# AEON - Goal

This discord bot is just a fun little side project for a personal discord server, 
going in we have some plans but not much set in stone so it could turn into anything really

# AEON - Features

Once the bot is running and on your server here are some things you can do

Use the ```!help``` command to get general and specific info on certain commands

```!help styles```

Use command ```!commands``` to see a list of all available commands

a list of our current commands
```
help arg            -- Exposes docs of specific commands
styles              -- Returns a list of all of discords styles
alias               -- Returns all commands and their aliases (Adding alias at runtime in development)
echo arg            -- Echos back the arguments of the command
eval arg            -- Evaluates a JS expression
create name arg     -- Creates a new command given a JS function to execute upon calling the command
commands            -- Displays all available commands
```

# AEON - Setup
You can download the files as is and run bot.js with node assuming node.js (developed with 10.15.3) is installed

You can check your version with ``` node -v```

You will also need to provide your own ```auth.json``` file, this is where your bot's key is stored.
Just create a file named ```auth.json``` and enter the following

```
{
   "token": "YOUR_KEY_HERE"
}
```

add the ```auth.json``` file to the root.

 
to run the bot, just use

```
node bot.js
```

in the project root. 

The bot is now running on your machine from the terminal you ran the command from. 
We plan on moving ours to a dedicated raspberry pi eventually

It should look like this on a successful startup


![startup](https://i.gyazo.com/a82535a200939d24ecf12d8f7a4de466.png)

# AEON - Documentation

Coming ... soon ...

but like

not "soon" soon

more like 

*never* soon

just use ```!help``` for now
