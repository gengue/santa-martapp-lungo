var foto360 = true;

var map, panorama, pos = new google.maps.LatLng(11.2711957, -74.196796),
        myPos, directionsDisplay = new google.maps.DirectionsRenderer(),
        directionsService = new google.maps.DirectionsService();

var xhReq = new XMLHttpRequest();
var panoramaOpciones = {
    position: pos,
    pov: {
        heading: 34,
        pitch: 10
    }
};

var mapOpciones = {
    zoom: 17,
    center: pos,
    mapTypeId: google.maps.MapTypeId.SATELLITE
};


function login() {
    var usuario = document.getElementById('user').value;
    var clave = document.getElementById('pass').value;

    var url = 'http://santamartapp.url.ph/webservice.php?metodo=login&user=' + usuario + '&pass=' + clave;

    xhReq.open("GET", url, false);
    xhReq.send(null);
    var data = JSON.parse(xhReq.responseText);

    if (data.resultado === true) {
        Lungo.Router.section("sec-principal");
    } else {
        document.getElementById('msg').innerHTML = '<strong><div data-icon="remove">' + data.mensaje + '</div></strong>';
    }

}
function lugarCategoria(op) {
    switch (op) {
        case 1:         //playas           
            cargarListaLugar();
            Lungo.Router.section("sec-lugar");
            break;
        case 2: //rios
            cargarListaLugares();
            Lungo.Router.section("sec-lugar");
            break;
    }
}

function cargarListaLugares() {
    var url = 'http://santamartapp.url.ph/webservice.php?metodo=lugares';
    xhReq.open("GET", url, false);
    xhReq.send(null);

    var data = JSON.parse(xhReq.responseText);
    var html = '<ul>';

    if (data !== null) {
        for (var i = 0; i < data.length; i++) {
            if (data[i] !== null) {
                html += '<li data-image="../images/lugares/playaGrande_min.jpg" class="selectable arrow" > \n\
                          <a href="javascript:detalleLugar1(' + data[i].id_lugar + ');" data-router="article">' +
                        '<strong>' + data[i].nombre_lugar + '</strong>' +
                        '<small>' + data[i].descripcion_lugar + '</small>' +
                        '</a>\n\
                </li>';
            }
            html += '</ul>';            
        }
    }else{
        html = '<div class="empty">\n\
            <span class="icon remove"></span><strong>Aun no hay lugares disponibles en esta categoria</strong></div>';

    }

    document.getElementById('art-lugarCategoria').innerHTML = html;

}
function cargarListaLugar() {
    document.getElementById('art-lugarCategoria').innerHTML = '<ul><li data-image="../images/lugares/playaGrande_min.jpg" class="selectable arrow" > \n\
                       <a href="javascript:detalleLugar();" data-router="article">' +
            '<strong>Playa Grande</strong>' +
            '<small>Playa Grande es hermosa de aguas transparentes y bellos corales con numerosos kioscos para disfrutar una deliciosa comida de mar y admirar el entorno</small>' +
            '</a></li></ul>';

}

function detalleLugar1(id) {
    Lungo.Router.section("sec-lugarCategoria-detalle");    
    initializeMap();
}
function detalleLugar() {
    Lungo.Router.section("sec-lugarCategoria-detalle");
//    document.getElementById('art-lugarCategoria-detalle').innerHTML = '<p>este lugar es bacano</p>\n\
//        <a href="art-lugarCategoria" class="button" data-router="article" data-icon="arrow-left">';
//    
    initializeMap();
}
function initializeMap() {
    map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOpciones);
    panorama = new google.maps.StreetViewPanorama(document.getElementById("map-canvas"), panoramaOpciones);
    map.setStreetView(panorama);
    directionsDisplay.setMap(map);
}

function cambiar_MapaFoto() {
    if (!foto360) {
        panorama = new google.maps.StreetViewPanorama(document.getElementById("map-canvas"), panoramaOpciones);
        map.setStreetView(panorama);
        foto360 = true;
        document.getElementById('btn-cambioMapaFoto').innerHTML = 'Ver Mapa';
    } else {
        map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOpciones);

        foto360 = false;
        document.getElementById('btn-cambioMapaFoto').innerHTML = 'Ver Foto 360°';
    }

}

function comoLLegar() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}


function onSuccess(position) {
    myPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOpciones);
    var request = {
        origin: myPos,
        destination: pos,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
        }
    });
}

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
}
