
  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/LayerList",
  //  "dojo/domReady!"
], (Map, MapView, FeatureLayer, LayerList) => {
/*  const layerL3 = new FeatureLayer({
        // autocasts as new PortalItem()
        portalItem: {
          // id: "2f73c3d6690e439cacaf8a582e6dcf9c"
          id: "68e00b62a12f4dd9a259b41d230bc026"

        },
        outFields: ["US_L3NAME", "DESC", "LINK"]
      });

  const layerL4 = new FeatureLayer({
        // autocasts as new PortalItem()
        portalItem: {
          // id: "2f73c3d6690e439cacaf8a582e6dcf9c"
          id: "110a082f1bb04e6392a58b000fdf0a9a"

        },
        outFields: ["US_L4NAME", "DESC", "LINK"]
      });
      layerL4.visible=false; */
  const map = new Map({
    basemap: "gray-vector",
  //  layers:[layerL3, layerL4]
  //  layers: [layer1,layer2]

  });

  const view = new MapView({
    container: "viewDiv",
    map:map,
    zoom:5,
    center: [-98, 30],
    //popupEnabled: true,
    popup: {
        dockEnabled: true,
        dockOptions: {
          // dock popup at bottom-right side of view
          buttonEnabled: false,
          breakpoint: false,
        }
      }
  });


  //I split the feature service into two distict services and added them separately
  //This is the only way I could get the l4 regions to default to "not visible" in the
  //layer selector visibility toggle, which is controlled by the layer.visible=false
  //statement below in the second layer.fromPortalItem code block
  //-chad
/*  const popupDesc = {

    title: "{US_L3Key}",
    content: [
      {
        type:"fields",
        fieldInfos:[
          {
        fieldName: "DESC",
        label: "Description",
          }
        ]
      }
    ]
  };
//  content: "<b>Description:" + "</b> {Description} "};*/
  /*var template = {
    title:"{US_L3NAME}",
    content:[{
      type: "fields",
      fieldInfos:[{
        fieldName:"Descripton",
        label:"Description",
        visible: true,
      },{
        fieldName:"OBJECTID",
        label:"OBJECTID",
        visible:false,

      }]
    }]
  }; */

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
    //popupTemplate: template
  //  popupTemplate: popupDesc,

});
  map.add(layerL3);
//});

const layerL4 = new FeatureLayer({
  portalItem: {
    // id: "2f73c3d6690e439cacaf8a582e6dcf9c"
    // id: "744540718ad94c64bfc7217c93e00e8b"
    id: "110a082f1bb04e6392a58b000fdf0a9a",
  }
});
  map.add(layerL4);
  layerL4.visible=false;
//});
    //
  /*  const popupTemplate = {
      title: "{US_L3NAME}",
      outFields: ["Desc_"],
      content: layerDescription,
      fieldInfos: [{
        fieldName:"Descripton",
      }]
    }
  });
  //layer.popupTemplate = popupTemplate;
  /*  function layerDescription(feature) {
    const div = document.createElement("div");
    div.innerHTML =
    feature.graphic.attributes.OBJECTID;
    return div;
  };*/

/*  Layer.fromPortalItem({
    portalItem: {
      // id: "2f73c3d6690e439cacaf8a582e6dcf9c"
      // id: "744540718ad94c64bfc7217c93e00e8b"
      id: "110a082f1bb04e6392a58b000fdf0a9a",

    },

  }).then(function(layer){
    map.add(layer);
    layer.visible=false;
  }); */



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

/*  const popupDesc = { title: "{US_L3Key}",
    content: [
      {
        type:"fields",
        fieldInfos:[
          {
        fieldName: "Description",
        label: "Description",
          }
        ]
      }
    ]
  };
//  content: "<b>Description:" + "</b> {Description} "}; */
