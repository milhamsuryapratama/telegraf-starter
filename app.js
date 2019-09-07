const Telegraf = require('telegraf');
const config = require('./config');
const routes = require('./routes');

const express = require('express');
const app = express();

const bot = new Telegraf(config.botToken);

app.get('/', (req, res, next) => {
    res.json({ "pesan": "sukses" });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('success');
})

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