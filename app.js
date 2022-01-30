import http from 'http'
import express from 'express';
import path from 'path'
import cheerio from 'cheerio'
import request from 'request-promise'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("express"));
// default URL for website
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);

const variables = [{'ElrondApes': 'https://deadrare.io/collection/EAPES-8f3c1f'},{
    'Drifters' : 'https://deadrare.io/collection/DRIFTERS-efd96c'
}]

function getData(data){
    request(data[0], (error, response, html) => {
        if(!error && response.statusCode==200) {
            const $= cheerio.load(html);
            const url = data[0];
            const datarow= $('h2');
            const arr= datarow.next().children();
            const output = arr[0].children[1].children[0].children[0].data;
            const obj = {}
            obj['url'] = url;
            obj['price'] = output;
            obj['timestamp'] = Date.now();
            const fileData = JSON.parse(fs.readFileSync('data.json'))
            fileData.push(obj)
            fs.writeFileSync('data.json', JSON.stringify(fileData, null, 2));
        } else{
            console.log('error')
        }
    });
}

setInterval(PopulateJson,  60* 6 * 1000)

function PopulateJson() {
    for(var i=0; i<variables.length; i++){
        getData(Object.values(variables[i]))
    }
}
