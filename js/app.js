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
        center: {lat:  28.661898, lng: 77.227396},
        zoom: 13,
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
        fetchSushiRestaurants();
    }


    if (typeof google !== 'object' || typeof google.maps !== 'object') {
    } else {
        defaultIcon = makeMarkerIcon('FF0000');
        highlightedIcon = makeMarkerIcon('00FF00');
        var infoWindow = new google.maps.InfoWindow();
        google.maps.event.addDomListener(window, 'load', initialize);
    }
    self.sushiRestuarantList = ko.observableArray([]);
    //self.numSushiRestaurant = ko.observable(0);
    self.query = ko.observable('');
    self.queryResult = ko.observable('');

    self.search = function () {
        //To prevent reload of page on click search button
    };


    //List of sushi restaurants after filter based on query added in search
    self.FilteredSushiRestuarantList = ko.computed(function () {
        self.sushiRestuarantList().forEach(function (restaurant) {
            restaurant.marker.setMap(null);
        });

        var results = ko.utils.arrayFilter(self.sushiRestuarantList(), function (restaurant) {
            return restaurant.name().toLowerCase().contains(self.query().toLowerCase());
        });

        results.forEach(function (restaurant) {
            restaurant.marker.setMap(map);
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

    //function called when a restaurant is clicked from the filtered list
    self.selectRestaurant = function (restaurant) {
        infoWindow.setContent(restaurant.formattedInfoWindowData());
        infoWindow.open(map, restaurant.marker);
        map.panTo(restaurant.marker.position);
        restaurant.marker.setAnimation(google.maps.Animation.BOUNCE);
        restaurant.marker.setIcon(highlightedIcon);
        self.sushiRestuarantList().forEach(function (unselected_restaurant) {
            if (restaurant != unselected_restaurant) {
                unselected_restaurant.marker.setAnimation(null);
                unselected_restaurant.marker.setIcon(defaultIcon);
            }
        });
    };

    //function to fetch sushi restaurants in New Delhi
    function fetchSushiRestaurants() {
        var data;

        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/search',
            dataType: 'json',
            data: 'client_id=ZY4CDJNSF1SWOWSP1AYCW3WKA5CEAUR1YBRCRE4LTGNQN5ZG&client_secret=OBRHMM00CX5DGDRTKTMMEDST1U00PA33UCQXMD0HBMCQQCAC&v=20130815%20&ll=28.661898,77.227396%20&query=cafe',
            async: true,
        }).done(function (response) {
            data = response.response.venues;
            data.forEach(function (restaurant) {
                foursquare = new Foursquare(restaurant, map);
                self.sushiRestuarantList.push(foursquare);
            });
            self.sushiRestuarantList().forEach(function (restaurant) {
                if (restaurant.map_location()) {
                    google.maps.event.addListener(restaurant.marker, 'click', function () {
                        self.selectRestaurant(restaurant);
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
var Foursquare = function (restaurant, map) {
    var self = this;
    self.name = ko.observable(restaurant.name);
    self.location = restaurant.location;
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
    self.formattedPhone = ko.observable(restaurant.contact.formattedPhone);
    self.marker = (function (restaurant) {
        var marker;

        if (restaurant.map_location()) {
            marker = new google.maps.Marker({
                position: restaurant.map_location(),
                map: map,
                icon: defaultIcon
            });
        }
        return marker;
    })(self);
    self.id = ko.observable(restaurant.id);
    self.url = ko.observable(restaurant.url);
    self.formattedInfoWindowData = function () {
        return '<div class="info-window-content">' + '<a href="' + self.url() + '">' +
            '<span class="info-window-header"><h3>' + self.name() + '</h3></span>' +
            '</a><h5>' + self.formattedAddress()  + '<br>' + (self.formattedPhone()==undefined?'No Contact Info':self.formattedPhone()) + '</h5>' +
            '</div>';
    };
};

