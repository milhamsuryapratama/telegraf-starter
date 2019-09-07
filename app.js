const Telegraf = require('telegraf');
const config = require('./config');

const bot = new Telegraf(config.botToken);

bot.start((ctx) => ctx.reply('Welcome'));

bot.launch();