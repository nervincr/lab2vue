var BaseApiUrl = "http://nervinlicweb.000webhostapp.com/lab3crud/index.php/api/news/";
var ws;

function buildUrl(service){
    return BaseApiUrl + service;
}

window.onload = function(){
    document.addEventListener("deviceready", onDeviceReady, false);
    var vm = new Vue({
        el: '#app',
        data: {
          fields: ['id','title','text', 'actions'],
          noti: {
              id: 0,
              title: '',
              slug: '',
              text: '',
              image: ''
          },
          news: []
        },
        mounted(){
            this.getData();
            this.MyWebSocketCall();
        },
        methods:{
            getData(){
                axios.get(buildUrl('getnews')).then((response) => {
                    this.news = response.data;
                }).catch(error => {console.log(error)});
            },
            submitData(evt){
                evt.preventDefault();
                if (this.noti.id > 0) {
                    this.editData();
                } else {
                    this.addData();                    
                }
                this.noti.id = 0;
                this.noti.title = "";
                this.noti.slug = "";
                this.noti.text = "";
                this.noti.image = "";
            },
            deleteData(id){
                axios.get(buildUrl('deletenews/' + id)).then((response) => {
                    ws.send("delete");
                    this.getData();
                    toastr.success("La noticia fue eliminada con éxito");
                }).catch(error => {console.log(error)});
            },
            addData(){
                axios.post(
                    buildUrl('insertNews'), 
                    {
                        title: this.noti.title,
                        slug: this.noti.title + this.noti.text,
                        text: this.noti.text,
                        image: "default.png"
                    }
                ).then((response) => {
                    this.getData();
                    toastr.success("La noticia fue agregada con éxito");
                }).catch(error => {console.log(error)});
            },
            editData(){
                axios.post(
                    buildUrl('updateNews'), 
                    {
                        id: this.noti.id,
                        title: this.noti.title,
                        slug: this.noti.slug,
                        text: this.noti.text,
                        image: this.image
                    }
                ).then((response) => {
                    this.getData();
                    toastr.success("La noticia fue actualizada con éxito");
                }).catch(error => {console.log(error)});
            }, 
            getEditData(id){
                axios.get(buildUrl('getnews/' + id)).then((response) => {
                    this.noti.id = response.data.id;
                    this.noti.title = response.data.title;
                    this.noti.slug = response.data.slug;
                    this.noti.text = response.data.text;
                    this.noti.image = response.data.image;
                }).catch(error => {console.log(error)});
            },
            MyWebSocketCall() {
                if ("WebSocket" in window) {
                    console.log("WebSocket is supported by your Browser!");
                    // Let us open a web socket
                    //personalizamos la url con nuestro propio room_id
                    //wss://connect.websocket.in/YOUR_CHANNEL_ID?room_id=YOUR_ROOM_ID
                    ws = new WebSocket("wss://connect.websocket.in/nervinlicweb?room_id=9999");
                    ws.onopen = function() {
                    // Web Socket is connected, send data using send()
                    ws.send("open");
                    console.log("WebSocket is open...");
                    };
                    ws.onmessage = function (evt) {
                    //cada vez que se invoca el ws.send() se recibe una respuesta de forma asincrónica
                    vm.getData();
                    console.log("Message is received: " + evt.data); //evt.data contiene el msj recibido
                    };
                    ws.onclose = function() {
                    // websocket is closed.
                    console.log("Connection is closed...");
                    };
                } else {
                    // The browser doesn't support WebSocket
                    alert("WebSocket NOT supported by your Browser!");
                }
            }
        }
      });
}
function onDeviceReady() {
    // Register the event listener
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onConfirm(buttonIndex) {
    if (buttonIndex==2){
        navigator.app.exitApp();
    }
}

// Handle the back button
//
function onBackKeyDown() {
    navigator.notification.confirm(
        '¿Está seguro que desea salir?',  // message
        onConfirm,              // callback to invoke with index of button pressed
        'Salir de myApp',            // title
        'No,Sí'         // buttonLabels
    );
}