import { Context } from "telegraf";

export interface SessionData{
    Weather:boolean;
}

export interface IBotContext extends Context{
    session: SessionData;
}