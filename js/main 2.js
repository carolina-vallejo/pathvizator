function dibujargraphs(transformobj) {
  $('#svg-wrap').empty();

  radianlabel = circlecoords(objcfg);

  //almaceno coords para las líneas
  var coords1 = [];

  var graph = d3.select("#svg-wrap");

  //var datamaxval = getMinOfArray(dataset);

  var scale = d3.scale.linear()
    .domain([getMinOfArray(dataset), getMaxOfArray(dataset)])
    .range([5, 150]);

  scalecol = d3.scale.linear()
    .domain([getMinOfArray(dataset), getMaxOfArray(dataset) / 1.4, getMaxOfArray(dataset)])
    .range([-1, 0, 1]);

  color = d3.scale.linear()
    .domain([-1, 0, 1])
    .range(["rgb(200, 200, 200)", "rgb(80,80,80)", "rgb(60,60,60)"]);

  //////console.log(color(0));

  var invert = dataset.length;
  var offxrect = transformobj.posx;
  var offyrect = transformobj.posy;
  graph.selectAll()
    .data(dataset)
    .enter()
    .append("svg:rect")
    .each(function(d, i) {
      var $this = $(this);
      var hrect = 5;
      invert--;

      $this.attr({
        'x': (0) + offxrect,
        'y': (((transformobj.hbar + (transformobj.space)) * invert) + 10) + offyrect,
        'width': (transformobj.wbar/30) * scale(d),
        'height': transformobj.hbar + 1,
        'fill': color(scalecol(d)),
        'id': 'barra' + i

      });

      drawarcs(i, objcfg);

      coords1.push({
        'points': [{
          'x': parseInt($this.attr('x')),
          'y': parseInt($this.attr('y')) + (hrect / 2)

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
      var xcor = (radianlabel[0][i].cx + offx);
      var ycor = (radianlabel[0][i].cy + offy);
      var factcorr = 90;

      //////console.log(JSON.stringify(radianlabel[0])); 

      $this.attr({
          'data-x': xcor,
          'data-y': ycor,
          'transform': 'translate(' + (xcor) + ',' + ycor + ') rotate(' + (factcorr + (factcorr - ((radianlabel[3][i]) + factcorr))) + ')'
        })
        .text(i + ' label ' + d);

      coords1[i].points[1] = { 'x': parseInt($this.attr('data-x')), 'y': parseInt($this.attr('data-y')) };
      //////console.log('data text: '+radianlabel[0][i].rx);

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
        'stroke': 'black'
      });
    }).attr("d", function(d) {
      return lineFunction(d.points);
    });

} //----dibujargraphs

var radianlabel;

var offx = 0;
var offy = 0;

var color, scalecol;

function drawarcs(i, objcfg2) {

  var raddata = circlecoords(objcfg2);

  //////console.log(JSON.stringify(raddata[0]));
  var angles = raddata[2];

  var svgns = "http://www.w3.org/2000/svg";

  var aPath3 = document.createElementNS(svgns, 'path');
  document.getElementById('svg-wrap').appendChild(aPath3);

  aPath3.setAttribute('d',
    ' M' + (raddata[0][i].rx + offx) + ',' + (raddata[0][i].ry + offy) +
    ' A' + '-' + (objcfg2.radio) + ' ' + (objcfg2.radio) + ' 0 ' + (angles[i] < 180 ? 0 : 1) + ' 0 ' +
    (raddata[0][i + 1].rx + offx) + ' ' + (raddata[0][i + 1].ry + offy)
  );

  //////console.log('data draw: '+raddata[0][i].rx);

  aPath3.setAttribute('stroke', color(scalecol(objcfg2.arr[i])));
  aPath3.setAttribute('stroke-width', 1);
  aPath3.setAttribute('fill', 'none');

}

//var dataset = [4.278098583, 2.352464008, 8.57979393, 4.717903532, 7.07036754, 4.2, 2.3333333333, 9.008321762, 126.5357450815, 87.87328, 11.3273771538, 5.4727604289, 0, 0, 100, 24.1827022451, 7.99360577730113, 137.5, 387.9047722729, 39.6724068363, 22.7407, 49.8385693954, 6.361541, 46.1956151252, 2.351122785, 4.71804376, 7.069166545, 153, 153 ,0.0046712205, 0.0046712205];

//var dataset = [10, 50, 100];

var dataset = [70, 20, 30, 40, 30, 30, 22, 12, 12, 12, 13, 15, 7, 23, 45, 22, 11, 11];

var marg = 45;
var first = 200;
var objcfg = {
  'offorig': { x: 200, y: 200 },
  'arr': dataset,
  'grades': 180,
  'radio': first - marg * 2,
  'rotation': 180
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
  var getsum = misumelemarr(arr, grades);
  var sum = getsum[0];
  var onlyangles = getsum[1];
  var sumcenter = [];

  //for (var i = sum.length - 1; i >= 0; i--) {
  for (var i = 0; i < sum.length; i++) {
    sum[i] = sum[i] + rotation;

    var rx = (Math.sin(Math.radians(sum[i])) * radio) + offorig.x;
    var ry = (Math.cos(Math.radians(sum[i])) * radio) + offorig.y;

    var lasum;
    if (i + 1 < sum.length) {
      lasum = sum[i + 1] + rotation;
    } else {
      lasum = sum[0];
    }
    sumcenter.push(sum[i] + ((lasum - sum[i]) / 2));
    var add = 10;
    var cx = (Math.sin(Math.radians(sum[i] + ((lasum - sum[i]) / 2))) * radio) + offorig.x;
    var cy = (Math.cos(Math.radians(sum[i] + ((lasum - sum[i]) / 2))) * radio) + offorig.y;

    coordscircle.push({ rx: rx, ry: ry, cx: cx, cy: cy });
    ////console.log( lasum );

    ////console.log('sum[i]: '+ sum[i] + ' sum[i] + (sum[i]/2) '+ (sum[i] +  add) );

    // ////console.log('rx: '+ rx+' ry: '+ry+' cx: '+cx+' cy: '+cy); 

  } //--- for

  //console.log(sum);
  //console.log(sumcenter);
  return [coordscircle, sum, onlyangles, sumcenter];
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
////////console.log(JSON.stringify(coordsmiddle)); 

