// load the necessary runctions
require([
    "esri/Map",
    "esri/Graphic",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/Search",
    "esri/widgets/Locate"
  ], (Map, Graphic, MapView, FeatureLayer, Legend, Search, Locate) => {


    // Create a new FeatureLayer instance, assign to "layer" variable, 
    // Add layer by Arcgis Online layer id, which we published specifically for this project
    const layer = new FeatureLayer({      
      // autocasts as new PortalItem()
      portalItem: {
        // id: "2f73c3d6690e439cacaf8a582e6dcf9c"
        id: "110a082f1bb04e6392a58b000fdf0a9a"
        
      },
      outFields: ["US_L4NAME", "DESC", "LINK"]
    });

    
    //crate a new map instance, assign to "map" variable
    //use the gray-vector basemap
    const map = new Map({
      basemap: "gray-vector",
      layers: [layer]
    });


    //create a new view instance to display the map and other functionality
    //bind it to the "viewDiv" container, set the center to san marcos, the zoom level to 5, and 
    //dock the popup window to the bottom right of the view
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-98, 30],
      zoom: 5,
      popupEnabled: false,
      popup: {
        dockEnabled: true,
        dockOptions: {
          // dock popup at bottom-right side of view
          buttonEnabled: false,
          breakpoint: false,
          position: "bottom-right"
        }
      }
    });


    //create a legend instance, assign its content from the view which we called "view" and the layer we called "layer"
    // and bind it to the container called "sidebar" which is an aside div and not the same container as the map view. 
    const legend = new Legend({
      view: view,
      container: "sidebar",
      layerInfos: [
        {
          layer: layer
        }
      ]
    });


    //create an instance of the search widget, assign it to the "view", and place it at the bottom left of the view
    //note that the searchbar will be placed below the zoom controls if the position is left as default top-left, which
    //looks very bad, to compromise we moved it to the bottom left. 
    const searchWidget = new Search({
      view: view
    });
    // Adds the search widget below other elements in
    view.ui.add(searchWidget, {
      position: "bottom-left",
      index: 2
    });


    //create an instance of the locate widget, assign it to the view, and create a new graphic for the button to be displayed
    let locateWidget = new Locate({
      view: view,   // Attaches the Locate button to the view
      graphic: new Graphic({
        symbol: { type: "simple-marker" }  // overwrites the default symbol used for the
        // graphic placed at the location of the user when found
      })
    });
    //add the locate widget to the view in the top left position, which will be below the zoom controls. 
    view.ui.add(locateWidget, "top-left");


    //note that the "optionsDiv" is a relic from the sample code from which this page is adapted from.  Its only function now
    //is to hold a line of h3 text explaining how to use the near me app. 
    view.ui.add("optionsDiv", "top-right");

    //this too is a relic from the sample code, the distance and units are initially set to null, and changed below
    // additional query fields initially set to null for basic query
    let distance = null;
    let units = null;

    //create graphic for mouse point click
    const pointGraphic = new Graphic({
      symbol: {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [0, 0, 139],
        outline: {
          color: [255, 255, 255],
          width: 1.5
        }
      }
    });

    // Create graphic for distance buffer
    const bufferGraphic = new Graphic({
      symbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: [173, 216, 230, 0.2],
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 1
        }
      }
    });

    
    //after the layer loads, set the view extent to the full extent of the layer, and create the popup template
    //neither of which can be done until the layer loads
    layer.load().then(() => {
      // Set the view extent to the data extent
      view.extent = layer.fullExtent;
      layer.popupTemplate = layer.createPopupTemplate();
    });


    //add an event listener for the user input, which is a click somewhere on the view
    //remove any existing graphics on the view from previous click queries
    //using the click event as the input, run the queryFeatures function on the layer
    view.on("click", (event) => {
      view.graphics.remove(pointGraphic);
      if (view.graphics.includes(bufferGraphic)) {
        view.graphics.remove(bufferGraphic);
      }
      queryFeatures(event);
    });


    //build teh queryFeatures function, with the event click as the input
    function queryFeatures(screenPoint) {
      const point = view.toMap(screenPoint);
      layer
        .queryFeatures({
          //the geometry from the click is set to a point
          geometry: point,
          // buffer the point by 15 miles, and use this buffer area as the query input
          distance: 15,
          units: "miles",
          //specify the spatial relationship as intersects
          spatialRelationship: "intersects",
          returnGeometry: false,
          returnQueryGeometry: true,
          //set the fields to be returned by the query
          //NOTE THAT THIS DOES NOT WORK, ALL FIELDS ARE RETURNED REGARDLESS OF THIS LINE.
          //WE HAD TO REMOVE FIELDS FROM THE SHAPEFILE AND REPUBLISH THE FEATURE SERVICE TO LIMIT THE DISPLAYED FIELDS 
          outFields: ["US_L4NAME","Desc_","LINK"]
        })
        //pass the returned featureSet from the queryFeatures function to the openPopup() function as the features to be returned by the popup. 
        .then((featureSet) => {
          // set graphic location to mouse pointer and add to mapview
          pointGraphic.geometry = point;
          view.graphics.add(pointGraphic);
          // open popup of query result
          view.openPopup({
            location: point,
            features: featureSet.features,
            featureMenuOpen: true
          });
          //add the buffer graphic to the display
          if (featureSet.queryGeometry) {
            bufferGraphic.geometry = featureSet.queryGeometry;
            view.graphics.add(bufferGraphic);
          }
        });
    }
  });