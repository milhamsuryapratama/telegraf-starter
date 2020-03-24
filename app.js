const Telegraf = require('telegraf');
const config = require('./config');
const routes = require('./routes');
const axios = require('axios');
const session = require('telegraf/session');

const cheerio = require('cheerio');

const express = require('express');
const app = express();
const cron = require("node-cron");

const bot = new Telegraf(config.botToken);

bot.use(session());

const url = 'https://www.kemkes.go.id/';

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

bot.hears(/(jancuk|kontol|memek|goblok|tolol|anjing|jing|cok|jancok|cuk|tae)/i, ctx => {
    // console.log(ctx.update.message.from);
    const username = ctx.update.message.from.username;
    const userId = ctx.update.message.from.id;
    const chatId = ctx.update.message.chat.id;
    const messageId = ctx.update.message.message_id;
    ctx.session.username = ctx.session.username || 0;
    ctx.session.username++;

    ctx.reply(`Halo kaka @${username}, kalau ngomong yang sopan ya!!! \n \n kak @${username} sudah ${ctx.session.username} kali ngomong jorok ya. Nanti aku kick baru tau rasa.`, Object.assign({ 'reply_to_message_id': messageId }));
    // if (ctx.session.username > 3) {
    //     ctx.session.username = 0;
    //     ctx.restrictChatMember(chatId, userId, Object.assign({ 'permissions': { 'can_send_messages': false } }));
    // } else {

    // }    
    // ctx.reply(`Message counter:${ctx.session.username}`)
    // bot.telegram.sendMessage(chatId, `Halo kaka @${messageId}, selamat datang di grup bucin`, ['reply_to_message_id' => messageId]);
});

bot.start(ctx => {
    const username = ctx.update.message.from.username;
    ctx.reply(`Halo kaka @${username}, selamat datang di grup bucin`);
});

routes.forEach(item => {
    if (item.command) {        
        if (item.command == "covid19") {
            axios(url)
                .then(response => {
                    const html = response.data;
                    const $ = cheerio.load(html);
                    const statsTable = $('.info-case > table > tbody > tr');
                    const data = [];
                    let msg = "Data Covdi19 Nasional. ";
                    statsTable.map(function (i) {                        
                        const status = $(this).find('.description').text();
                        const jumlah = $(this).find('.case').text();
                        data.push({
                            'status': status,
                            'jumlah': jumlah
                        });
                        msg += `\n \n ${status} : ${jumlah} \n `;
                    });

                    
                    bot.command(item.command, (ctx) => {
                        ctx.reply(msg);
                    });
                })
                .catch(console.error);
        } else {
            bot.command(item.command, (ctx) => {
                const message = ctx.update.message.text;
                const username = ctx.update.message.from.username;
                ctx.reply(`halo kak @${username}, kaka sekarang menuju menu ${message}`);
            });
        }
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