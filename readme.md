SPKZ's Keyswap Bot
======

---
This is a Node.js steam bot which will automatically do key swapping  
*but without server reporting functionality*  
This is only tested on Windows!

[More Information](http://steam.monolidthz.com/KeyswapBot/)  
Donate to author: [Steam](https://steamcommunity.com/tradeoffer/new/?partner=64598450&token=UsbPhXjj) [Indiegogo Life](http://igg.me/at/hY2Fiyy7RH0)  
*This software is 100% Free but you can donate if you want. For those who do that, thank you :)*

###Prerequisites
* [Node.js](https://nodejs.org/)
* A Full Steam account (not limited account)
  * Have steam guard enabled for at least 15 day
  * Have Steam Community Public API Key **of your bot** (You can register one [here](http://steamcommunity.com/dev/apikey))
* [node-steam](https://github.com/seishun/node-steam)
* [node-steam-tradeoffers](https://github.com/Alex7Kom/node-steam-tradeoffers)
* Node Module: [Colors](https://www.npmjs.com/package/colors)

###Installation & Set-Up Instructions
1. Download Node.js and install
2. Install node-steam module
3. Install node-steam-tradeoffers module
4. Install colors module (I use this to make the console looks more fabulous :D )
5. Change settings (For example: Steam Username, Password, Keys Whitelist)
6. After run bot for one time, It will crash! **This is normal and what you do next is to check your E-Mail for steam guard code**
7. After you got the Steam Guard code, put it in **authCode** Variable
8. Wait for 7 days trading cooldown and **DO NOT DELETE *&lt;bot's username&gt;*.sentry file! Or you will need to enter another code again**
9. After you waited for 7 days you can start using the keyswap bot :D

###Commands
You can send commands to bot by using steam chat

* !adminmode  
get current admin mode status (Admin can send any trade offer to bot if mode is enabled)
* !adminmode on  
Enable Admin Mode
* !adminmode off  
Disable Admin Mode