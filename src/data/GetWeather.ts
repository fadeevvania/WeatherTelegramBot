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

let weather:any;
let api:string = new Pictures(new ConfigService()).getToken;

fetch(`http://api.openweathermap.org/geo/1.0/direct?q=дагестан,RU&limit=1&appid=${api}`)
.then((response)=>{
  if(response.ok){
    return response.json();
  }
  else{
    throw new Error(`${response.status}`)
  }
}).then(response=>{
  weather = response
})


export { weather };
