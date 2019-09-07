const Telegraf = require('telegraf');
const config = require('./config');
const routes = require('./routes');

const bot = new Telegraf(config.botToken);

bot.start((ctx) => ctx.reply('Welcome'));

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
            const username = ctx.update.message.new_chat_members.username;
            ctx.reply(`halo kaka @${username} selamat datang di grup bucin`);
        });
    }
});

bot.launch();