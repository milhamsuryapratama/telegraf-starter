const Telegraf = require('telegraf');
const config = require('./config');
const routes = require('./routes');

const express = require('express');
const cron = require("node-cron");
const app = express();

const bot = new Telegraf(config.botToken);

app.get('/', (req, res, next) => {
    // res.json({ "pesan": "sukses" });
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
});

cron.schedule('*/30 * * * *', () => {
    // console.log('Runing a job at 01:00 at America/Sao_Paulo timezone');
    app.get('/', (req, res) => {
        console.log('run again');
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('success');
});