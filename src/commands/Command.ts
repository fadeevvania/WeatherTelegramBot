
import { Context, Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/IContext";
import { pictures } from "../data/GetData";

export abstract class Command{
    constructor(public bot:Telegraf<IBotContext>){}
    abstract handle():void;
}

export class StartCommand extends Command{
    constructor(public bot:Telegraf<IBotContext>){
        super(bot)
    }

    handle(): void {
        this.bot.start((context)=>{
            console.log(context.session)
            context.sendMessage("Привет, данный бот позволяет узнать погоду различными забавными способами, для начала выбери способ!");
            context.reply("Выбери способ!",Markup.inlineKeyboard([
                Markup.button.callback("На пиве","beer"),
                Markup.button.callback("На меме","meme"),
                Markup.button.callback("На милом животном","animal")
            ]))
        })
        this.bot.action("meme", (context)=>{
            context.session.Weather = true;
            context.reply("Как именно?",Markup.inlineKeyboard([
                Markup.button.callback("Гифкой","gif"),
                Markup.button.callback("Картинкой","img"),
                Markup.button.callback("Анекдотом","joke"),
                Markup.button.callback("Изменить способ","change")
            ]))          
        })
        this.bot.action("change", (context)=>{
            context.session.Weather = false;
            context.reply("Выбери способ!",Markup.inlineKeyboard([
                Markup.button.callback("На пиве","beer"),
                Markup.button.callback("На меме","meme"),
                Markup.button.callback("На милом животном","animal")
            ]))
        })
        this.bot.action("gif",(context)=>{
            context.sendMessage("Напиши город, в котором хочешь узнать погоду в формате gif");
            checkMessage("gif");
        })
        this.bot.action("img",(context)=>{
            context.sendMessage("Напиши город, в котором хочешь узнать погоду в формате мема");
            checkMessage("img");
        })
        this.bot.action("joke",(context)=>{
            context.sendMessage("Напиши город, в котором хочешь узнать погоду в формате анекдота");
            checkMessage("joke");
        })
        this.bot.action("animal", async (context)=>{
            await context.sendMessage(`Вот тебе пикча`)
            await context.sendPhoto(pictures[15].get('animal'))
        })
        const checkMessage =(method:string)=>{
            return( this.bot.on("text",(context)=>{
                    context.sendMessage(whatWeather(context.message.text,method));
                })
            )
        }
    }
}

const whatWeather = (city:string,method:string):string=>{
    return `Город: ${city} способом ${method}`;
}
function getRandomIntInclusive(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}