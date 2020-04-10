$(document).ready(function() {



  $("#colorpicker").spectrum({
    color: "#E91C60",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showPalette: true,
    hideAfterPaletteSelect: true,
    showSelectionPalette: true,
    maxSelectionSize: 6,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    palette: [paleta]
  });

  var coloract, colorelemt;

  $("#colorpicker").change(function() {
    coloract = $(this).val();
    changecolorcat(coloract, colorelemt);

  });

  ////////////////////
  /// INTERFACE ///
  ////////////////////

  /*
   * copy code! 
   */

  $('#copycode').on('click', function() {

    //indent code
    var svgcode = vkbeautify.xml($('#svgcontainer').html());

    //instanciate clipboardjs
    var clipboard = new Clipboard('.btncopycode', {
      text: function(trigger) {
        return svgcode;
      }
    });
    $('.btncopycode').trigger('click');

    // replace '<' '>' '&'
    var svgencode = encodeXmlEntities(svgcode);
    // append code
    $('#svgcode').css('opacity', 0).empty().append(svgencode);

    // styling code!
    Prism.highlightElement(document.getElementById('svgcode'), false, function() {});

    //move scroll to bottom!
    var codescroll = $('.codeoutput').offset();

    $('html body').animate({ scrollTop: (codescroll.top - 50) }, 600, function() {
      $('#svgcode').animate({ opacity: 1 }, 600, 'easeOutQuad');
      //$('.outputs').animate({ opacity: 1 }, 600, 'easeOutQuad');
    });

    $('.outputs').css('opacity', 1);
    setTimeout(function() {
      $('.outputs').css('opacity', 0);
    }, 1000);

  }); //---->final copycode event

  ////////////////////
  /// DATA INPUTS ///
  ////////////////////

  /*
   * color picker
   */
  $('#category' + 1).on('click', '.opencolor', function(e) {
    colorelemt = $(this);
    $("#colorpicker").spectrum("toggle");
    return false;
  });

  /*
   * more btn
   */
  var counter = 1;
  $('#moreinput').on('click.morebtn', function() {
    counter++;

    var catinput = $('#category1').html();

    $('.inputs').append('<div id="category' + counter + '">' + catinput + '</div>');
    $('#category' + counter).find('.colorcat').css('background-color', paleta[counter]);

    $('#category' + counter).on('click', '.opencolor', function() {
      colorelemt = $(this);
      $("#colorpicker").spectrum("toggle");
      return false;
    });

      enterdetector(counter-1);

  });

  /*
   * minus btn
   */
  $('#minusinput').on('click', function() {
    var $lastdiv = $('.inputs').children('div:last-child');

    if ($lastdiv.attr('id') !== 'category1') {

      $lastdiv.off('click');
      $lastdiv.remove();
    }
  });



  /*
   * btns iconpaths!
   */


  //---EVENTS
  $(window).scroll(function() {
    //console.log($( window ).scrollTop());
  });

}); //--- *ready

//---color picker!
var paleta = ['#00BBD3', '#9B26AF', '#6639B6', '#3E50B4', '#2095F2', '#02A8F3', '#009587', '#4BAE4F', '#8AC249', '#CCDB38', '#FEEA3A', '#FEC006', '#FE9700', '#FE5621', '#F34235', '#E81D62', '#785447', '#9D9D9D', '#5F7C8A'];
var mypaths = {
  circle: "M45,120a75,75 0 1,0 150,0a75,75 0 1,0 -150,0",
  line: "M 0 120 L 200 120",
  triangle: "M92.401,190c-41.454,0-58.413-29.371-37.685-65.273l27.598-47.8  c20.728-35.902,54.645-35.902,75.372,0l27.6,47.8C206.012,160.626,189.054,190,147.599,190H92.401z",
  infinite: "M35.614,121c0,81,168.771-84,168.771,0 C204.386,202,35.614,37,35.614,121z",
  trebol: "M120,120C120-37.355,277.355,120,120,120 C-37.357,120,120-37.355,120,120C120,277.357-37.357,120,120,120 C277.355,120,120,277.357,120,120z",
  curve: "M34.313,109.723c22.626-3.43,26.835,10.622,45.134,18.138 c13.849,5.688,31.384,2.034,45.438-1.717c19.042-5.083,34.272-15.123,54.508-9.093c9.48,2.825,16.451,10.84,26.294,11.375",
  spiral: "M173.34,34.29c40.607,40.608,40.607,106.446,0,147.055  c-32.486,32.486-85.157,32.486-117.644,0c-25.989-25.989-25.989-68.126,0-94.115c20.791-20.791,54.501-20.791,75.292,0  c16.633,16.634,16.633,43.601,0,60.233c-13.307,13.307-34.88,13.307-48.187,0c-10.645-10.645-10.645-27.904,0-38.549  c8.516-8.517,22.324-8.517,30.839,0c6.813,6.812,6.813,17.858,0,24.671c-5.45,5.451-14.287,5.451-19.737,0"
};
//--iniciar UI circle ACT
function init_ui_act(index){

  actsistema=index;

  //---limpiar ACT
  $('.grapbtn').removeClass('act');
  $('.thesys').removeClass('act');
  $('.arc').attr('class','arc');
  
  //---marcar ACT    
  $('#btnpath' + (index + 1)).addClass('act');
  $('#systemcircle_'+ index).addClass('act');
  $('#arcswrap_' + index).attr('class','arc act');

 //console.log(JSON.stringify(setprops[index].systemcircle.data));
 
 $('#catscontainer').children().each(function(i){
  $(this).find('.value').val(setprops[index].systemcircle.data[i]);
 });

}//----init_ui_act

var actsistema=0;
function encodeXmlEntities(str) {
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
var svgns = "http://www.w3.org/2000/svg";



//------color change
function changecolorcat(coloract, elemt) {

  $(elemt).css('background-color', coloract);
  $(elemt).attr('data-color', coloract);

}
//----- INSERTAR SVG EN LOS BOTONES
function drawiconpath(id, path) {

  var svgcontext = document.getElementById('path' + id);
  svgcontext.setAttribute('viewBox', '25 25 190 190');

  var iconpath = document.createElementNS(svgns, 'path');
  //--path circle
  iconpath.setAttribute('d', path);
  iconpath.style.strokeWidth = 20;
  iconpath.style.stroke = '#2A2B30';
  iconpath.style.fillOpacity = 0;

  svgcontext.appendChild(iconpath);

}
//---INIT BTNS SUPERIORES

function btnsiconpaths(num) {

  var iconpathbtn = '<button id="btnpath' + num + '" class="grapbtn"><svg id="path' + num + '"></svg></button>';
    $('.btnswrap').append(iconpathbtn);
    drawiconpath(num, mypaths.circle);

    // listeners
    $('#btnpath' + num).on('click', function() {
      init_ui_act($(this).index() - 1);
    });  
}

function btn_viz_all() {
  var num='all';
  var iconpathbtn = '<button id="btnpathx" class="grapbtn"><svg id="path' + num + '"></svg></button>';
    $('.btnswrap').prepend(iconpathbtn);
    drawiconpath(num, mypaths.spiral);
   

    // listeners
    $('#btnpathx').on('click', function() {
      
      $('.arc').attr('class','arc show');
      $('.grapbtn').removeClass('act').addClass('show');
      $(this).addClass('act');
    });  
}
btn_viz_all();
//---DATAS VAR


/*

UI/UX COMMENTS

- hacer scroll cuando se creen mas categorias y scroll+animation cuando se genere la viz
- cuando metas un valor que no es numero animar para quitarlo y hacer un llamado
- menu izquiero para cambiar stroke width /  y que tal morfismo shape?
- esquina con logo de github
- esquna der con las shapes por defector para la donut, pensar como podría ser para las demas grñaficas, talvez icono de tipologías.

- Pensar en radar! y en otras cosas raras...!!! piensa en colors feels, como se haria eso?
valores de varias coordenadas, como tiempo/lugar/valor----

- si son muchas las leyendas ponerlas por columnas

- pensar en el icono del < code > que se va a generar y en su diseño!

- al lado del boton de crear grafico, poner copiar codigo, esto abre un lightbox con el codigo a copiar, ojo inluir animaciones!

- el color picker al abrirse debería mostrar el color el click element

- reset button!

- que al hacer enter se oprima el " make a graph! "

- hacer btn de subir pa arriba del todo

- que al hacer copi code se redibuje todo y se genere de nuevo el code!

PARA PROMO:
- hacer video con el funcionamiento, youtube, y rodarlo en twitter!.
- o explicar con tooltips, maybe...
- que quede claro que se puede cambiar el color


UTILITIES!!!
- ojo autogenerar el data porque es un coñazo!

*/
