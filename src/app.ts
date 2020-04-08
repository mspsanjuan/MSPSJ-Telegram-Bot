import Telegraf, {
    SceneContextMessageUpdate,
    Stage,
    Markup,
    UrlButton,
    session,
    CallbackButton
} from 'telegraf';
import Controller from './classes/controller';
import { BotToken } from '../config.private';
import { HomeAction } from './utils/actions';

export default class App {
    private static menuButtons: (CallbackButton | UrlButton)[][] = [];

    private bot: Telegraf<SceneContextMessageUpdate>;

    constructor(...controllers: Controller[]) {
        this.bot = new Telegraf(BotToken);
        this.bot.use(Telegraf.log());
        this.bot.use(session());

        this.initializeSceneControllers(controllers);

        this.bot.on('message', this.sendHelpMessage);
    }

    public async listen() {
        console.log(`\x1b[34mCONECTANDO CON BOT DE TELEGRAM...\x1b[0m`);
        await this.bot.launch();
        console.log(`\x1b[32mBOT CONECTADO CORRECTAMENTE\x1b[0m`);
    }

    private initializeSceneControllers(controllers: Controller[]) {
        const stage = new Stage(controllers.map(x => x.scene), { ttl: 10 });
        this.bot.use(stage.middleware());
        for (const controller of controllers) {
            // Creamos la opcion en la ui
            App.menuButtons.push([Markup.callbackButton(controller.title, controller.actionName)]);
            // Esperamos la accion para entrar
            this.bot.action(controller.actionName, async (ctx) => {
                await ctx.answerCbQuery();
                await ctx.scene.enter(controller.scene.id);
            });
        }

        this.bot.start(App.sendStartMensaje);
    }

    /**
     * Envia el msj de bienvenida al usuario
     * y lista las opciones disponibles
     */
    static async sendStartMensaje(ctx: SceneContextMessageUpdate) {
        const markup = Markup.inlineKeyboard(App.menuButtons).extra();
        const msg = 'Hola soy SALUCITO, el robot del Ministerio de Salud de San Juan\n' +
        'Dime en que te puedo ayudar?';
        // console.log(ctx.callbackQuery.data);
        if (ctx.callbackQuery && ctx.callbackQuery.data === HomeAction.actionName) {
            await ctx.editMessageText(msg, markup);
        } else {
            await ctx.reply(msg, markup);
        }
    }

    /**
     * Envia un mensaje de ayuda cuando
     * un usuario escribe algo que no es reconocido por el bot
     * @param ctx 
     */
    private async sendHelpMessage(ctx: SceneContextMessageUpdate) {
        const msg = 'No entendi lo que quisiste de decir. \n' +
        'Recordá que podes ver mis opciones haciendo ingresando /start';
        await ctx.reply(msg);
    }
}
