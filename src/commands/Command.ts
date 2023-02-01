
import { Context, Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/IContext";
import { pictures } from "../data/GetData";

let mainMethod:string;
export abstract class Command{
    constructor(public bot:Telegraf<IBotContext>){}
    abstract handle():void;
}

export class StartCommand extends Command{
    constructor(public bot:Telegraf<IBotContext>){
        super(bot)
    }

    handle(): void {
        this.bot.start( async (context)=>{
            console.log(context.session)
            await context.sendMessage("Привет, данный бот позволяет узнать погоду различными забавными способами, для начала выбери способ!");
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
        this.bot.action("beer", async (context)=>{
            await context.sendMessage("вот тебе пиво;")
            await context.sendPhoto("")
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
        let checkMessage = (method:string)=>{   
            changeMethod(method);      
                this.bot.on("text", async (context)=>{
                    console.log(mainMethod)
                    if(mainMethod === "img"){
                        await context.replyWithPhoto("");
                    }
                    if(mainMethod === "gif") {
                        await context.replyWithAnimation("");
                    }
                    if(mainMethod === "joke"){
                        await context.sendMessage("");
                    }
                    await context.sendMessage(whatWeather(`${context.message.text}`,mainMethod));
                    context.reply("Ещё раз?",Markup.inlineKeyboard([
                        Markup.button.callback("Да, к выбору способа","change"),
                        Markup.button.callback("Да, но с новым городом","joke")
                    ]))
                })
        }
    }
}

const whatWeather = (city:string,method:string):string=>{
    return `Город: ${city} способом: ${method}`;
}
const changeMethod = (method:string):void=>{
    mainMethod = method;
}
function getRandomIntInclusive(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}