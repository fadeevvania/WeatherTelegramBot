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

let pictures:any;
let url:string = "https://api.airtable.com/v0/";
let api:string = new Pictures(new ConfigService()).getToken;
// let baseid:string = "appgovePiPbjUmH1S";
let tableid:string = "/Table%201/";
// let fullurl:string = url + baseid + tableid;
// let req:Request = new Request(fullurl,{method:"GET", headers:{"Authorization":api}})

// fetch(req)
//   .then(response => {
//     if (response.status === 200) {
//       return response.json();
//     } else {
//       throw new Error(`${response.status}`);
//     }
//   })
//   .then(response => {
//     console.debug(response);
//     records = response;
//   }).catch(error => {
//     console.error(error);
//   });

var Airtable = require('airtable');
var base = new Airtable({apiKey: api}).base('appgovePiPbjUmH1S');

base('Table 1').select({
  view: 'Grid view'
}).firstPage(function(err:any, records:any) {
  if (err) { console.error(err); return; }
  pictures = records
});

export { pictures };
