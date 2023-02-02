import { ConfigService } from "../ConfigService";
import { ICOnfigService } from "../IConfigService";
const axios = require('axios').default;
  
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
let  getWeatherNow = async (city:string) => {
  
  const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather`,{
    params: {
      q:city,
      units:"metric",
      lang:"ru",
      appid: api,
    }
  })
  console.log(weather)
  
  return weather;
}



export { getWeatherNow };
