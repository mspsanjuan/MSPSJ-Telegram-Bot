import Telegraf, {
    BaseScene,
    SceneContextMessageUpdate,
    Markup,
    Stage,
    Middleware
} from 'telegraf';
import { createReadStream } from 'fs';
import Controller from '../../classes/controller';
import App from '../../app';
import { join } from 'path';
import { BackTitle, HomeTitle } from '../../utils/titles';

const opciones = {
    register: '🤒 Registrarme como paciente con COVID-19 Positivo',
};

export default class Covid19Controller extends Controller {

    protected _title: string;
    protected _actionName: string;
    protected _scene: BaseScene<SceneContextMessageUpdate>;

    private opciones: {[key: string]: string} = {};

    constructor() {
        super();
        this._title = '🦠 COVID-19';
        // this._actionName = 'covid19';
        this._scene = new BaseScene('COVID-19');
        this.initialize();
    }

    private initialize() {
        this.scene.enter(this.sendEnterMessage);
        this.scene.leave(this.sendLeaveMessage, App.sendStartMensaje);

        this.scene.hears(opciones.register, this.registrarPaciente);
        this.scene.hears(BackTitle, this.sendEnterMessage);
        this.scene.hears(HomeTitle, ctx => ctx.scene.leave());

        this.scene.command('start', (ctx) => ctx.reply('Yendo al inicio!'));
    }

    private sendEnterMessage(ctx: SceneContextMessageUpdate, next) {
        const opMenu = Markup.keyboard([
            [Markup.button(opciones.register)],
            [Markup.button(HomeTitle)],
        ]).oneTime().resize().extra();
        ctx.reply('Bienvenido al portal de COVID-19:\n' +
        '\n' +
        'Seleccione alguna de las siguientes opciones', opMenu);
        next();
    }

    private async sendLeaveMessage(ctx: SceneContextMessageUpdate, next) {
        await ctx.reply('Saliendo del portal de COVID-19...');
        next();
    }

    private async registrarPaciente(ctx: SceneContextMessageUpdate, next) {
        const opMenu = Markup.keyboard([
            [Markup.button(BackTitle), Markup.button(HomeTitle)],
        ]).oneTime().resize().extra();

        await ctx.reply('¡Usted fué registrado exitosamente!');
        // await ctx.replyWithVideo({
        //     filename: 'dacing-funeral-meme.mp4',
        //     source: createReadStream(join('', 'src/assets/videos/dacing-funeral-meme.mp4')),
        // }, opMenu);
        await ctx.reply('Opciones: ', opMenu);
        next();
    }
}

// const Covid19Scene = new BaseScene('COVID-19');

// Covid19Scene.enter(ctx => {
//     ctx.reply('Bienvenido al portal de COVID-19 sr infectado');
// });

// export default Covid19Scene;
