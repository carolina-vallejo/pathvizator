
function sortlabels(obj) {

  var sortable = [];

  for (var i = 0; i < obj.data.length; i++) {
    sortable.push([i, obj.data[i].value]);
  }

  //--- reordenar leyendas
  sortable.sort(function(a, b) {
    return a[1] - b[1]
  });
  sortable.reverse();

  // labels container:
  var svgparent = document.getElementById('pathviz');
  var catswrap = document.createElementNS(svgns, 'g');
  catswrap.setAttribute('id', 'labelswrap');
  svgparent.appendChild(catswrap);

  // pass data to create labels
  for (var i = 0; i < sortable.length; i++) {

    var color = obj.data[sortable[i][0]].color;
    var valor = obj.data[sortable[i][0]].value;
    var label = obj.data[sortable[i][0]].category;

    createlabels(i, color, valor, label, catswrap);
  }

  //positioning
  //get viewBox
  var box = svgparent.viewBox.baseVal;
  //console.log(box.height );

  var wrapbox = catswrap.getBBox();
  var donutbox = svgparent.firstChild.getBBox();
  //console.log(donutbox);

  var coorx = donutbox.width + donutbox.x + 50;
  var coory = (box.height - wrapbox.height) / 2;

  catswrap.setAttribute('transform', 'translate(' + coorx + ' ' + coory + ')');

}