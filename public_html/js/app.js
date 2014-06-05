var foto360 = true;

var map, panorama, pos = new google.maps.LatLng(11.2711957, -74.196796),
        myPos, directionsDisplay = new google.maps.DirectionsRenderer();

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

function lugarCategoria(op) {
    switch (op) {
        case 1:         //playas           
            cargarListaLugar();
            Lungo.Router.section("sec-lugar");
            break;
    }
}

function cargarListaLugar() {
    document.getElementById('art-lugarCategoria').innerHTML = '<ul><li data-image="../images/lugares/playaGrande_min.jpg" class="selectable arrow" > \n\
                       <a href="javascript:detalleLugar();" data-router="article">' +
            '<strong>Playa Grande</strong>' +
            '<small>Playa Grande es hermosa de aguas transparentes y bellos corales con numerosos kioscos para disfrutar una deliciosa comida de mar y admirar el entorno</small>' +
            '</a></li></ul>';

}

function detalleLugar() {
    Lungo.Router.article("art-lugarCategoria", "art-lugarCategoria-detalle");
//    document.getElementById('art-lugarCategoria-detalle').innerHTML = '<p>este lugar es bacano</p>\n\
//        <a href="art-lugarCategoria" class="button" data-router="article" data-icon="arrow-left">';
//    
    initializeMap();
}
function initializeMap() {
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
