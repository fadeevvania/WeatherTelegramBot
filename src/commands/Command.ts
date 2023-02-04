import { Context, Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/IContext";
import { data } from "../data/GetData";
import {getRandomInt,textOverlay} from "../functions/functions"


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
        let checkMessage = (method:string)=>{   
            changeMethod(method);      
                this.bot.on("text", async (context)=>{
                    const id:number = (await context.sendMessage("Просим подождать буквально минутку, процесс идёт!")).message_id;
                    if(mainMethod === "img"){                              
                        // textOverlay(context.message.text,data[getRandomInt(0,9)].get("meme"),"img")                    
                        const path:string = await textOverlay(context.message.text,data[getRandomInt(0,9)].get("meme"),"img");
                        if(path=="error") {
                            await context.sendMessage("Где-то роизошла ошибка, попробуйте ещё раз")
                        }
                        else{
                            await context.sendPhoto({source:path});     
                        }     
                    }
                    if(mainMethod === "gif"){
                        // textOverlay(context.message.text,data[getRandomInt(0,14)].get("gifs"),"gif");
                        const path:string = await textOverlay(context.message.text,data[getRandomInt(0,14)].get("gifs"),"gif")
                        if(path=="error") {
                            await context.sendMessage("Где-то роизошла ошибка, попробуйте ещё раз")
                        }
                        else{
                            await context.sendAnimation({source:path});     
                        } 
                    }
                    if(mainMethod === "light"){
                        // textOverlay(context.message.text,data[getRandomInt(0,24)].get("beer"),"img");
                        const path:string = await textOverlay(context.message.text,data[getRandomInt(0,24)].get("beer"),"img");
                        if(path=="error") {
                            await context.sendMessage("Где-то роизошла ошибка, попробуйте ещё раз")
                        }
                        else{
                            await context.sendPhoto({source:path});     
                        } 
                        // await context.sendPhoto(data[getRandomInt(0,24)].get("beer"));
                    }
                    if(mainMethod === "dark") {
                        // textOverlay(context.message.text,data[getRandomInt(25,50)].get("beer"),"img");
                        const path:string = await textOverlay(context.message.text,data[getRandomInt(25,50)].get("beer"),"img");
                        if(path=="error") {
                            await context.sendMessage("Где-то роизошла ошибка, попробуйте ещё раз")
                        }
                        else{
                            await context.sendPhoto({source:path});     
                        } 
                        // await context.sendPhoto(data[getRandomInt(25,50)].get("beer"));
                    }
                    if(mainMethod === "animal"){
                        // textOverlay(context.message.text,data[getRandomInt(0,16)].get("animal"),"img");
                        const path:string = await textOverlay(context.message.text,data[getRandomInt(0,16)].get("animal"),"img");
                        if(path=="error") {
                            await context.sendMessage("Где-то роизошла ошибка, попробуйте ещё раз")
                        }
                        else{
                            await context.sendPhoto({source:path});     
                        } 
                        // await context.sendPhoto(data[getRandomInt(0,15)].get("animal"));
                    }
                    // await context.sendMessage(await whatWeather(`${context.message.text}`));
                    context.deleteMessage(id)
                    context.reply("Ещё раз?",Markup.inlineKeyboard([
                        Markup.button.callback("Да, к выбору способа","change"),
                        Markup.button.callback("Да, но с новым городом","change")
                    ]))
                })
        }
        
    }
}
const changeMethod = (method:string):void=>{
    mainMethod = method;
}