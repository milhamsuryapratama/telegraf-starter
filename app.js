const Telegraf = require('telegraf');
const config = require('./config');
const routes = require('./routes');

const bot = new Telegraf(config.botToken);

bot.start((ctx) => ctx.reply('Welcome'));

routes.forEach(item => {
    if (item.command) {
        bot.command(item.command, (ctx) => {
            const message = ctx.update.message.text;
            ctx.reply(message);
        });
    }
});

bot.launch();