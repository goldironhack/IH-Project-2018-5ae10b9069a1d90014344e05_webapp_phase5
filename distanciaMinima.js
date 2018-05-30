//Arreglo de valores de barrios con distancia minima
var distanciaMin = new Array();

function distanciaMinimaFuncion()
{    
    $.getJSON(district_shape, function (data)
    {
        //console.log('dataJson', data);
        for (i = 0; i < data.features.length; i++)
        {
            let boro = {};
            //Se divide en 100 para sacer el distrito
            boro['distrito'] = parseInt(data.features[i].properties.BoroCD / 100);

            //Modulo 100 para sacar el barrio
            boro['barrio'] = data.features[i].properties.BoroCD % 100;

            //coordenadas
            //console.log('coordenadas', data.features[i].geometry.coordinates[0].length);
            var avXcoor = 0;
            var avYcoor = 0;
            var lista = data.features[i].geometry.coordinates[0];
            if (data.features[i].geometry.type == "Polygon")
            {
                //Mirando las coordenadas y calculando las medias
                for (ip = 0; ip < lista.length; ip++)
                {
                    var coordinada = lista[ip];
                    avXcoor = avXcoor + lista[ip][0];
                    avYcoor = avYcoor + lista[ip][1];
                }
                
                avXcoor = avXcoor / lista.length;
                avYcoor = avXcoor / lista.length;
                //Asignar coordenada X media y Y media
                boro['CxM'] = avXcoor;
                boro['CyM'] = avYcoor;

                var punto = {
                    lat: avXcoor,
                    lng: avYcoor
                };

                var rta = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(punto), new google.maps.LatLng(university));
                //console.log("distancia", rta);
                boro['distancia'] = rta;
                //Se agrega el objeto boro en el arreglo de barrios con la distancia minima y el distrito
                distanciaMin.push(boro);
            }
        }
        //Se usa bubble sort para ordenar el arreglo distanciaMin
        var len = distanciaMin.length -1;
        for (i = 0; i < len; i++) {
            for(var j = 0 ; j < len - i - 1; j++){ 
                if (distanciaMin[j].distancia > distanciaMin[j + 1].distancia) {
                    // swap
                    var temp = distanciaMin[j];
                    distanciaMin[j] = distanciaMin[j+1];
                    distanciaMin[j+1] = temp;
                }
            }
        }
    });
    //console.log('ordenado', distanciaMin);    
}
//Arreglo para los 10 primeros barrios ordenados de menor a mayor distancia en distanciaMin
var top10 = new Array();
function distanciaTop10(){ 
    distanciaMinimaFuncion();  
    $.getJSON(neighbors, function (data)
    {
        //console.log('dataJson', data);
        for (var i = 0 ; i < 10; i++) {
            let disTop = {};
            disTop['rank'] = i+1;
            id_barrio = distanciaMin[i].barrio;
            disTop['barrio'] = data.data[id_barrio][10];
            disTop['borough'] = data.data[id_barrio][16];
            top10.push(disTop);
        }
        //console.log('top10',top10);
    });
}

function updateTable(){
    distanciaTop10();
    tableReference = $("#tablaTop10")[0];
    var newRow, rank, barrio, borough;
    for(var i=0; i<top10.length; i++){
        newRow = tableReference.insertRow(tableReference.rows.length);
        rank = newRow.insertCell(0);
        barrio = newRow.insertCell(1);
        borough = newRow.insertCell(2);
        rank.innerHTML = top10[i].rank;
        barrio.innerHTML = top10[i].barrio;
        borough.innerHTML = top10[i].borough;
    }
}
//Arreglo con las casas para arrendar de cada borough
var casas = [];
function obtenerCasas()
{
    $.get(housing, function(data){
        console.log("hous",data);
        for (var i = 0; i < data.length; i++) {
            casas[i] = [data[i].latitude, data[i].longitude, data[i].borough, data[i].project_name, data[i].street_name, data[i].house_number];
        }
        console.log("H",casas);
    })
}

$(document).ready( function(){
    $("#disTop10").on("click", updateTable);
    $("#bronxBtn").on("click", obtenerCasas);
})
