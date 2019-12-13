const Telegraf = require('telegraf');
const config = require('./config');
const routes = require('./routes');
const axios = require('axios');

const express = require('express');
const app = express();
const cron = require("node-cron");

const bot = new Telegraf(config.botToken);

app.get('/', (req, res) => {
    res.send("HALO");
});

function formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

bot.hears(/(jancuk|kontol|memek|goblok|tolol|anjing|jing|cok|jancok|cuk)/i, ctx => {
    const username = ctx.update.message.from.username;
    ctx.reply(`Halo kaka @${username}, kalau ngomong yang sopan ya!!!`);
});

bot.start(ctx => {
    const username = ctx.update.message.from.username;
    ctx.reply(`Halo kaka @${username}, selamat datang di grup bucin`);
});

routes.forEach(item => {
    if (item.command) {
        bot.command(item.command, (ctx) => {
            const message = ctx.update.message.text;
            const username = ctx.update.message.from.username;
            ctx.reply(`halo kak @${username}, kaka sekarang menuju menu ${message}`);
        });
    }

    if (item.event) {
        bot.on(item.event, (ctx) => {
            item.action(ctx);
        });
    }
});

bot.launch();

cron.schedule('0 */25 * * * *', () => {
    axios.get('https://bot-ilham.herokuapp.com/')
        .then(function (response) {
            console.log('gas');
        })
        .catch(function (error) {
            console.log(error);
        })
});

cron.schedule('0 6 * * *', () => {
    axios.get('http://api.openweathermap.org/data/2.5/weather?q=Paiton,ina&APPID=c3a30d9189bba5ae819a95aa53ecb50b&units=metric')
        .then(function (response) {
            console.log(response.data.weather);
            //-1001374864884
            //547059684
            bot.telegram.sendMessage('-1001374864884', `
                Cuaca Hari Ini 
                Date : ${new Date()} 
                Location : ${response.data.name} 
                Weather : ${response.data.weather[0].description}  
                Temperature : ${response.data.main.temp} Celcius 
                Min temperature : ${response.data.main.temp_min} Celcius 
                Max temperature : ${response.data.main.temp_max} Celcius 
                Wind speed : ${response.data.wind.speed} meter/sec
            `);
        })
        .catch(function (error) {
            console.log(error);
        })    
  }, {
    scheduled: true,
    timezone: "Asia/Jakarta"
  });

app.listen(process.env.PORT || 3000, () => {
    console.log('success');
});