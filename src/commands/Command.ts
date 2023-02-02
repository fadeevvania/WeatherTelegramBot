
import { Context, Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/IContext";
import { data } from "../data/GetData";
import { getWeatherNow } from "../data/GetWeather";

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
        this.bot.action("animal", async (context)=>{
            context.sendMessage("Напиши город, в котором хочешь узнать погоду с животным");
            checkMessage("animal");
        })
        this.bot.action("beer", (context)=>{
            context.session.Weather = true;
            context.reply("Как именно?",Markup.inlineKeyboard([
                Markup.button.callback("Светлое","light"),
                Markup.button.callback("Тёмное","dark"),
                Markup.button.callback("Изменить способ","change")
            ]))          
        })
       
        this.bot.action("light",(context)=>{
            context.sendMessage("Напиши город, в котором хочешь узнать погоду с пивком");
            checkMessage("light");    
        })
        this.bot.action("dark",(context)=>{
            context.sendMessage("Напиши город, в котором хочешь узнать погоду с пивком");
            checkMessage("dark");    
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
        let checkMessage = (method:string)=>{   
            changeMethod(method);      
                this.bot.on("text", async (context)=>{
                    // if(mainMethod === "img"){
                    //     await context.replyWithPhoto("");
                    // }
                    // if(mainMethod === "gif") {
                    //     await context.replyWithAnimation("");
                    // }
                    // if(mainMethod === "joke"){
                    //     await context.sendMessage("");
                    // }
                    if(mainMethod === "light"){
                        await context.sendPhoto(data[getRandomInt(0,24)].get("beer"));
                    }
                    if(mainMethod === "dark") {
                        await context.sendPhoto(data[getRandomInt(25,50)].get("beer"));
                    }
                    if(mainMethod === "animal"){
                        await context.sendPhoto(data[getRandomInt(0,15)].get("animal"));
                    }
                    await context.sendMessage(await whatWeather(`${context.message.text}`));
                    context.reply("Ещё раз?",Markup.inlineKeyboard([
                        Markup.button.callback("Да, к выбору способа","change"),
                        Markup.button.callback("Да, но с новым городом","change")
                    ]))
                })
        }
        
    }
}

const whatWeather = async (city:string):Promise<string>=>{
    let weather:any = await getWeatherNow(city);
    let main = weather.data.main;
    return await`Город:${weather.data.name}\nСейчас: ${main.temp}°C\nОщущается как: ${main.feels_like}°C\nТемпература на сегодня:\nМаксимальная ${main.temp_max}°C минимальная: ${main.temp_min}°C\nОблачность ${weather.data.clouds.all}%`;
}
const changeMethod = (method:string):void=>{
    mainMethod = method;
}
function getRandomInt(min:number, max:number):number {
    min = min;
    max = max;
    return Math.floor(Math.random() * (max - min)) + min;
}