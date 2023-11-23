require([
    "esri/Map",
    "esri/Graphic",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/Search",
    "esri/widgets/Locate"
  ], (Map, Graphic, MapView, FeatureLayer, Legend, Search, Locate) => {
    // Crime in SF
    const layer = new FeatureLayer({      
      // autocasts as new PortalItem()
      portalItem: {
        // id: "2f73c3d6690e439cacaf8a582e6dcf9c"
        id: "110a082f1bb04e6392a58b000fdf0a9a"

      },
      outFields: ["US_L4NAME", "DESC", "LINK"]
    });



    const map = new Map({
      basemap: "gray-vector",
      layers: [layer]
    });

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

    const legend = new Legend({
      view: view,
      container: "sidebar",
      layerInfos: [
        {
          layer: layer
        }
      ]
    });

    const searchWidget = new Search({
      view: view
    });
    // Adds the search widget below other elements in
    // the top left corner of the view
    view.ui.add(searchWidget, {
      position: "bottom-left",
      index: 2
    });

    let locateWidget = new Locate({
      view: view,   // Attaches the Locate button to the view
      graphic: new Graphic({
        symbol: { type: "simple-marker" }  // overwrites the default symbol used for the
        // graphic placed at the location of the user when found
      })
    });

    view.ui.add(locateWidget, "top-left");

    // view.ui.add(legend, "bottom-left");
    view.ui.add("optionsDiv", "top-right");

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

    // // when query type changes, set appropriate values
    // const queryOpts = document.getElementById("query-type");

    // queryOpts.addEventListener("change", () => {
    //   switch (queryOpts.value) {
    //     // values set for distance query
    //     case "distance":
    //       distance = 15;
    //       units = "miles";
    //       break;
    //     default:
    //       // Default set to basic query
    //       distance = null;
    //       units = null;
    //   }
    // });

    layer.load().then(() => {
      // Set the view extent to the data extent
      view.extent = layer.fullExtent;
      layer.popupTemplate = layer.createPopupTemplate();
    });

    view.on("click", (event) => {
      view.graphics.remove(pointGraphic);
      if (view.graphics.includes(bufferGraphic)) {
        view.graphics.remove(bufferGraphic);
      }
      queryFeatures(event);
    });

    function queryFeatures(screenPoint) {
      const point = view.toMap(screenPoint);
      layer
        .queryFeatures({
          geometry: point,
          // distance and units will be null if basic query selected
          distance: 15,
          units: "miles",
          spatialRelationship: "intersects",
          returnGeometry: false,
          returnQueryGeometry: true,
          outFields: ["US_L4NAME","Desc_","LINK"]
        })
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
          if (featureSet.queryGeometry) {
            bufferGraphic.geometry = featureSet.queryGeometry;
            view.graphics.add(bufferGraphic);
          }
        });
    }
  });
