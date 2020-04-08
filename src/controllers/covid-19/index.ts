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
import { BackAction, HomeAction } from '../../utils/actions';

const opciones = {
    register: {
        title: '🤒 Registrarme como paciente con COVID-19 Positivo',
        actionName: 'register',
    }
};

export default class Covid19Controller extends Controller {

    protected _title: string;
    protected _actionName: string;
    protected _scene: BaseScene<SceneContextMessageUpdate>;

    constructor() {
        super();
        this._title = '🦠 COVID-19';
        this._actionName = 'covid19';
        this._scene = new BaseScene('COVID-19');
        this.initialize();
    }

    private initialize() {
        this.scene.enter(this.sendEnterMessage);
        this.scene.leave(this.sendLeaveMessage, App.sendStartMensaje);

        this.scene.action(opciones.register.actionName, this.registrarPaciente);
        this.scene.action(BackAction.actionName, this.sendEnterMessage);
        this.scene.action(HomeAction.actionName, this.backToHome);

        this.scene.command('start', (ctx) => ctx.reply('Yendo al inicio!'));
    }

    private async sendEnterMessage(ctx: SceneContextMessageUpdate) {
        const opMenu = Markup.inlineKeyboard([
            [Markup.callbackButton(opciones.register.title, opciones.register.actionName)],
            [Markup.callbackButton(HomeAction.title, HomeAction.actionName)],
        ]).resize().extra();
        await ctx.answerCbQuery();
        await ctx.editMessageText('Bienvenido al portal de COVID-19:\n' +
        '\n' +
        'Seleccione alguna de las siguientes opciones', opMenu);
    }

    private async sendLeaveMessage(ctx: SceneContextMessageUpdate, next) {
        await ctx.reply('Saliendo del portal de COVID-19...');
        next();
    }

    private async registrarPaciente(ctx: SceneContextMessageUpdate) {
        const opMenu = Markup.inlineKeyboard([
            [Markup.callbackButton(BackAction.title, BackAction.actionName), Markup.callbackButton(HomeAction.title, HomeAction.actionName)],
        ]).resize().extra();

        await ctx.reply('¡Usted fué registrado exitosamente!');
        await ctx.replyWithVideo({
            filename: 'dacing-funeral-meme.mp4',
            source: createReadStream(join('', 'src/assets/videos/dacing-funeral-meme.mp4')),
        }, opMenu);
        // await ctx.reply('Opciones: ', opMenu);
    }

    private async backToHome(ctx: SceneContextMessageUpdate) {
        await ctx.answerCbQuery();
        await ctx.scene.leave();
    }
}

// const Covid19Scene = new BaseScene('COVID-19');

// Covid19Scene.enter(ctx => {
//     ctx.reply('Bienvenido al portal de COVID-19 sr infectado');
// });

// export default Covid19Scene;
