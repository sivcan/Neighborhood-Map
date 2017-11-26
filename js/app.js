var map;
var defaultIcon;
var highlightedIcon;

function googleError() {
    //self.abc = ko.observable('');
    $('#query-summary').text("Could not load Google Maps");
    $('#list').hide();
}

//function to initialize map
function initMap() {
    "use strict";
    var styles = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#b55056"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#c9323b"
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
            {
                "lightness": "0"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "-1"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "0"
            },
            {
                "saturation": "0"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "weight": "0.01"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "weight": "0.01"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#202020"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
            {
                "color": "#461818"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#878787"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#b7b7b7"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "lightness": "-59"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#99282f"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0b0b0b"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#99282f"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#006591"
            },
            {
                "gamma": "0.34"
            },
            {
                "lightness": "-44"
            },
            {
                "saturation": "-58"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "hue": "#0043ff"
            },
            {
                "gamma": "1.52"
            },
            {
                "saturation": "-100"
            }
        ]
    }
];
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:  28.613939, lng: 77.209021},
        zoom: 18,
        styles: styles,
        mapTypeControl: false
    });
    ko.applyBindings(new AppViewModel());

}

String.prototype.contains = function (other) {
    return this.indexOf(other) !== -1;
};

//Knockout's View Model
var AppViewModel = function () {
    var self = this;

    function initialize() {
        fetchCafes();
    }


    if (typeof google !== 'object' || typeof google.maps !== 'object') {
    } else {
        defaultIcon = makeMarkerIcon('FF0000');
        highlightedIcon = makeMarkerIcon('00FF00');
        var infoWindow = new google.maps.InfoWindow();
        google.maps.event.addDomListener(window, 'load', initialize);
    }
    self.cafeList = ko.observableArray([]);
    self.query = ko.observable('');
    self.queryResult = ko.observable('');

    self.search = function () {
        //To prevent reload of page on click search button
    };


    //List of cafe's after filter based on query added in search
    self.FilteredcafeList = ko.computed(function () {
        self.cafeList().forEach(function (cafe) {
            cafe.marker.setMap(null);
        });

        var results = ko.utils.arrayFilter(self.cafeList(), function (cafe) {
            return cafe.name().toLowerCase().contains(self.query().toLowerCase());
        });

        results.forEach(function (cafe) {
            cafe.marker.setMap(map);
        });
        if (results.length > 0) {
            if (results.length == 1) {
                self.queryResult(results.length + " Cafe's from Foursquare ");
            } else {
                self.queryResult(results.length + " Cafe's from Foursquare ");
            }
        }
        else {
            self.queryResult("No Cafe's Available");
        }
        return results;
    });
    self.queryResult("Loading Cafe's, Please wait...")

    //function called when a cafe is clicked from the filtered list
    self.selectCafe = function (cafe) {
        infoWindow.setContent(cafe.formattedInfoWindowData());
        infoWindow.open(map, cafe.marker);
        map.panTo(cafe.marker.position);
        cafe.marker.setAnimation(google.maps.Animation.BOUNCE);
        cafe.marker.setIcon(highlightedIcon);
        self.cafeList().forEach(function (unselected_cafe) {
            if (cafe != unselected_cafe) {
                unselected_cafe.marker.setAnimation(null);
                unselected_cafe.marker.setIcon(defaultIcon);
            }
        });
    };

    //function to fetch cafes in New Delhi
    function fetchCafes() {
        var data;

        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/search',
            dataType: 'json',
            data: 'client_id=ZY4CDJNSF1SWOWSP1AYCW3WKA5CEAUR1YBRCRE4LTGNQN5ZG&client_secret=OBRHMM00CX5DGDRTKTMMEDST1U00PA33UCQXMD0HBMCQQCAC&v=20130815%20&ll=28.613939,77.209021%20&query=cafe',
            async: true,
        }).done(function (response) {
            data = response.response.venues;
            data.forEach(function (cafe) {
                foursquare = new Foursquare(cafe, map);
                self.cafeList.push(foursquare);
            });
            self.cafeList().forEach(function (cafe) {
                if (cafe.map_location()) {
                    google.maps.event.addListener(cafe.marker, 'click', function () {
                        self.selectCafe(cafe);
                    });
                }
            });
        }).fail(function (response, status, error) {
            $('#query-summary').text('Cafe\'s could not load...');
        });
    }
};

//function to make default and highlighted marker icon
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

//Foursquare model
var Foursquare = function (cafe, map) {
    var self = this;
    self.name = ko.observable(cafe.name);
    self.location = cafe.location;
    self.lat = self.location.lat;
    self.lng = self.location.lng;
    //map_location returns a computed observable of latitude and longitude
    self.map_location = ko.computed(function () {
        if (self.lat === 0 || self.lon === 0) {
            return null;
        } else {
            return new google.maps.LatLng(self.lat, self.lng);
        }
    });
    self.formattedAddress = ko.observable(self.location.formattedAddress);
    self.formattedPhone = ko.observable(cafe.contact.formattedPhone);
    self.marker = (function (cafe) {
        var marker;

        if (cafe.map_location()) {
            marker = new google.maps.Marker({
                position: cafe.map_location(),
                map: map,
                icon: defaultIcon
            });
        }
        return marker;
    })(self);
    self.id = ko.observable(cafe.id);
    self.url = ko.observable(cafe.url);
    self.formattedInfoWindowData = function () {
        return '<div class="info-window-content">' + '<a href="' + self.url() + '">' +
            '<span class="info-window-header"><h4>' + self.name() + '</h4></span>' +
            '</a><h6>' + self.formattedAddress()  + '<br>' + (self.formattedPhone()==undefined?'No Contact Info':self.formattedPhone()) + '</h6>' +
            '</div>';
    };
};
