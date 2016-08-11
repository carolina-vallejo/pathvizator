$(document).ready(function() {

  dropdownpanel(); //---crear listener para todos los droppanels

  $("#seltsystem").submit(function(event) {

    $('.wrap-ui-system').empty(); //---ojo mirar para cuando hayan rects

    numsystem = $.isNumeric($('input[type="text"]').val()) ? parseInt($('input[type="text"]').val()) : 1;
    if (numsystem === 0) {
      numsystem = 1;
    }

    for (var i = 0; i < numsystem; i++) { //----crear todos los systemas

      if (i < numsystem - 1) {

        var clonecirclesys = JSON.parse(JSON.stringify(setprops[0]));
        setprops.push(clonecirclesys);

      }
      setprops[i].systemcircle.circle.sliders.radio = (i * 8) + 30;
      setprops[i].systemcircle.category.sliders.off = (numsystem - i) * 30;
      circle_system_ui(i);
    }

    dibujargraphs(setprops, numsystem);

    event.preventDefault();
  });

}); //----ready
var numsystem;
//---ojo crear otro objeto default para rects!
var dataset2 = [1];

//var dataset = [4.278098583, 2.352464008, 8.57979393, 4.717903532, 7.07036754, 4.2, 2.3333333333, 9.008321762, 126.5357450815, 87.87328, 11.3273771538, 5.4727604289, 0, 0, 100, 24.1827022451, 7.99360577730113, 137.5, 387.9047722729, 39.6724068363, 22.7407, 49.8385693954, 6.361541, 46.1956151252, 2.351122785, 4.71804376, 7.069166545, 153, 153 ,0.0046712205, 0.0046712205];

var dataset = [10, 50, 100];


//var dataset = [70, 20, 30, 40, 30, 30, 22, 12, 12, 12, 13, 15, 7, 23, 45, 22, 11, 11];

var setprops = [{
  systemcircle: {
    circle: {
      sliders: {
        posx: 50,
        posy: 50,
        grades: 99.99999, //---ojo de 0-100
        radio: 50,
        rotation: 0,
        strokew: 15
      },
      checkboxes: {
        strokedata: false,
      }
    },
    category: {
      sliders: {
        rotation: 100,
        off: 30
      },
      checkboxes: {
        rotate: true,
        connect: true,
        hide: true
      }
    },
    data:dataset2
  }
}];

function datamaker(count) {

  function htmlinput() {
    var htmlcheckbox = '<input type="text">';

    return htmlcheckbox;
  }

  var $parent = $('#systemcircle_' + count);

  $parent.append(htmlinput());

  $parent.find( "input[type='text']" ).change(function() {
    var dataraw=$(this).val();
    var dataarr=dataraw.split(',');
    for(var item in dataarr ){
      dataarr[item]=$.isNumeric( dataarr[item] ) ? parseInt(dataarr[item]) : 0;
    }

    setprops[count].systemcircle.data = dataarr;
    dibujargraphs(setprops, numsystem);
    
  });

} //------slidermaker

function slidermaker(obj, elm, count) {

  var num = Object.keys(obj.sliders).length;

  var propsnames = [];

  for (var name in obj.sliders) {

    propsnames.push(name);
  }

  function htmlsliderfn(id) {
    var htmlslider = '<div class="sliders">' +
      '<div class="clear">' +
      '<div class="label">' + elm + propsnames[id - 1] + '</div>' +
      '<div id="' + elm + propsnames[id - 1] + '" class="clear elslider"></div>' +
      '</div>' +
      '</div>';

    return htmlslider;
  }
  var $parent = $('#systemcircle_' + count);
  var $rectsys = $parent.find('.' + elm + ' .uiwrap');
  for (var i = 1; i <= num; i++) {

    $rectsys.append(htmlsliderfn(i));

    $parent.find('#' + elm + propsnames[i - 1]).slider({
      min: 1,
      max: 100,
      value: obj.sliders[propsnames[i - 1]],
      change: function() {
        inchangeslider($(this));
      }
    });
  }

  function inchangeslider($elm) {
    var idstr = $elm.attr('id');
    idstr = idstr.replace(elm, '');

    //---escribir props  
    setprops[count].systemcircle[elm].sliders[idstr] = $elm.slider('value');

    dibujargraphs(setprops, numsystem);
  }
} //------slidermaker

function checkboxmaker(obj, elm, count) {

  var num = Object.keys(obj.checkboxes).length;

  var propsnames = [];

  for (var name in obj.checkboxes) {

    propsnames.push(name);
  }

  function htmlcheckboxfn(id) {
    var htmlcheckbox = '<div class="wrapcheck clear">' +
      '<div class="label">' + elm + propsnames[id - 1] + '</div>' +
      '<div id="' + elm + propsnames[id - 1] + '" class="tooglebox">' +
      '<div class="check"></div>' +
      '</div>' +
      '</div>';

    return htmlcheckbox;
  }
  var $parent = $('#systemcircle_' + count);
  var $rectsys = $parent.find('.' + elm + ' .uiwrap');
  for (var i = 1; i <= num; i++) {
    $rectsys.append(htmlcheckboxfn(i));
  } //---for

  $rectsys.on('click', '.tooglebox', function(e) {

    var $this = $(this);
    var idstr = $this.attr('id');
    idstr = idstr.replace(elm, '');

    if ($this.hasClass('checked')) {
      $this.removeClass('checked');
      setprops[count].systemcircle[elm].checkboxes[idstr] = true;
      dibujargraphs(setprops, numsystem);
    } else {
      $this.addClass('checked');
      setprops[count].systemcircle[elm].checkboxes[idstr] = false;
      dibujargraphs(setprops, numsystem);
    }

  });

} //------slidermaker

function category_ui(wrap, count) {
  $('.wrap-ui-system ' + wrap).append('<div class="category"><h2>Categories</h2><div class="uiwrap"></div></div>');
  slidermaker(setprops[count].systemcircle.category, 'category', count);
  checkboxmaker(setprops[count].systemcircle.category, 'category', count);
}

function circle_system_ui(count) {

  $('.wrap-ui-system').append('<div id="systemcircle_' + count + '" class="thesys"></div>');
  $('#systemcircle_' + count).append('<div class="circle"><h2>Circle sistem</h2><div class="uiwrap"></div></div>');
  
  slidermaker(setprops[count].systemcircle.circle, 'circle', count);
  checkboxmaker(setprops[count].systemcircle.circle, 'circle', count);
  category_ui('#systemcircle_' + count, count);

  datamaker(count);

}

function dropdownpanel() {
  $('.wrap-ui-system').on('click', 'h2', function() {
    $(this).toggleClass('do').next().slideToggle();
  });
}

/********************


  ////////// A TENER EN CUENTA LIST

  - SKIN VISUALIZATION FOR YOUR DATA!!!!!

  - pasar un objeto de transformación
  - los valores de posicionamiento son relativos al canvas

  /////////// UI LIST

  CORRECCIONES:
  - ojo si se pone 0 como únio valor de data da error!
    
  MEJORAS UI:
    - mejorar los sliders, que se vea el valor
    - ojo como hacer que el slider de saltos en los valores!
    - ojo como hacer cuando un checkbox habilita otras configs
    - hacer dialogos de error

  IMPLEMENTAR UI:  
    - btn reset
    - deshacer
    - rehacer
    - guardar
    - load
    - interact
    - btn load/apply data
    - color
    - copycode
    - export png/svg

  MEJORAS SYSTEMS:

    BARRAS
    - poder darle toda la vuelta a las barras
    - hacer opcion data barras!
    - poder cambiar el alineamiento

    LABELS
    - hacer que los labels tengan un cuadro blanco para que no se mezclen
    - ojo los labels siempre hacerlos al final
    - poder cambiar el tamaño de la letra de los labels
    - ojo hay labels con data incluida, dar opciones... quitarla/ponerla
    - poder cambiar de posicion en el circulo de los label, al comienzo al final
    - ojo poder poner loas labels  uno de bajo de otro
    - poder coger los label del input
    - cambiar tamaño de letra del label
    -rotar los label segun la orientacion

    CONECTORES
    - OJO conectores entre systemas ¿?
    - Conectores de DATOS
    - ojo colores de las líneas diferentes para los conectores de labels y conectores de data

    CIRCLE
    - ojo con muchos datos poder cambiar la escala del stroke data!
    -OJO PODER METER DATA EN CADA SYSTEMA; HABILITANDO UN INPUT TEXT

    GENERAL
    - poder enviar para atrás el systema
  
  MEJORAS DATA
    - dar la opcion de conectar con drivesheets
    - dar la opcion de ordenar los datos de mayor a menor
    - Data inputs! a. simple b. complejos
    
    COLORES:
    - ojo puede ser que cada systema scale un color

  
  OTHER SYSTEMS:
    - poder hacer bloques de data, masonrys
    - random position for circles or rects

  MAS OPCIONES:
  - permitir cambiar los textos por lineas
  - poder conectar con líneas valores repetidos dentro del mismo chart
  - reajustar el grap en resize!
  - que al crear mas systemas ce circulo se rote un poco cada uno para no chafarse!
  - poner animacion!

  
  /////////// TO_THINK LIST
  - como desplegar las opciones para cada chart?
  - Como relacionar valores? sub charts, encima de las barras o de las líneas, como meter data en systemas? 

********************/
