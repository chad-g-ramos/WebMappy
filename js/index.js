  //loads necessary functions
  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/Graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/geometry/Point",
  //  "dojo/domReady!"
], (Map, MapView, FeatureLayer, LayerList, Search, Graphic, SimpleMarkerSymbol, Point) => {
  var map = new Map({
    basemap: "gray-vector",
  //  layers: [layer1,layer2]

  });
  var view = new MapView({
    container: "viewDiv",
    map:map,
    zoom:5,
    center: [-98, 30],
  });

  //SearchWidget on Main Map
var searchWidget = new Search({
  view:view,
  index: 2,
});

// Function to add a marker to the map
function addMarker(lat, long) {
  var point = new Point({
    longitude: long,
    latitude: lat
  });

  var simpleMarkerSymbol = new SimpleMarkerSymbol({
    color: [106, 13, 173],
    outline: {
      color: [255, 255, 255],
      width: 2
    }
  });

  var graphic = new Graphic({
    geometry: point,
    symbol: simpleMarkerSymbol
  });

  view.graphics.add(graphic);
}

  // CThis function checks the geolocation of the user and shows whether or not the locate is available for the user.
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          addMarker(position.coords.latitude, position.coords.longitude);
      }, function(error) {
          console.error("Error getting location: ", error);
      });
  } else {
      console.log("Geolocation is not supported by this browser.");
  }

  const layerL3 = new FeatureLayer({
    portalItem: {
      // id: "2f73c3d6690e439cacaf8a582e6dcf9c"
      // id: "744540718ad94c64bfc7217c93e00e8b"
      id: "68e00b62a12f4dd9a259b41d230bc026",
    },
      outFields:["*"],
      popupTemplate: {
        title: "{US_L3NAME}",
        outFields:["*"],
        fieldInfos: [
          {
            fieldName: "OBJECTID",
            label: "OBJECTID",
            visible: false
          },
          {
            fieldName: "US_L3NAME",
            label: "US_L3NAME",
            visible: true
          },
          {
            fieldName: "Desc_",
            label: "Desc",
            visible: true,
          },
          {
            fieldName: "Unique_",
            label: "Unique",
            visible: false,

          },
          {
            fieldName: "Shape_Area",

            label: "Area",
            visible: false,
            format: {
                places: 2,
                  digitSeparator: true
                }
          },
          {
            fieldName: "Shape_Length",

            label: "Length",
            visible: false,
            format: {
                  places: 2,
                  digitSeparator: true
                }
          },

        ],
        content: [
          {
            type:"text",
            text: "{Desc_}"
          },
          {
            type:"text",
            text:"{Unique_}"
          },
        ]
      }
});
  map.add(layerL3);

const layerL4 = new FeatureLayer({
  portalItem: {
    // id: "2f73c3d6690e439cacaf8a582e6dcf9c"
    // id: "744540718ad94c64bfc7217c93e00e8b"
    id: "110a082f1bb04e6392a58b000fdf0a9a",
  }
});
  map.add(layerL4);
  layerL4.visible=false;

  //create an instance of the layer list widget, added to view, closed legend added to panel
  const layerList = new LayerList({
    view:view,
    listItemCreatedFunction: function(event) {
      const item = event.item;
      if (item.layer.type != "group"){
        item.panel = {
          content: "legend",
          open:false
        };
      }
    }
  });
  //position of the layer list widget on main map
  view.ui.add(layerList, "top-right");

  //position of the search widget in the main Map
  view.ui.add(searchWidget, "top-right");
  });
