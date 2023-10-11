var map = L.map("map").setView([29.884, -97.9384], 14);
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; " + mapLink + " Contributors",
  maxZoom: 18,
}).addTo(map);

//-------------------------------------------------------------------
//CHADS ADDITION
//Created a polygon (2 actually) for campus and used turf center of mass function to find center of campus

//create a list of coords for a rough polygon of the campus with Leaflet, an array of point pairs (also arrays)
var campusPolyPoints = [
  [29.88602537400004, -97.93698526599997],
  [29.88903392700007, -97.93456245799996],
  [29.8915997, -97.9390234], //last minute change in poly shape
  [29.89232381800008, -97.94465785799997],
  [29.889109123000026, -97.95016335599996],
  [29.891840079000076, -97.95361892499994],
  [29.890201670000067, -97.95554502399995],
  [29.886329154000066, -97.95322051899996],
  [29.885242606000077, -97.95148595999996],
  [29.885144439000044, -97.94954922899996],
  [29.884350056000073, -97.94851914699996],
  [29.88595803000004, -97.94662937399994],
  [29.886422327000048, -97.94327331499994],
  [29.885163514000055, -97.94310866299998],
  [29.88602537400004, -97.93698526599997],
];

//create the polygon using leaflet polygon funciton and add to map
var campusPoly = L.polygon(campusPolyPoints, { color: "red" }).addTo(map);

//create the same polygon with turf. Would like to create it once with turf bc its simple and then convert, but I cant figure out how
//NOTE that the xy are reversed from leflet and turf
//this is a single ring polygon, i.e. no holes, so only needs [[]] insstead of [[[]]] (triple) for a polygon with a hole or a multipolygon
var polygonC = turf.polygon(
  [
    [
      [-97.93698526599997, 29.88602537400004],
      [-97.93456245799996, 29.88903392700007],
      [-97.9390234, 29.8915997],
      [-97.94465785799997, 29.89232381800008],
      [-97.95016335599996, 29.889109123000026],
      [-97.95361892499994, 29.891840079000076],
      [-97.95554502399995, 29.890201670000067],
      [-97.95322051899996, 29.886329154000066],
      [-97.95148595999996, 29.885242606000077],
      [-97.94954922899996, 29.885144439000044],
      [-97.94851914699996, 29.884350056000073],
      [-97.94662937399994, 29.88595803000004],
      [-97.94327331499994, 29.886422327000048],
      [-97.94310866299998, 29.885163514000055],
      [-97.93698526599997, 29.88602537400004],
    ],
  ],

  { name: "poly1" }
);

//use the turf center of mass function to create a point for the center of mass of the campus polygon.
//NOTE that this turf function returns a geoJSON point
var centerCampus = turf.centerOfMass(polygonC);

//using leaflet L.geoJSON() function, turn the turf point returned from centerofmass function into a leaflet point, and add to map
L.geoJSON(centerCampus).addTo(map);

//END CHADS ADDITION---------------------------------------------------------

//BRODDES ADDITION-----------------------------------------------------------------------
//Created a point at the center of San Marcos and created a buffer with a 5 miles radius
var point = turf.point([-97.9414, 29.883]);
var buffered = turf.buffer(point, 5, {units: 'miles'});
//Added the point and buffer to the map
L.geoJSON(point).addTo(map);
L.geoJSON(buffered).addTo(map);
//END BRODDES ADDITION---------------------------------------------------------------------

//Jasmine ADDITION
//Added a Midpoint between two points within Texas State University Campus
var point1 = turf.point([-97.93698526599997, 29.88602537400004]);
var point2 = turf.point([-97.95322051899996, 29.886329154000066]);
var midpoint = turf.midpoint(point1, point2);
//Added the two points and the midpoint to the Map
L.geoJSON(point1).addTo(map);
L.geoJSON(point2).addTo(map);
L.geoJSON(midpoint).addTo(map);
//END Jasmine ADDITION
