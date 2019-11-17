const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
var request = require('request');

const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  // res.send('calculator')
  res.sendFile(__dirname + "/index.html");
})

app.get('/priceConversion', (req, res) => {
  let crypto = req.query.from ;
  let currency = req.query.to ;
  let amount = req.query.amount ;
  let options = {
    url: "https://apiv2.bitcoinaverage.com/convert/global",
    method:"GET",
    qs:{
      from:crypto ,
      to:currency,
      amount:amount
    }
  };

  request(options, function (error, response, body) {
    var data=JSON.parse(body);
    var price = data.price;
    var currentDate = data.time ;
    res.write(`<h2>The current date is ${currentDate}`) ;
    res.write(`<p> ${amount} ${crypto} is worth ${price} ${currency} </p>`);
    res.send();

  });

})


app.post("/", (req,res)=>{
  console.log(req.body);
  let crypto = req.body.crypto ;
  let currency = req.body.currency ;
  let baseUrl = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/' ;
  let finalUrl = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/'+crypto+currency ;
  fetch(finalUrl)
    .then(res => res.json())
    .then(data => {
      let price = data.last ;
      let currentDate = data.display_timestamp ;
      res.write(`<h2>The current date is ${currentDate}`) ;
      res.write(`<p>the current price of ${crypto} is ${price} ${currency}</p>`);
      res.send();
    });
})

app.listen(port, () => console.log(`Calculator listening on port ${port}!`))

module.exports = app
