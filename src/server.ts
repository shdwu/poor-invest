import App from './app';
import AuthController from './auth/auth.controller';
import DictionaryController from './dictionary/dictionary.controller';
import ExcelController from './excel/excel.controller';
import PoorController from './poor/poor.controller';
import TownController from './town/town.controller';
import UserController from './user/user.controller';
import VillageController from './village/village.controller';
import DemoController from './demo/demo.controller';
import dotenv = require('dotenv');
import validateEnv from './utils/validateEnv';

dotenv.config({ path: '.env' });
validateEnv();

const app = new App([
  new AuthController(),
  new DictionaryController(),
  new ExcelController(),
  new PoorController(),
  new TownController(),
  new UserController(),
  new VillageController(),
  new DemoController()
]);

app.listen();
