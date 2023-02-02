import { ConfigService } from "../ConfigService";
import { ICOnfigService } from "../IConfigService";
 
class Pictures {
    private _getToken:string
    constructor(private readonly configService: ICOnfigService){
        this._getToken = this.configService.getKey("WEATHER_TOKEN");
    }
    
    get getToken() {
        return this._getToken;
    }
 
}


let api:string = new Pictures(new ConfigService()).getToken;

let  getWeatherNow = async(city:string) => {
  let weather:any;
  let geo;
  let lon
  let lat
  await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},RU&limit=1&appid=${api}`)
  .then((response)=>{
    if(response.ok){
      return response.json();
    }
    else{
      throw new Error(`${response.status}`);
    }
  }).then(response=>{
    geo = response
     lon = geo[0].lon.toFixed(2)
     lat = geo[0].lat.toFixed(2)
  })
  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${api}`)
    .then((response)=>{
      if(response.ok){
        return response.json();
      }
      else{
        throw Error(`${response.status}`);
      }
    }).then((response)=>{
      weather = response;
    })
 
  
  return weather;
}



export { getWeatherNow };
