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

bot.start(ctx => {
    const username = ctx.update.message.from.username;
    ctx.reply(`Halo kaka @${username}, selamat datang di grup bucin`)
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
    // const express1 = require('express');
    // const app1 = express1();
    // console.log("1");
    axios.get('https://bot-ilham.herokuapp.com/')
        .then(function (response) {
            // handle success
            console.log('gas');
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
});

cron.schedule('0 6 * * *', () => {
    bot.telegram.sendMessage('547059684', 'gas yolo');
    // console.log('Runing a job at 06:00 at Indonesia/Jakarta');
  }, {
    scheduled: true,
    timezone: "Asia/Jakarta"
  });

app.listen(process.env.PORT || 3000, () => {
    console.log('success');
});