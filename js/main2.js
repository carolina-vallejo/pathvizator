$(document).ready(function() {




  //var dataset = [70, 20, 30, 40, 30, 30, 22, 12, 12, 12, 13, 15, 7, 23, 45, 22, 11, 11];
  //var dataset = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];

  

  radianspos = circlecoords(objcfg);



  //almaceno coords para las líneas
  var coords1 = [];

  var graph = d3.select("#svg-wrap");

  var datamaxval = getMinOfArray(dataset);


  var scale = d3.scale.linear()
    .domain([getMinOfArray(dataset), getMaxOfArray(dataset)])
    .range([5, 100]);

   scalecol = d3.scale.linear()
    .domain([getMinOfArray(dataset), getMaxOfArray(dataset) / 1.4  , getMaxOfArray(dataset)])
    .range([-1,0, 1]);   

   color = d3.scale.linear()
      .domain([-1, 0, 1])
      .range(["rgb(200, 200, 200)", "rgb(10,10,10)"]);
     

     //console.log(color(0));


  var objcfg2 = {
    'offorig': { x: 200, y: 200 },
    'arr': dataset,
    'grades': 200,
    'radio':first,
    'rotation':180
  };

  var objcfg3 = {
    'offorig': { x: 200, y: 200 },
    'arr': dataset,
    'grades': 100,
    'radio':first - marg,
    'rotation':180
  };
    var objcfg4 = {
    'offorig': { x: 200, y: 200 },
    'arr': dataset,
    'grades': 180,
    'radio':first - marg*2,
    'rotation':180
  };

  var offxrect = 100;
  var offyrect = 100;
  graph.selectAll()
    .data(dataset.reverse()) //ojo lo que no tiene que ver con circulo se vuelve a revertir!
    .enter()
    .append("svg:rect")
    .each(function(d, i) {
      var $this = $(this);

      $this.attr({
        'x': (350) + offxrect,
        'y': ((12 * i) + 10) + +offyrect,
        'width': 1 * scale(d),
        'height': 10,
        'fill': color(scalecol(d))

      });

      drawarcs(i, objcfg2);
      drawarcs(i, objcfg3);
      drawarcs(i, objcfg4);

      coords1.push({
        'points': [{
          'x': parseInt($this.attr('x')),
          'y': parseInt($this.attr('y'))

        }]
      });
      
      

    }); //---final rects


  graph.append("svg:g")
    .attr({
      'id': 'elcircle'
    });



  graph.select('#elcircle').selectAll()
    .data(dataset)
    .enter() //----creates elements!!!
    .append("svg:text")
    .each(function(d, i) {

      var $this = $(this);
      var xcor = (radianspos[0][i].rx + offx);
      var ycor = (radianspos[0][i].ry + offy);
      var factcorr = 90;

      $this.attr({
          'data-x': xcor,
          'data-y': ycor,
          'transform': 'translate(' + (xcor) + ',' + ycor + ') rotate(' + (factcorr + (factcorr - ((radianspos[1][i]) + factcorr))) + ')'
        })
        .text('label  ' + i);

      coords1[i].points[1] = { 'x': parseInt($this.attr('data-x')), 'y': parseInt($this.attr('data-y')) };
      
      

    }); //---final labels




  //// TO-DO PARA LAS CURVAS PONER PUNTOS INTERMEDIOS!!
  var offcurve1 = 0;
  var offcurve2 = 0;
  var lineFunction = d3.svg.line()
    .x(function(d) {
      return d.x
    })
    .y(function(d) {
      return d.y
    })
    .interpolate(

      //'linear'

      function(points) {
        return points.join(' C' + (points[0][0] + offcurve1) +
          ',' + (points[0][1] - offcurve1) +
          ' ' + (points[1][0] - offcurve2) +
          ',' + (points[1][1] + offcurve2) +
          ' ');
      }

    );



  var lines = graph.selectAll().data(coords1);

  lines.enter().append("path")
    .attr("class", "line")
    .attr('stroke', 'black')
    .each(function(d, i) {
      $(this).attr({
        'fill': 'none',
        'stroke': color(scalecol( objcfg2.arr[i] ))
      });
    }).attr("d", function(d) {
      return lineFunction(d.points);
    });


}); ///--->ready





var radianspos;

var offx = 100;
var offy = 100;


var angles = [];
var color, scalecol;

function drawarcs(i, objcfg2) {
  /*
  var objcfg2 = {
    'offorig': { x: 200, y: 200 },
    'arr': dataset,
    'grades': 360,
    'radio':200,
    'rotation':180
  };
*/
  var raddata=circlecoords(objcfg2);
  var angles=raddata[2].reverse();

  var svgns = "http://www.w3.org/2000/svg";

  var aPath3 = document.createElementNS(svgns, 'path');
  document.getElementById('svg-wrap').appendChild(aPath3);

  aPath3.setAttribute('d',
    ' M' + (raddata[0][i].rx + offx) + ',' + (raddata[0][i].ry + offy) +
    ' A' + '-' + (objcfg2.radio) + ' ' + (objcfg2.radio) + ' 0 ' + ( angles[i] < 180 ? 0 : 1) + ' 1 ' +
    (raddata[0][i + 1].rx + offx) + ' ' + (raddata[0][i + 1].ry + offy)
  );

 // //console.log(raddata[2]);

  aPath3.setAttribute('stroke', color(scalecol( objcfg2.arr[i] )) );
  aPath3.setAttribute('stroke-width', 30);
  aPath3.setAttribute('fill', 'none');

};
//var dataset = [4.278098583, 2.352464008, 8.57979393, 4.717903532, 7.07036754, 4.2, 2.3333333333, 9.008321762, 126.5357450815, 87.87328, 11.3273771538, 5.4727604289, 0, 0, 100, 24.1827022451, 7.99360577730113, 137.5, 387.9047722729, 39.6724068363, 22.7407, 49.8385693954, 6.361541, 46.1956151252, 2.351122785, 4.71804376, 7.069166545, 153, 153 ,0.0046712205, 0.0046712205];

//var dataset = [10, 50, 100];

var dataset = [70, 20, 30, 40, 30, 30, 22, 12, 12, 12, 13, 15, 7, 23, 45, 22, 11, 11];

var marg=45;
var first=200;
var objcfg = {
  'offorig': { x: 200, y: 200 },
  'arr': dataset,
  'grades': 180,
  'radio':first - marg*2,
  'rotation':180
};

function circlecoords(objcfg) {

  ///---fuera
  var offorig = objcfg.offorig;
  var arr = objcfg.arr;
  var grades = objcfg.grades;
  var radio = objcfg.radio;
  var rotation = objcfg.rotation;

  ///--locals
  var coordscircle = [];
  var getsum = misumelemarr(arr, grades)
  var sum = getsum[0];

  for (var i = sum.length - 1; i >= 0; i--) {
    sum[i] = sum[i] + rotation;

    var rx = (Math.sin(Math.radians(sum[i])) * radio) + offorig.x;
    var ry = (Math.cos(Math.radians(sum[i])) * radio) + offorig.y;

    coordscircle.push({ rx: rx, ry: ry });

  } //--- for

  return [coordscircle, sum.reverse(), getsum[1]];
} //------final coords


///////////////////////////
/// Auxiliary functions ///
///////////////////////////
function palette(i) {


  //styling
  var colors = ['#00BBD3', '#9B26AF', '#6639B6', '#3E50B4', '#2095F2', '#02A8F3', '#009587', '#4BAE4F', '#8AC249', '#CCDB38', '#FEEA3A', '#FEC006', '#FE9700', '#FE5621', '#F34235', '#E81D62', '#785447', '#9D9D9D', '#5F7C8A'];

  return colors[i % colors.length];
}

function normalizevals(arr, grades) {


  var total = 0;
  var totalnorm = 0;
  var localarr = [];

  for (var i = 0; i < arr.length; i++) {
    total += arr[i];
  }

  for (i = 0; i < arr.length; i++) {

    localarr.push(((arr[i]) / total) * (grades));

  }
  return localarr;
}

function misumelemarr(arr, grades) {
  angles = normalizevals(arr, grades);
  var arrsum = [0];
  var total = 0;

  for (var i = 0; i < angles.length; i++) {
    total += angles[i];

    if (i !== 0) {
      arrsum[i + 1] = total;
    } else {
      arrsum[i + 1] = angles[i];
    }
  }
  return [arrsum, angles];
}

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

function rand() {
  return Math.floor((Math.random() * 100) + 1);
}

function getMaxOfArray(arrr) {
  return Math.max.apply(null, arrr);
}

function getMinOfArray(arrr) {
  return Math.min.apply(null, arrr);
}
  ////console.log(JSON.stringify(coordsmiddle)); 
