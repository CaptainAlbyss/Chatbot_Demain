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

//Rutas get y post se ve en la web http
app.get('/',function(req, res){
    res.send('No se por que no esta funcionando jeje :3')
})
//ruta para verificar token de la webhook en el facebook developer
app.get('/webhook',function(req, res){
    if(req.query['hub.verify_token'] == 'Prueba_Demain'){
        res.send(req.query['hub.challenge'])
    }else{
        res.send('No entre aqui papu')
    }
})

//obtener el evento de mensaje por webhook (Necesario)
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

//Obtiene el mensaje enviado por el usuario en facebook
function getMessage(event){
    var senderID = event.sender.id
    var messageText = event.message.text

    evaluarMensaje(senderID, messageText)
}
//Toma lo que lleva por dentro el mensaje del usuario y lo evalua para saber que responder
function evaluarMensaje(senderID, messageText){
    var mensaje = '';
    mensaje = 'Todavia no se que hacer con lo que me dices.'

    if(isContain(messageText,'hola' || 'Hola')){
        sendMessageTemplate(senderID);
//        mensaje = 'Por el momento no puedo ayudarte.'
    }
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
                            type: "postback",
                            title: "Contar sobre problema en mi entorno",
                            payload: "Contar"
                        },
                        {
                            type: "postback",
                            title: "Quiero saber mas sobre Demain",
                            payload: "Saber"
                        }
                    ],
                }
            }
        }
    }
    callSendAPI(messageData)
}

//Envia el mensaje al usuario en texto

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


//funcion con metodo POST para enviar el mensaje al usuario (total necesario)
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


//Funcion para evaluar si el mensaje del usuario contiene una palabra en especifico
function isContain(texto, word){
    return texto.indexOf(word) > -1
}

