import Telegraf, { Extra, Markup, BaseScene, Stage, session, SceneContextMessageUpdate } from 'telegraf';
// import Markup from 'telegraf/markup';
// import Extra from 'telegraf/extra';

import { BotToken } from './config.private';


const keyboard = Markup.inlineKeyboard([
    [Markup.urlButton('❤️', 'http://telegraf.js.org')],
    [Markup.callbackButton('Delete', 'delete')]
]);

// Greeter scene
const greeterScene = new BaseScene('greeter');
greeterScene.enter((ctx) => ctx.reply('Hi'));
greeterScene.command('prueba', (ctx) => ctx.reply('Realizando prueba en greeter'));
greeterScene.leave((ctx) => ctx.reply('Bye'));
greeterScene.hears('hi', Stage.enter('greeter'));
greeterScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'));

// Echo scene
const echoScene = new BaseScene('echo');
echoScene.enter((ctx) => ctx.reply('echo scene'));
echoScene.leave((ctx) => ctx.reply('exiting echo scene'));
echoScene.command('back', Stage.leave());
echoScene.command('prueba', (ctx) => ctx.reply('Realizando prueba echo'));
echoScene.on('text', (ctx) => ctx.reply(ctx.message.text));
echoScene.on('message', (ctx) => ctx.reply('Only text messages please'));

const bot = new Telegraf(BotToken);
const stage = new Stage([greeterScene, echoScene], { ttl: 10 });

bot.use(session());
bot.use(stage.middleware());
bot.command('greeter', (ctx) => ctx.scene.enter('greeter'));
bot.command('echo', (ctx) => ctx.scene.enter('echo'));
bot.on('message', (ctx) => ctx.reply('Try /echo or /greeter'));

// bot.start((ctx) => ctx.reply('Welcome!'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));

// bot.on('sticker', (ctx) => ctx.reply('👍'));
// bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.chat.id, ctx.message, Extra.markup(keyboard)));

bot.startPolling();

console.log('Bot de telegram iniciado!');
