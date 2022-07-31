const http = require('http');
const fs = require('fs');
const requests = require('requests');

const oldData = fs.readFileSync('./home.html','utf-8');

const replaceData = (oldData, newData) => {

    let temp = oldData.replace("{%currtemp%}",newData.current.temp_c);
    temp = temp.replace("{%city%}",newData.location.name);
    temp = temp.replace("{%country%}",newData.location.country);
    temp = temp.replace("{%mintemp%}",newData.current.feelslike_c);
    temp = temp.replace("{%maxtemp%}",newData.current.humidity);
    
    let currWeather = (newData.current.condition.text);

    temp = temp.replace("{%weatherIcon%}",currWeather);
    
    return temp;
}

const server = http.createServer((req,res)=>{
    if(req.url == '/'){
        requests('https://api.weatherapi.com/v1/current.json?key=c540ab3b46144ca4b2174200223007&q=indore&aqi=no')
        .on('data', function (chunk) {
            const apiObj = JSON.parse(chunk);
            const apiArray = [apiObj];
            const realTimeData = apiArray.map((val) => replaceData(oldData,val)).join("");
          
            res.write(realTimeData);
        })
        .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);
            console.log('end');
        });
    }
});

server.listen(9000,'127.0.0.1');

