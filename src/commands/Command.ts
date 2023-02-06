import path from "path";
import { Context, Markup, Telegraf } from "telegraf";
import fsExtra from 'fs-extra';
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
                Markup.button.callback("На пиве","beer"),
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
        this.bot.action("change", (context)=>{
            context.session.Weather = false;
            context.reply("Выбери способ!",Markup.inlineKeyboard([
                Markup.button.callback("На пиве","beer"),
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
                        }
                        else{
                            await context.sendPhoto({source:path});  
                            await deleteFile(path);   
                        }     
                    }
                    if(mainMethod === "light"){
                       path= await textOverlay(context.message.text,data[getRandomInt(0,26)].get("light"));
                        if(path=="error") {
                            await context.sendMessage("Где-то произошла ошибка, попробуйте ещё раз")
                        }
                        else{
                            await context.sendPhoto({source:path});    
                            await deleteFile(path);   
                        } 
                    }
                    if(mainMethod === "dark") {
                        path = await textOverlay(context.message.text,data[getRandomInt(0,22)].get("dark"));
                        if(path=="error") {
                            await context.sendMessage("Где-то произошла ошибка, попробуйте ещё раз")
                        }
                        else{
                            await context.sendPhoto({source:path});   
                            await deleteFile(path);    
                        } 
                    }
                    if(mainMethod === "animal"){
                        path = await textOverlay(context.message.text,data[getRandomInt(0,51)].get("animal"));
                        if(path=="error") {
                            await context.sendMessage("Где-то произошла ошибка, попробуйте ещё раз")
                        }
                        else{
                            await context.sendPhoto({source:path});  
                            await deleteFile(path);     
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

