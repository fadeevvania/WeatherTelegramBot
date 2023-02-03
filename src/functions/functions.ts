import { getWeatherNow } from "../data/GetWeather";
import Jimp from "jimp"
import fsExtra from 'fs-extra';
const TextOnGif:any = require('text-on-gif');
import sharp from "sharp";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

// Наложение тексти на картинки и гиф
export const textOverlay = async (text:string,path:string,type:string):Promise<string> =>{
    let  mainText:string = await whatWeather(text);
    const start = mainText.search('br'); 
    var end = mainText.length;
    const weatherTop = mainText.substring(0,start);
    const weatherBottom = mainText.substring(start+2,end);
    console.log(path)
    console.log(weatherTop+" "+weatherBottom)
    await cleanFolder('./src/jimp');
    await cleanFolder('./dist/jimp');
    if(type=="img"){
      const image = await Jimp.read(path);
      await image.writeAsync("src/jimp/"+text+".png");
      const textFull:Buffer = Buffer.from(`<svg height="${image.getHeight()}" width="${image.getWidth()}">
          <text font-size="64" x="${image.getWidth()/2-textLength(weatherTop,64)}" y="${0+image.getHeight()*0.15}" textanchor="middle"  font-width="bold" fill="#fff" font-family="sans-serif">
            ${weatherTop}
          </text>
          <text font-size="64" x="${image.getWidth()/2-textLength(weatherBottom,64)}" y="${image.getHeight()-image.getHeight()*0.1}" textanchor="middle" font-width="bold" fill="#fff" font-family="sans-serif">
            ${weatherBottom}
          </text>
      </svg>`)
    const img = sharp(await readFile("./src/jimp/"+text+".png")).composite([{input:textFull}]).png().toBuffer()
    await writeFile(resolve(`./dist/jimp/${text}.png`),await img)
      return `dist/jimp/${text}.png`
    }
    if(type=="gif"){
      var gif =await new TextOnGif({
        file_path:path,
      });
      gif.font_color = "white";
      gif.alignment_y ="top"
      await gif.textOnGif({
        text: weatherTop,
        font_size:"8px", 
        write_path: "src/jimp/"+text+".gif"
      });
        var buffer = await new TextOnGif({
          file_path:"src/jimp/"+text+".gif",
          get_as_buffer: true,
        })
        buffer.font_color = "white";
        buffer.alignment_y ="bottom";
        await buffer.textOnGif({
          text: weatherBottom,
          font_size:"8px",
          get_as_buffer: true,
          write_path:"dist/jimp/"+text+"1"+".gif",
        })
        return "dist/jimp/"+text+"1"+".gif"
    }
    return "Че-то ошибка"
  }

//Погода
export const whatWeather = async (city:string):Promise<string>=>{
  let weather:any = await getWeatherNow(city).catch(err => {
    console.error(err)
  });
  let main = weather.data.main;
  return await `В городе ${weather.data.name}brСейчас ${main.temp}°C`;
}

//Сл. инт число
export function getRandomInt(min:number, max:number):number {
    min = min;
    max = max;
    return Math.floor(Math.random() * (max - min)) + min;
}

//Очистка папки
const cleanFolder = async (folderPath:string)=>{
    fsExtra.emptyDir(folderPath)
  .then(() => {
    console.log('success!')
  })
  .catch(err => {
    console.error(err)
  })
}
//Для точного измерения длины шрифта
function textLength(phrase:string, fontsize:number):number
{
   let ml = 0.2645833333333;
   return phrase.split('').length*fontsize*ml;
}