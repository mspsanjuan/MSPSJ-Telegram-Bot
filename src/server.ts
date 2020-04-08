import App from './app';
// Controllers
import Covid19Controller from './controllers/covid-19';

const app = new App(
    new Covid19Controller(),
);

app.listen();
