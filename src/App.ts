import {session, Telegraf} from "telegraf"
import LocalSession from "telegraf-session-local"
import { Command, StartCommand } from "./commands/Command"
import { ConfigService } from "./ConfigService"
import { IBotContext } from "./context/IContext"
import { ICOnfigService } from "./IConfigService"

class Bot{
    bot:Telegraf<IBotContext>
    commands: Command[] = []
    constructor(private readonly configService: ICOnfigService){
        this.bot = new Telegraf<IBotContext>(this.configService.getKey("TOKEN"))
        this.bot.use((new LocalSession({database: 'jokebotsessions.json'})).middleware())
    }
    init(){
       this.commands =[new StartCommand(this.bot)]
       for(const command of this.commands){
            command.handle();
       }
       this.bot.launch()
    }
}

const bot = new Bot(new ConfigService())
bot.init();