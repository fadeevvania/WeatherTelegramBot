import { Context, Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/IContext";
import { data  } from "../data/GetData";
import {getRandomInt,textOverlay,cleanFolder,deleteFile} from "../functions/functions"


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
            await context.sendMessage(`Привет ${context.message.from.first_name?context.message.from.first_name:"Другалек"}, данный бот позволяет узнать погоду различными забавными способами, для начала выбери способ!`);
            context.reply("Выбери способ!",Markup.inlineKeyboard([
                Markup.button.callback("На напитке","beer"),
                Markup.button.callback("На меме","img"),
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
                Markup.button.callback("С газом","light"),
                Markup.button.callback("Без газа","dark"),
                Markup.button.callback("Изменить способ","change")
            ]))          
        })
       
        this.bot.action("light",(context)=>{
            context.sendMessage("Напиши город, в котором хочешь узнать погоду с напитком");
            checkMessage("light");    
        })
        this.bot.action("dark",(context)=>{
            context.sendMessage("Напиши город, в котором хочешь узнать погоду с напитком");
            checkMessage("dark");    
        })
        this.bot.action("change", (context)=>{
            context.reply("Выбери способ!",Markup.inlineKeyboard([
                Markup.button.callback("На напитке","beer"),
                Markup.button.callback("На меме","img"),
                Markup.button.callback("На милом животном","animal")
            ]))
        })
        this.bot.action("img",(context)=>{
            context.sendMessage("Напиши город, в котором хочешь узнать погоду в формате мема");
            checkMessage("img");  
        })
        let checkMessage = (method:string)=>{   
            changeMethod(method);      
                this.bot.on("text", async (context)=>{
                    const id:number = (await context.sendMessage("Просим подождать буквально минутку, процесс идёт!")).message_id;
                    let path:string="";
                    if(mainMethod === "img"){                                             
                        path = await textOverlay(context.message.text,data[getRandomInt(0,19)].get("img"));
                        if(path=="error") {
                            await context.sendMessage("Где-то произошла ошибка, попробуйте ещё раз")
                            context.session.Weather = false;
                        }
                        else{
                            await context.sendPhoto({source:path});  
                            await deleteFile(path); 
                            context.session.Weather = true;  
                        }     
                    }
                    if(mainMethod === "light"){
                       path= await textOverlay(context.message.text,data[getRandomInt(0,19)].get("gas"));
                        if(path=="error") {
                            await context.sendMessage("Где-то произошла ошибка, попробуйте ещё раз")
                            context.session.Weather = false;
                        }
                        else{
                            await context.sendPhoto({source:path});    
                            await deleteFile(path);   
                            context.session.Weather = true;
                        } 
                    }
                    if(mainMethod === "dark") {
                        path = await textOverlay(context.message.text,data[getRandomInt(0,14)].get("nogas"));
                        if(path=="error") {
                            await context.sendMessage("Где-то произошла ошибка, попробуйте ещё раз")
                            context.session.Weather = false;
                        }
                        else{
                            await context.sendPhoto({source:path});   
                            await deleteFile(path);   
                            context.session.Weather = true; 
                        } 
                    }
                    if(mainMethod === "animal"){
                        path = await textOverlay(context.message.text,data[getRandomInt(0,51)].get("animal"));
                        if(path=="error") {
                            await context.sendMessage("Где-то произошла ошибка, попробуйте ещё раз")
                            context.session.Weather = false;
                        }
                        else{
                            await context.sendPhoto({source:path});  
                            await deleteFile(path);    
                            context.session.Weather = true; 
                        } 
                    }
                    context.deleteMessage(id)
                    await 
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

