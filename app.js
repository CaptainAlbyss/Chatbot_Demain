const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const APP_TOKEN = 'EAAFbLV9qZBwkBAPASNDtffA8ZBS0G0jKTiMZAepDoJBFprr2ZAke9kcqmaZCrsb2UzVnNDapQNWVvRVxQjOEVJweu0lF5kMXe1Iy6VETWsZBLNhFYekl8lIqZBXytT4hpJW43VjeUDxiP1phf6ShAxFDAC8WzZATYRzwmWjI4ZAQetH5KvVOvpPF4'

var app = express()

app.use(bodyParser.json())


//Puertos
var PORT = process.env.PORT || 3000;

app.listen(PORT,function(){
    console.log('server escuchando en localhost y no se por que no esta funcionando jeje :3: ' + PORT)
})

//Rutas get y post
app.get('/',function(req, res){
    res.send('No se por que no esta funcionando jeje :3')
})
//ruta para verificar token de la webhook
app.get('/webhook',function(req, res){
    if(req.query['hub.verify_token'] == 'Prueba_Demain'){
        res.send(req.query['hub.challenge'])
    }else{
        res.send('No entre aqui papu')
    }
})

app.post('/webhook',function(req, res){
    var data = req.body
    if(data.object == 'page'){
        data.entry.forEach(function(pageEntry){
            pageEntry.messaging.forEach(function(messagingEvent){
                if(messagingEvent.message){

                    getMessage(messagingEvent)

                }
            })
        })
    }
    res.sendStatus(200)
})

function getMessage(event){
    var senderID = event.sender.id
    var messageText = event.message.text

    evaluarMensaje(senderID, messageText)
}

function evaluarMensaje(senderID, messageText){
    var mensaje = '';
    switch (messageText){
        case isContain('Empezar'):
            sendMessageTemplate(senderID);
            break;
        case isContain('hola' || 'Hola'):
            sendMessageTemplate(senderID);
            break;
        default:
            mensaje = 'Todavia no se que hacer con lo que me dices.'
            break;
    }


/*     mensaje = 'Todavia no se que hacer con lo que me dices.'
    if(isContain(messageText,'ayuda')){
        mensaje = 'Por el momento no puedo ayudarte.'
    }
    else if(isContain(messageText,'info')){
        mensaje = 'De momento no hay informacion para proporcionarte.'
    }
    if(isContain(messageText,'hola')){
        mensaje = 'Hola que gusto que estes aqui.'
        sendMessageTemplate(senderID);
    }
    else if(isContain(messageText, 'adios')){
        mensaje = 'Adios.'
    }*/
    enviarMensajeTexto(senderID, mensaje)
}




function sendMessageTemplate(senderID){
    var messageData = {
        recipient : {
            id: senderID
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Hola que gusto que estes aqui",
                    buttons: [
                        {
                            type: "web_url",
                            url: "https://www.messenger.com",
                            title: "Prueba"
                        }
                    ],
                }
            }
        }
    }
    callSendAPI(messageData)
}

function enviarMensajeTexto(senderID, mensaje){
    var messageData = {
        recipient : {
            id: senderID
        },
        message: {
            text: mensaje
        }
    }
    callSendAPI(messageData)
}

function callSendAPI(messageData){
    //API de facebook
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: APP_TOKEN},
        method: 'POST',
        json: messageData
    },function(error, response, data){
        if(error){
            console.log('no es posible enviar el mensaje')
        }else{
            console.log('mensaje enviado')
        }
    })
}

function isContain(texto, word){
    return texto.indexOf(word) > -1
}

