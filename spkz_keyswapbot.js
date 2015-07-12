/***
 *      _________       __    __  .__                      
 *     /   _____/ _____/  |__/  |_|__| ____    ____  ______
 *     \_____  \_/ __ \   __\   __\  |/    \  / ___\/  ___/
 *     /        \  ___/|  |  |  | |  |   |  \/ /_/  >___ \ 
 *    /_______  /\___  >__|  |__| |__|___|  /\___  /____  >
 *            \/     \/                   \//_____/     \/ 
 */


var admin = ['76561198024864178']; // SteamID64 that is admin

// In case of new keys, add it here using format: "Key Name",
var itemWhiteList = [
	"Chroma Case Key",
	"Operation Phoenix Case Key",
	"CS:GO Case Key",
	"Winter Offensive Case Key",
	"Huntsman Case Key",
	"Operation Vanguard Case Key",
	"eSports Key",
	"Operation Breakout Case Key",
	"Chroma 2 Case Key",
	"Falchion Case Key"
];

var DEBUG = false;

var pollingRate = 600; //In Seconds

var logOnOptions = {
  accountName: 'USERNAME',
  password: 'PASSWORD'
};
var authCode = ''; // SteamGuard

//Do not Edit below this line unless you know what to do

// Initialization
var colors = require('colors');
var http = require('http');
var fs = require('fs');

if (fs.existsSync(logOnOptions.accountName+'.sentry')) {
  logOnOptions['shaSentryfile'] = fs.readFileSync(logOnOptions.accountName+'.sentry');
} else if (authCode != '') {
  logOnOptions['authCode'] = authCode;
}

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  success: 'green',
  error: 'red'
});

console.log("      ___           ___         ___           ___                ".bgYellow);
console.log("     /  /\\         /  /\\       /__/|         /  /\\  Keyswap Bot  ".bgYellow);
console.log("    /  /:/_       /  /::\\     |  |:|        /  /::| v 1.2        ".bgYellow);
console.log("   /  /:/ /\\     /  /:/\\:\\    |  |:|       /  /:/:| Written with ".bgYellow);
console.log("  /  /:/ /::\\   /  /:/~/:/  __|  |:|      /  /:/|:|__    Node.JS ".bgYellow);
console.log(" /__/:/ /:/\\:\\ /__/:/ /:/  /__/\\_|:|____ /__/:/ |:| /\\           ".bgYellow);
console.log(" \\  \\:\\/:/~/:/ \\  \\:\\/:/   \\  \\:\\/:::::/ \\__\\/  |:|/:/           ".bgYellow);
console.log("  \\  \\::/ /:/   \\  \\::/     \\  \\::/~~~~      |  |:/:/            ".bgYellow);
console.log("   \\__\\/ /:/     \\  \\:\\      \\  \\:\\          |  |::/             ".bgYellow);
console.log("     /__/:/       \\  \\:\\      \\  \\:\\         |  |:/              ".bgYellow);
console.log("     \\__\\/         \\__\\/       \\__\\/         |__|/               ".bgYellow);

var Steam = require('steam');
var SteamTradeOffers = require('steam-tradeoffers');

var steam = new Steam.SteamClient();
var offers = new SteamTradeOffers();

var querystring = require('querystring');
var http = require('http');

var adminMode = false;

steam.logOn(logOnOptions);
// Event handlers
steam.on('debug', function(msg){
	if(!DEBUG){ return; }
	console.log("DEBUG:".warn + msg.verbose)
});
steam.on('loggedOn', function(result) {
  console.log('Logged in!'.success);
  steam.setPersonaState(Steam.EPersonaState.Online);
});
steam.on('webSessionID', function(sessionID) {
  steam.webLogOn(function(newCookie){
    offers.setup({
      sessionID: sessionID,
      webCookie: newCookie
    },function(err){
		if(err){
			
		}
		checkTradeOffers();
        startPolling();
    });
  });
});
steam.on('friendMsg',function(steamID,message,ect){
	var retmessage = message;
	if(inArray(steamID,admin)){
		var cmd = message.toLowerCase().split(" ");
		if((cmd[0] == "!adminmode") && (cmd.length == 1)){
			retmessage = "Admin Mode: " + (adminMode ? "ON" : "OFF");
			steam.sendMessage(steamID, retmessage,ect);
			return;
		}else if((cmd[0] == "!adminmode") && (cmd[1] == "on") && (cmd.length == 2)){
			adminMode = true;
			retmessage = "Admin Mode Enabled";
			steam.sendMessage(steamID, retmessage,ect);
			return;
		}else if((cmd[0] == "!adminmode") && (cmd[1] == "off") && (cmd.length == 2)){
			adminMode = false;
			retmessage = "Admin Mode Disabled";
			steam.sendMessage(steamID, retmessage,ect);
			return;
		}
	}
    if(message.length == 0){
        return;
    }
	var retmessage = replaceMessage(message);
	steam.sendMessage(steamID, retmessage,ect);
	
});
steam.on('tradeProposed', function(tid,steamID) {
    steam.sendMessage(steamID, "Please send me trade offer instead of sending me trade request");
	steam.respondToTrade(tid, false)
	console.log(('Declined Trade request from: ' + steamID).error);
});
steam.on('tradeOffers', function(number) {
	checkTradeOffers();
});
steam.on('sentry', function(data) {
  fs.writeFileSync(logOnOptions.accountName+'.sentry', data);
});


var timer;
function startPolling(){
	if(timer){
		pollingTick();
		return;
	}
    timer = setInterval(pollingTick,pollingRate * 1000);
	pollingTick();
}

// Internal function to check incoming trade offers
// Accept if other guy is admin, else reject.
function checkTradeOffers(){
    offers.getOffers({
      get_received_offers: 1,
      active_only: 1,
      get_descriptions: 1,
      time_historical_cutoff: Math.round(Date.now() / 1000)
    }, function(error, body) {
	  if(!body){
			console.log("Error: "+error)
			return;
	  }
      if(body.response.trade_offers_received){
        body.response.trade_offers_received.forEach(function(offer) {
          if (offer.trade_offer_state == 2){
            if(inArray(offer.steamid_other,admin) && adminMode) {
				console.log(('Accept Trade Offer from: ' + offer.steamid_other + " (Admin)").success);
				offers.acceptOffer({tradeOfferId: offer.tradeofferid},function(resp){
					if(resp){
						console.log(resp.warn)
					}
				});
            } else {
				var Have = addDescriptions(offer.items_to_give,body.response.descriptions);
				var Want = addDescriptions(offer.items_to_receive,body.response.descriptions);
				
				var deal = false;
				var HaveIsValid = true;
				var WantIsValid = true;
				var donate = false;
				var reason = "";
				if(Have.length > Want.length){
					reason = "This motherfucker is attemting to steal items [They Want: "+ Have.length + " items , They Give: " + Want.length + " items]";
					declineOffer(offer.steamid_other,offer.tradeofferid,reason);
				}else{
					if(Have.length < Want.length){
						donate = true;
					}
					for (var i = 0, len = Have.length; i < len; i++) {
						var item = Have[i];
						if(!inArray(item.descriptions.market_hash_name,itemWhiteList)){
							HaveIsValid = false;
							reason = "[H] Item " + item.descriptions.market_hash_name + " not in whitelist";
							break;
						}
					}
					for (var i = 0, len = Want.length; i < len; i++) {
						var item = Want[i];
						if(!inArray(item.descriptions.market_hash_name,itemWhiteList)){
							WantIsValid = false;
							reason = "[W] Item " + item.descriptions.market_hash_name + " not in whitelist";
							break;
						}
					}
					deal = (HaveIsValid && WantIsValid);
					if(deal){
						console.log(('Accept Trade Offer from: ' + offer.steamid_other+" [They Want: "+ Have.length + " items , They Give: " + Want.length + " items]").success);
						if(donate){
							console.log(('	They also Donating!!!').yellow);
						}
						offers.acceptOffer({tradeOfferId: offer.tradeofferid},function(resp){
							if(resp){
								console.log(resp.warn)
							}
						});
					}else{
						declineOffer(offer.steamid_other,offer.tradeofferid,reason);
					}
				}
            }
          }
        });
      }
    });
}

function addDescriptions(itemsArray,descriptionsArray){
	var descriptions = {};
	if(!itemsArray){
		return [];
	}
	for (var i = 0, len = descriptionsArray.length; i < len; i++) {
		var itemDescription = descriptionsArray[i];
		var id = itemDescription.classid;
		descriptions[id] = itemDescription;
	}
	for (var i = 0, len = itemsArray.length; i < len; i++) {
		var item = itemsArray[i];
		var classid = item.classid;
		item.descriptions = descriptions[classid];
	}
	
	return itemsArray;
}

function declineOffer(user,id,reason){
	if(reason){
		reason = " (" + reason + ")"
	}else{
		reason = "";
	}
	console.log(('Declined Trade Offer from: ' + user + reason).error);
	offers.declineOffer({tradeOfferId: id});
}

// Internal function to contact API Server every 60 Seconds
// Our main logic is here
function pollingTick(){
	checkTradeOffers();
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

// Easter egg :D
function replaceMessage(message){
	message = message.replace("ing", "ong");
	message = message.replace("ถ่อย", "โคตรถ่อย");
	message = message.replace("kuy", "very kuy");
	if(message == "เติ้ล"){
		return "นัท";
	}else if(message == "นัท"){
		return "เติ้ล";
	}else if(message == "กินไก่"){
		return "KFC";
	}else if(message == "allahu"){
		return "akbar";
	}
	return message;
}