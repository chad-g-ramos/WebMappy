window.onscroll = function() {myFunction()};
var topnav = document.getElementById("myTopnav");
var sticky = topnav.offsetTop;
function myFunction() {
  if (window.pageYOffset > sticky) {
    topnav.classList.add("sticky");
  } else {
    topnav.classList.remove("sticky");
  }
}

  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/Layer",
    "esri/widgets/LayerList",
  //  "dojo/domReady!"
], (Map, MapView, Layer, LayerList) => {
  var map = new Map({
    basemap: "gray-vector",
  //  layers: [layer1,layer2]

  });
  var view = new MapView({
    container: "viewDiv",
    map:map,
    zoom:5,
    center: [-98, 30],
    popupEnabled: false,
  });


  //I split the feature service into two distict services and added them separately
  //This is the only way I could get the l4 regions to default to "not visible" in the
  //layer selector visibility toggle, which is controlled by the layer.visible=false
  //statement below in the second layer.fromPortalItem code block
  //-chad
  Layer.fromPortalItem({
    portalItem: {
      // id: "2f73c3d6690e439cacaf8a582e6dcf9c"
      // id: "744540718ad94c64bfc7217c93e00e8b"
      id: "68e00b62a12f4dd9a259b41d230bc026"
    },

  }).then(function(layer){
    map.add(layer);
  });

  Layer.fromPortalItem({
    portalItem: {
      // id: "2f73c3d6690e439cacaf8a582e6dcf9c"
      // id: "744540718ad94c64bfc7217c93e00e8b"
      id: "110a082f1bb04e6392a58b000fdf0a9a"
    },

  }).then(function(layer){
    map.add(layer);
    layer.visible=false;
  });



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
  view.ui.add(layerList, "top-right");

  });
