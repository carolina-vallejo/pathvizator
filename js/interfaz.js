$(document).ready(function() {

  dropdownpanel();

  var $wrap_ui = $('.wrap-ui-system');

  //------

  $("#seltsystem").submit(function(event) {

    $('.wrap-ui-system').empty(); //---ojo mirar para cuando hayan rects

    //console.log($( "select option:selected" ).text());
    //console.log($( 'input[type="text"]' ).val());

    numsystem = $.isNumeric($('input[type="text"]').val()) ? parseInt($('input[type="text"]').val()) : 1;

    for (var i = 0; i < numsystem; i++) {

      if (i < numsystem - 1) {

        var clonecirclesys = JSON.parse(JSON.stringify(setprops[0]));
        setprops.push(clonecirclesys);
        

      }
      setprops[i].systemcircle.circle.sliders.radio =  (i * 10) + 30;
      circle_system_ui(i);
    }

    dibujargraphs(setprops, numsystem);

    //console.log('reescribiendo props: '+ JSON.stringify(setprops) );

    event.preventDefault();
  });



}); //----ready
var numsystem;
//---ojo crear otro objeto default para rects!
var setprops = [{
  systemcircle: {
    circle: {
      sliders: {
        posx: 50,
        posy: 50,
        grades: 50, //---ojo de 0-100
        radio: 50,
        rotation: 0,
        strokew: 1
      },
      checkboxes: {
        strokedata: true,
        labels: true
      }
    },
    category: {
      sliders: {
        rotation: 100,
        off: 10
      },
      checkboxes: {
        rotate: true
      }
    }
  }
}];

function slidermaker(obj, elm, count) {
  //console.log('xoy slidermaker: ' + JSON.stringify( setprops[count] ));

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

    //console.log('xoy inchange' + JSON.stringify( setprops ) + ' $elm: ' + $elm );
    dibujargraphs(setprops,numsystem);
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
      dibujargraphs(setprops,numsystem);
    } else {
      $this.addClass('checked');
      setprops[count].systemcircle[elm].checkboxes[idstr] = false;
      dibujargraphs(setprops,numsystem);
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

    CONECTORES
    - ojo que el random de las curvas solo se pueda modificar con los sliders de los conectores ojo!

    CIRCLE
    - ojo con muchos datos poder cambiar la escala del stroke data!
  
  MEJORAS DATA
    - dar la opcion de conectar con drivesheets
    - dar la opcion de ordenar los datos de mayor a menor
    - Data inputs! a. simple b. complejos    
  
  OTHER SYSTEMS:
    - poder hacer bloques de data, masonrys
    - random position for circles or rects

  MAS OPCIONES:
  - permitir cambiar los textos por lineas
  - poder conectar con líneas valores repetidos dentro del mismo chart
  - reajustar el grap en resize!
  
  /////////// TO_THINK LIST
  - como desplegar las opciones para cada chart?
  - Como relacionar valores? sub charts, encima de las barras o de las líneas, como meter data en systemas? 

********************/
