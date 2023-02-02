import { getWeatherNow } from "../data/GetWeather";
import Jimp from "jimp"
import fsExtra from 'fs-extra';
const TextOnGif:any = require('text-on-gif');

// Для наложения текста поверх картинки/гиф
export const textOverlay = async (text:string,path:string,type:string) =>{
  let  mainText:string = await whatWeather(text);
  const start = mainText.search('br'); 
  var end = mainText.length;
  const weatherTop = mainText.substring(0,start);
  const weatherBottom = mainText.substring(start+2,end);
  console.log(path)
  await cleanFolder('./src/jimp');
  if(type=="img"){
    const image = await Jimp.read(path);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    console.log(weatherTop+" "+weatherBottom);
    image.print(font, image.getWidth()/2-Jimp.measureText(font, weatherTop)*7, 0+image.getHeight()*0.05, weatherTop);
    image.print(font, image.getWidth()/2-Jimp.measureText(font, weatherBottom),image.getHeight()-image.getHeight()*0.1, weatherBottom);
    await image.writeAsync("src/jimp/"+text+".png");
  }
  else{   
    var gif = new TextOnGif({
      file_path:path,
      text: weatherTop,
        aligment_x:"center",
        aligment_y:"top",
        font_size:"16px",
        font_color:	"white",
    });
    await gif.textOnGif({
      text: weatherTop,
      alignment_x:"center",
      alignment_y:"top",
      font_size:"16px",
      font_color:	"white",
      get_as_buffer: false, //set to false to save time
    });
    await gif.textOnGif({
      text: weatherBottom,
        aligment_x:"center",
        aligment_y:"bottom",
        font_size:"8px",
        font_color:	"white",
        get_as_buffer: false, //set to false to save time
        write_path: "src/jimp/"+text+".gif"
    });
  }
 
}

//Для вывода погоды
export const whatWeather = async (city:string):Promise<string>=>{
  let weather:any = await getWeatherNow(city).catch(err => {
    console.error(err)
  });
  let main = weather.data.main;
  return await `В городе ${weather.data.name}brсейчас ${main.temp}°C`;
  // return await`Город:${weather.data.name}\nСейчас: ${main.temp}°C\nОщущается как: ${main.feels_like}°C\nТемпература на сегодня:\nМаксимальная ${main.temp_max}°C минимальная: ${main.temp_min}°C\nОблачность ${weather.data.clouds.all}%`;
}

//Для получения сл. инт числа
export function getRandomInt(min:number, max:number):number {
    min = min;
    max = max;
    return Math.floor(Math.random() * (max - min)) + min;
}

//Для очистки файлов из папки
const cleanFolder = async (folderPath:string)=>{
    fsExtra.emptyDir(folderPath)
  .then(() => {
    console.log('success!')
  })
  .catch(err => {
    console.error(err)
  })
}