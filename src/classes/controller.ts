import Telegraf, { SceneContextMessageUpdate, BaseScene, Middleware } from 'telegraf';

export default abstract class Controller {
    /**
     * Titulo que se muestra en las opciones
     */
    public get title() {
        return this._title;
    }
    // /**
    //  * Accion para invocar la escena
    //  */
    // public get actionName() {
    //     return this._actionName;
    // }
    /**
     * Escena de Telegram
     */
    public get scene() {
        return this._scene;
    }

    protected abstract _title: string;
    // protected abstract _actionName: string;
    protected abstract _scene: BaseScene<SceneContextMessageUpdate>;
}

// export default interface Controller {
//     /**
//      * Titulo que se muestra en las opciones
//      */
//     title: string;
//     /**
//      * Comando para invocar la escena
//      */
//     actionName: string;
//     /**
//      * Escena de Telegram
//      */
//     scene: BaseScene<SceneContextMessageUpdate>;

//     leave?: {
//         after: Middleware<SceneContextMessageUpdate>[];
//     };
//     afterLeave?:
// }
