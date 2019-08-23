const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const APP_TOKEN = 'EAAFbLV9qZBwkBAPASNDtffA8ZBS0G0jKTiMZAepDoJBFprr2ZAke9kcqmaZCrsb2UzVnNDapQNWVvRVxQjOEVJweu0lF5kMXe1Iy6VETWsZBLNhFYekl8lIqZBXytT4hpJW43VjeUDxiP1phf6ShAxFDAC8WzZATYRzwmWjI4ZAQetH5KvVOvpPF4'

var app = express()

app.use(bodyParser.json())

app.listen(3000,function(){
    console.log('server escuchando en localhost:3000')
})

app.get('/',function(req, res){
    res.send('Abriendo el puerto desde PC local')
})

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
    mensaje = 'Todavia no se que hacer con lo que me dices.'
    if(isContain(messageText,'ayuda')){
        mensaje = 'Por el momento no puedo ayudarte.'
    }
    else if(isContain(messageText,'info')){
        mensaje = 'De momento no hay informacion para proporcionarte.'
    }
    if(isContain(messageText,'hola')){
        mensaje = 'Hola, Bienvenido a Demain Ideas.'
    }
    else if(isContain(messageText, 'adios')){
        mensaje = 'Adios.'
    }
    enviarMensajeTexto(senderID, mensaje)
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