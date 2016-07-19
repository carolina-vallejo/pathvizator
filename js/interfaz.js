$(document).ready(function() {

  dropdownpanel();

  dibujargraphs(setprops.systemcircle);
  
  var $wrap_ui = $('.wrap-ui-system');

  //------


    $( "form" ).submit(function( event ) {

      console.log($( "select option:selected" ).text());
      console.log($( 'input[type="text"]' ).val());

      var numsystem= $.isNumeric( $( 'input[type="text"]' ).val() ) ? parseInt( $( 'input[type="text"]' ).val() ) : 0;

      setprops['circle_0']={};
      setprops['circle_0'].sliders= {
        posx: 50,
        posy: 50,
        grades:50, //---ojo de 0-100
        radio:50,
        rotation:0,
        strokew:1
      }; 
 
      event.preventDefault();
    });

  //------ 
  circle_system_ui(0);

}); //----ready

var setprops = {
  systemcircle:{
    circle: {
      sliders: {
        posx: 50,
        posy: 50,
        grades:50, //---ojo de 0-100
        radio:50,
        rotation:0,
        strokew:1
      },
      checkboxes: {
        strokedata:true,
        labels:true
      }
    },
    category:{
      sliders:{
        rotation:100,
        off:10
      },
      checkboxes: {
        rotate:true
      }   
    }
  }
};


function slidermaker(obj, elm) {

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

  var $rectsys = $('.' + elm + ' .uiwrap');
  for (var i = 1; i <= num; i++) {

    $rectsys.append(htmlsliderfn(i));

    $('#' + elm + propsnames[i - 1]).slider({
      min: 1,
      max: 100,
      value: obj.sliders[propsnames[i - 1]],
      change: function() {
        inchangeslider($(this));
      }
    });
  }
  function inchangeslider($elm) {
    var idstr=$elm.attr('id');
    idstr=idstr.replace(elm, '');

    
    var system = elm;
    system = system.substring(0, system.indexOf('_'));
    setprops.systemcircle[system].sliders[idstr] = $elm.slider('value');



    //console.log(JSON.stringify(setprops['circle_0']));
    dibujargraphs(setprops.systemcircle);
  }
} //------slidermaker



function checkboxmaker(obj, elm) {

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
  var $rectsys = $('.' + elm + ' .uiwrap');
  for (var i = 1; i <= num; i++) {
    $rectsys.append(htmlcheckboxfn(i));
  } //---for

  $rectsys.on('click', '.tooglebox', function(e) {

    var $this = $(this);
    var idstr=$this.attr('id');
    idstr=idstr.replace(elm, '');

    var system = elm;
    system = system.substring(0, system.indexOf('_'));
    //console.log(system);

    if ($this.hasClass('checked')) {
      $this.removeClass('checked');
      setprops.systemcircle[system].checkboxes[idstr] = true;
      dibujargraphs(setprops.systemcircle);
    } else {
      $this.addClass('checked');
      setprops.systemcircle[system].checkboxes[idstr] = false;
      dibujargraphs(setprops.systemcircle);
    }

  });

} //------slidermaker

function dropdownpanel(){
  $('.wrap-ui-system').on('click','h2',function(){
    $(this).toggleClass('do').next().slideToggle();
  });
}

 function category_ui(count){
  $('.wrap-ui-system').append('<div class="category_'+count+'"><h2>Categories</h2><div class="uiwrap"></div></div>');
  slidermaker(setprops.systemcircle.category, 'category_'+count);
  checkboxmaker(setprops.systemcircle.category, 'category_'+count);
 }
 function circle_system_ui(count){
  var count="";
    $('.wrap-ui-system').append('<div class="circle_'+count+'"><h2>Circle sistem</h2><div class="uiwrap"></div></div>');
    slidermaker(setprops.systemcircle.circle, 'circle_'+count);
    checkboxmaker(setprops.systemcircle.circle, 'circle_'+count);

    category_ui(0);
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

  
  OTHER SYSTEMS:
    - poder hacer bloques de data, masonrys
    - random position for circles or rects

  DATA:    
    - dar la opcion de ordenar los datos de mayor a menor
    - Data inputs! a. simple b. complejos

  MAS OPCIONES:
  - permitir cambiar los textos por lineas
  - poder conectar con líneas valores repetidos dentro del mismo chart

  /////////// TO_THINK LIST
  - como desplegar las opciones para cada chart?
  - Como relacionar valores? sub charts, encima de las barras o de las líneas, como meter data en systemas? 

********************/
