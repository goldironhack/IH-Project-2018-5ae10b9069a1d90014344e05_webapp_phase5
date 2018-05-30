var map
var university = { lat: 40.729055, lng: -73.996523 }
const neighbors = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const district_shape = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const crimes = "https://data.cityofnewyork.us/api/views/qgea-i56i/rows.json";
const housing = "https://data.cityofnewyork.us/resource/q3m4-ttp3.json";

function onGoogleMapResponse() {
    map = new google.maps.Map(document.getElementById('googleMapContainer'), {
        zoom: 10
    });

    var location = "NYU Stern School of Business";

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': location }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
        };

    });
    var universityMark = new google.maps.Marker({
        position: university,
        animation: google.maps.Animation.BOUNCE,
        tittle: 'NYU Stern School of Business',
        map: map
    });

    map.data.loadGeoJson(district_shape);

    map.data.setStyle(function (feature)
    {
        var borough = feature.getProperty('BoroCD');

        var boroughNumber = parseInt(borough / 100);
        var color;

        if (boroughNumber == 1) //Manhattan
        {
            color = 'blue';
        } else if (boroughNumber == 2) //Bronx
        {
            color = 'red';
        } else if (boroughNumber == 3) //Brooklyn
        {
            color = 'pink';
        } else if (boroughNumber == 4) //Queens
        {
            color = 'green';
        } else if (boroughNumber == 5) //Staten Island
        {
            color = 'yellow';
        }

        return {
            fillColor: color,
            strokeColor: '#FF5858',
            strokeOpacity: 1.05,
            strokeWeight: 1.5,
            fillOpacity: 0.3
        };
    });
}