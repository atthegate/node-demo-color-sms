// NODE-DEMO-COLOR-SMS

// NOTE
// Set environment variable for Twilio Authentication Token before running this script!
// export TWILIO_AUTH_TOKEN=[your-twilio-auth-token]

var twilio = require('twilio'),
    http = require('http');
    express = require('express'),
    bodyParser  = require('body-parser');
    sys = require('util');

// Create express app with middleware to parse POST body
var app = express();
app.use(bodyParser.urlencoded({extended:true}));

// Create a route to respond to a call
app.post('/response_m', twilio.webhook({validate:true}), function(request, response) {
    
    var message = request.body.Body;
    var from = request.body.From;

    sys.log('From: ' + from + ', Message: ' + message);

    colors = ['white','black','red','orange','yellow','green','blue','indigo','violet','brown'];

    function checkArray(str, arr){
       idx_match = [];
       for(var ii = 0; ii < arr.length; ii++){
            var str_c = new RegExp(arr[ii].trim(), "i");
           sys.log(str_c);
           if(str.match(str_c)){
                idx_match.push(ii);
                sys.log(ii);
            }
       }
       return idx_match;
    }

    idx_match = checkArray(message, colors);
    sys.log(idx_match);

    if(idx_match.length>0){
        txt = "";
        for(ii = 0; ii < idx_match.length; ii++){
            txt += " + " + colors[idx_match[ii]]
        }
    }else{
        txt = "No colors!"
    }

    var twiml = new twilio.TwimlResponse();
    twiml.message(txt);
    response.send(twiml)
        
});

http.createServer(app).listen(3000, function () {
  console.log("Express server listening on port 3000");
});