const Telegraf = require('telegraf');
const config = require('./config');
const routes = require('./routes');
const axios = require('axios');
const session = require('telegraf/session');

const cheerio = require('cheerio');
const find = require('cheerio-eq');

const express = require('express');
const app = express();
const cron = require("node-cron");

const bot = new Telegraf(config.botToken);

bot.use(session());

const url = 'https://www.kemkes.go.id/';
const jatim = 'http://covid19dev.jatimprov.go.id/xweb/draxi';

app.get('/', (req, res) => {
    res.send("HALO");
});

app.get('/covid19jatim', (req, res) => {
    axios(jatim)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const jatimData = $('.table > tbody > tr');
        const data = [];
        jatimData.map(function (i) {
            const kota = find($, `.table > tbody > tr:eq(${i}) > td:eq(0)`).text();
            const odp = find($, `.table > tbody > tr:eq(${i}) > td:eq(1)`).text();
            const pdp = find($, `.table > tbody > tr:eq(${i}) > td:eq(2)`).text();
            const confirm = find($, `.table > tbody > tr:eq(${i}) > td:eq(3)`).text();
            data.push({ kota, odp, pdp, confirm });
        });
        // console.log(data);
        res.status(200).json(data);
    })
    .catch(console.error); 
});

app.get('/covid19nasional', (req, res) => {
    axios(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const statsTable = $('.info-case > table > tbody > tr');
            const data = [];
            statsTable.map(function (i) {
                // if (i == 1) {
                //     return false;
                // }
                const status = $(this).find('.description').text();
                const jumlah = $(this).find('.case').text();
                data.push({
                    'status': status,
                    'jumlah': jumlah
                });
            });
            res.status(200).json(data);
        })
        .catch(console.error);
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
            covidNasional(item.command);
        } else if (item.command == "covid19jatim") {
            covidJatim(item.command);
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

function covidNasional(route) {
    axios(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const statsTable = $('.info-case > table > tbody > tr');
            const data = [];
            let msg = "Data Covid19 Nasional \n";                        
            statsTable.map(function (i) {
                // if (i == 1) {
                //     return false;
                // }
                let status = $(this).find('.description').text();
                let jumlah = $(this).find('.case').text();
                data.push({
                    'status': status,
                    'jumlah': jumlah
                });
                msg += `Status : ${status} : Jumlah ${jumlah} \n`;
            });
            bot.command(route, (ctx) => {
                ctx.reply(msg);
            });
        })
        .catch(console.error);
}

function covidJatim(route) {
    axios('http://bot-ilham.herokuapp.com/covid19jatim')
        .then(response => {
            let msg = "Data Covid19 Jawa Timur \n\n";
            response.data.forEach(function (value, index) {
                msg += `${value.kota} | ODP : ${value.odp} | PDP : ${value.pdp} | Positif : ${value.confirm} \n\n`;
            })
            
            bot.command(route, (ctx) => {
                ctx.reply(msg);
            });
        })
        .catch(console.error);
}

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
    axios(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const statsTable = $('.info-case > table > tbody > tr');
            const data = [];
            let msg = "Data Covid19 Nasional \n";                        
            statsTable.map(function (i) {
                // if (i == 1) {
                //     return false;
                // }
                let status = $(this).find('.description').text();
                let jumlah = $(this).find('.case').text();
                data.push({
                    'status': status,
                    'jumlah': jumlah
                });
                msg += `Status : ${status} : Jumlah ${jumlah} \n`;
            });
            bot.telegram.sendMessage('-1001374864884', msg);
        })
        .catch(console.error);
    // axios.get('http://api.openweathermap.org/data/2.5/weather?q=Paiton,ina&APPID=c3a30d9189bba5ae819a95aa53ecb50b&units=metric')
    //     .then(function (response) {
    //         console.log(response.data.weather);
    //         //-1001374864884
    //         //547059684
    //         bot.telegram.sendMessage('-1001374864884', `
    //             Cuaca Hari Ini 
    //             Date : ${new Date()} 
    //             Location : ${response.data.name} 
    //             Weather : ${response.data.weather[0].description}  
    //             Temperature : ${response.data.main.temp} Celcius 
    //             Min temperature : ${response.data.main.temp_min} Celcius 
    //             Max temperature : ${response.data.main.temp_max} Celcius 
    //             Wind speed : ${response.data.wind.speed} meter/sec
    //         `);
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     })
}, {
    scheduled: true,
    timezone: "Asia/Jakarta"
});

app.listen(process.env.PORT || 3000, () => {
    console.log('success');
});