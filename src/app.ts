import Telegraf, {
    SceneContextMessageUpdate,
    Stage,
    Markup,
    UrlButton,
    session,
    Extra,
    Button
} from 'telegraf';
import Controller from './classes/controller';
import { BotToken } from '../config.private';

export default class App {
    private static menuButtons: (Button | UrlButton)[][] = [];

    private bot: Telegraf<SceneContextMessageUpdate>;

    constructor(...controllers: Controller[]) {
        this.bot = new Telegraf(BotToken);
        this.bot.use(session());

        this.initializeSceneControllers(controllers);

    }

    public async listen() {
        console.log(`\x1b[34mCONECTANDO CON BOT DE TELEGRAM...\x1b[0m`);
        await this.bot.launch();
        console.log(`\x1b[32mBOT CONECTADO CORRECTAMENTE\x1b[0m`);
    }

    private initializeSceneControllers(controllers: Controller[]) {
        const stage = new Stage(controllers.map(x => x.scene), { ttl: 10 });
        stage.command('quit', Stage.leave());
        this.bot.use(stage.middleware());
        for (const controller of controllers) {
            // Creamos la opcion en la ui
            App.menuButtons.push([Markup.button(controller.title)]);
            // Escuchamos la palabra para entrar
            this.bot.hears(controller.title, async (ctx) => {
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
        const markup = Markup.keyboard(App.menuButtons).oneTime().resize().extra();
        await ctx.reply('Hola soy Salucito, el robot del Ministerio de Salud de San Juan\n' +
        'Dime en que te puedo ayudar?', markup);
    }
}
