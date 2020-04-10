function dibujargraphs(transformobj, numsystem) {
  /*---------------------------------------------------------------
    CANVAS
  ----------------------------------------------------------------*/
  //clean canvas
  $("#svg-wrap").empty();

  //create back wrap content
  var backwrap = document.createElementNS("http://www.w3.org/2000/svg", "g");
  backwrap.setAttribute("id", "backwrap");
  document.getElementById("svg-wrap").appendChild(backwrap);

  //clean coords
  todocoords = [];

  //---loop donut maker
  for (var i = 0; i < numsystem; i++) {
    donutmaker(transformobj[i].systemcircle, i);
  }
} //----dibujargraphs

function drawsystemconnector(id1, id2, data) {
  //---create wraps-OJO HACER UNO POR CADA SYSTEMA
  var connectwrap = document.createElementNS("http://www.w3.org/2000/svg", "g");
  connectwrap.setAttribute("id", "connectwrap");
  document.getElementById("svg-wrap").appendChild(connectwrap);

  for (var itemdata in data) {
    drawconector(
      todocoords[id1].system.points[itemdata].x,
      todocoords[id1].system.points[itemdata].y,
      todocoords[id2].system.points[itemdata].x,
      todocoords[id2].system.points[itemdata].y
    );
  }
}

function drawconector(x1, y1, x2, y2) {
  var aconnector = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  document.getElementById("connectwrap").appendChild(aconnector);
  aconnector.setAttribute("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);

  aconnector.setAttribute("stroke", "black");
  aconnector.setAttribute("stroke-width", 0.5);
  aconnector.setAttribute("fill", "none");
} //--- drawconnector

var offx = 0;
var offy = 0;
var palettecols = [
  "#00BBD3",
  "#9B26AF",
  "#6639B6",
  "#3E50B4",
  "#2095F2",
  "#02A8F3",
  "#009587",
  "#4BAE4F",
  "#8AC249",
  "#CCDB38",
  "#FEEA3A",
  "#FEC006",
  "#FE9700",
  "#FE5621",
  "#F34235",
  "#E81D62",
  "#785447",
  "#9D9D9D",
  "#5F7C8A",
];

function drawarcs(i, objcfg, d, wrap, color, scalecol) {
  var raddata = circlecoords(objcfg);

  var angles = raddata[2];

  var svgns = "http://www.w3.org/2000/svg";

  var aPath3 = document.createElementNS(svgns, "path");
  document.getElementById(wrap).appendChild(aPath3);

  aPath3.setAttribute(
    "d",
    " M" +
      raddata[0][i].rx +
      "," +
      raddata[0][i].ry +
      " A" +
      "-" +
      objcfg.radio +
      " " +
      objcfg.radio +
      " 0 " +
      (angles[i] < 180 ? 0 : 1) +
      " 0 " +
      raddata[0][i + 1].rx +
      " " +
      raddata[0][i + 1].ry
  );

  aPath3.setAttribute("stroke", palettecols[i % palettecols.length]);

  if (!objcfg.strokedata) {
    aPath3.setAttribute("stroke-width", objcfg.strokew);
  } else {
    aPath3.setAttribute("stroke-width", objcfg.strokew * (d / 50));
  }

  aPath3.setAttribute("fill", "none");
} //---drawarcs

function donutmaker(objprop, index) {
  //------object config
  var objcfgcircle = {
    offorig: {
      x: objprop.circle.sliders.posx * (canvasobj.width / 100),
      y: objprop.circle.sliders.posy * (canvasobj.height / 100),
    },
    arr: objprop.data,
    grades: objprop.circle.sliders.grades * (360 / 100),
    radio: objprop.circle.sliders.radio * (canvasobj.width / 2 / 100),
    rotation: objprop.circle.sliders.rotation * (180 / 100),
    strokew: objprop.circle.sliders.strokew,
    strokedata: objprop.circle.checkboxes.strokedata,
  };

  var objcategory = {
    factor: objprop.category.sliders.rotation,
    rotation: objprop.category.checkboxes.rotate,
    off: objprop.category.sliders.off,
    hide: objprop.category.checkboxes.hide,
    connect: objprop.category.checkboxes.connect,
  };

  var data = objcfgcircle.arr;
  var systemid = coordsregister("circle", data);

  var circle = document.createElementNS("http://www.w3.org/2000/svg", "g");
  document.getElementById("backwrap").appendChild(circle);
  circle.setAttribute("id", "arcswrap_" + index);

  //---scalecolor

  var scalecol = d3.scale
    .linear()
    .domain([
      getMinOfArray(objprop.data),
      getMaxOfArray(objprop.data) / 1.4,
      getMaxOfArray(objprop.data),
    ])
    .range([-1, 0, 1]);

  var color = d3.scale
    .linear()
    .domain([-1, 0, 1])
    .range(["rgb(200, 200, 200)", "rgb(80,80,80)", "rgb(60,60,60)"]);

  for (var itemdata in data) {
    var i = parseInt(itemdata);
    var radianlabel = circlecoords(objcfgcircle);

    drawarcs(i, objcfgcircle, data[i], "arcswrap_" + index, color, scalecol);
    //mostrar si se habilita conector!
    todocoords[systemid].system.points.push({
      x: radianlabel[0][i].cx,
      y: radianlabel[0][i].cy,
    });
  } //----for...

  if (objcategory.hide) {
    radioselemts(objcategory, objcfgcircle, index, data);
    if (objcategory.connect) {
      drawsystemconnector(systemid, systemid + 1, data);
    }
  }
} //---donutmaker

function circlecoords(objcfg, off) {
  var off = typeof off !== "undefined" ? off : 0;

  ///---fuera
  var offorig = objcfg.offorig;
  var arr = objcfg.arr;
  var grades = objcfg.grades;
  var radio = objcfg.radio + off;
  var rotation = objcfg.rotation;

  ///--locals
  var coordscircle = [];

  var getsum = misumelemarr(arr, grades);
  var sum = getsum[0];
  var onlyangles = getsum[1];
  var sumcenter = [];

  //for (var i = sum.length - 1; i >= 0; i--) {
  for (var i = 0; i < sum.length; i++) {
    sum[i] = sum[i] + rotation;

    var rx = Math.sin(Math.radians(sum[i])) * radio + offorig.x;
    var ry = Math.cos(Math.radians(sum[i])) * radio + offorig.y;

    var lasum;
    if (i + 1 < sum.length) {
      lasum = sum[i + 1] + rotation;
    } else {
      lasum = sum[0];
    }
    sumcenter.push(sum[i] + (lasum - sum[i]) / 2);
    var add = 10;
    var cx =
      Math.sin(Math.radians(sum[i] + (lasum - sum[i]) / 2)) * radio + offorig.x;
    var cy =
      Math.cos(Math.radians(sum[i] + (lasum - sum[i]) / 2)) * radio + offorig.y;

    coordscircle.push({ rx: rx, ry: ry, cx: cx, cy: cy });
  } //--- for

  return [coordscircle, sum, onlyangles, sumcenter];
} //------final coords

/////////////////////////////////
/// SYSTEM FUNCTIONS & GLOBALS
/////////////////////////////////

var canvasobj = {
  width: $("#svg-wrap").outerWidth(),
  height: $("#svg-wrap").outerHeight(),
};

function radioselemts(obj, objradians, index, data) {
  var graph = d3.select("#svg-wrap");

  var systemid = coordsregister("radio", data);

  // si se ha habilitado los labels para un sistema especifico,
  // en este caso cojemos los datos de circle
  var radianlabel = circlecoords(objradians, obj.off);
  graph.append("svg:g").attr({
    id: "labelswrap_" + index,
  });

  graph
    .select("#labelswrap_" + index)
    .selectAll()
    .data(data)
    .enter() //----creates elements!!!
    .append("svg:text")
    .each(function (d, i) {
      var $this = $(this);
      var xcor = radianlabel[0][i].cx;
      var ycor = radianlabel[0][i].cy;

      //---escribo texto
      $this.text(d);

      //---arreglar orientacion de los labels
      var fixlabel;
      if (xcor <= canvasobj.width / 2) {
        fixlabel = 180;
        $this.attr({ "text-anchor": "end" });
      } else {
        fixlabel = 0;
      }

      todocoords[systemid].system.points.push({
        x: radianlabel[0][i].cx,
        y: radianlabel[0][i].cy,
      });
      var factcorr = 90;

      var transformation = "";

      if (obj.rotation) {
        transformation =
          "translate(" +
          xcor +
          "," +
          ycor +
          ") rotate(" +
          (factcorr + (factcorr - (radianlabel[3][i] + factcorr)) + fixlabel) +
          ")";
      } else {
        factcorr = obj.factor * (360 / 100);
        transformation =
          "translate(" +
          xcor +
          "," +
          ycor +
          ") rotate(" +
          (factcorr + (factcorr - (0 + factcorr)) + fixlabel) +
          ")";
      }

      $this.attr({
        transform: transformation,
      });
    }); //---final labels
} //-----radioelements

/////////////////////////////////
/// CONECTORS FUNCTIONS & GLOBALS
/////////////////////////////////
//almaceno coords para las líneas
var todocoords = [];

function coordsregister(tipo, data) {
  todocoords.push({
    system: {
      tipo: tipo,
      data: data,
      points: [],
    },
  });

  return todocoords.length - 1;
}

function pushcoords(systemid, x, y) {
  todocoords[systemid].system.points.push({ x: parseInt(x), y: parseInt(y) });
}

///////////////////////////
/// Auxiliary functions ///
///////////////////////////

function normalizevals(arr, grades) {
  var total = 0;
  var totalnorm = 0;
  var localarr = [];

  for (var i = 0; i < arr.length; i++) {
    total += arr[i];
  }

  for (i = 0; i < arr.length; i++) {
    localarr.push((arr[i] / total) * grades);
  }
  return localarr;
}

function misumelemarr(arr, grades) {
  var losangles = normalizevals(arr, grades);
  var arrsum = [0];
  var total = 0;

  for (var i = 0; i < losangles.length; i++) {
    total += losangles[i];

    if (i !== 0) {
      arrsum[i + 1] = total;
    } else {
      arrsum[i + 1] = losangles[i];
    }
  }
  return [arrsum, losangles];
}

Math.radians = function (degrees) {
  return (degrees * Math.PI) / 180;
};

function rand() {
  return Math.floor(Math.random() * 100 + 1);
}

function getMaxOfArray(arrr) {
  return Math.max.apply(null, arrr);
}

function getMinOfArray(arrr) {
  return Math.min.apply(null, arrr);
}
