import { ConfigService } from "../ConfigService";
import { ICOnfigService } from "../IConfigService";
 
class Pictures {
    private _getToken:string
    constructor(private readonly configService: ICOnfigService){
        this._getToken = this.configService.getKey("AIR_TOKEN");
    }
    
    get getToken() {
        return this._getToken;
    }
 
}

let data:any;
let api:string = new Pictures(new ConfigService()).getToken;
let Airtable = require('airtable');
let base = new Airtable({apiKey: api}).base('appgovePiPbjUmH1S');

base('Table 1').select({
  view: 'Grid view'
}).firstPage(function(err:Error, records:any) {
  if (err) { console.error(err); return; }
  data = records
});

export { data };
