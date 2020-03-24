import App from './app'
import AuthController from './auth/auth.controller'
import DictionaryController from './dictionary/dictionary.controller'
import PoorController from './poor/poor.controller'
import { UserController } from './user'
import { VillageController } from './village'
import { TownController } from './town'
import DemoController from './demo/demo.controller'
import dotenv = require('dotenv')
import validateEnv from './utils/validateEnv'

dotenv.config({ path: '.env' })
validateEnv()

const app = new App([
  new AuthController(),
  new DictionaryController(),
  new PoorController(),
  new UserController(),
  new VillageController(),
  new DemoController(),
  new TownController(),
])

app.listen()
