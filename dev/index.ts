import { loadHotReload, getDevOption } from './dev'
//@ts-ignore
import App from '../main/app'
console.log(`electron app running at development mode.`)
loadHotReload()
App.getInstance().launchWithOptionsBuilder(getDevOption)