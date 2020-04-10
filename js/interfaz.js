$(document).ready(function () {
  dropdownpanel(); //---crear listener para todos los droppanels

  $("#seltsystem").submit(function (event) {
    $(".wrap-ui-system").empty(); //---ojo mirar para cuando hayan rects

    numsystem = $.isNumeric($('input[type="text"]').val())
      ? parseInt($('input[type="text"]').val())
      : 1;
    if (numsystem === 0) {
      numsystem = 1;
    }

    for (var i = 0; i < numsystem; i++) {
      //----crear todos los systemas

      if (i < numsystem - 1) {
        var clonecirclesys = JSON.parse(JSON.stringify(setprops[0]));
        setprops.push(clonecirclesys);
      }
      setprops[i].systemcircle.circle.sliders.radio = i * 8 + 30;
      setprops[i].systemcircle.category.sliders.off = (numsystem - i) * 30;
      circle_system_ui(i);
    }

    dibujargraphs(setprops, numsystem);

    event.preventDefault();
  });

  //---initializate
  setTimeout(function () {
    $("#seltsystem input[type=submit]").trigger("click");
  }, 500);
}); //----ready
var numsystem;
//---ojo crear otro objeto default para rects!
var dataset2 = [1, 1, 1];

var setprops = [
  {
    systemcircle: {
      circle: {
        sliders: {
          posx: 50,
          posy: 50,
          grades: 99.99999, //---ojo de 0-100
          radio: 50,
          rotation: 0,
          strokew: 15,
        },
        checkboxes: {
          strokedata: false,
        },
      },
      category: {
        sliders: {
          rotation: 100,
          off: 30,
        },
        checkboxes: {
          rotate: true,
          connect: true,
          hide: true,
        },
      },
      data: dataset2,
    },
  },
];

function datamaker(count) {
  function htmlinput() {
    var htmlcheckbox = '<input type="text" placeholder="e.g. 10, 100, 200">';

    return htmlcheckbox;
  }

  var $parent = $("#systemcircle_" + count);

  $parent.append(htmlinput());

  $parent.find("input[type='text']").change(function () {
    var dataraw = $(this).val();
    var dataarr = dataraw.split(",");
    for (var item in dataarr) {
      dataarr[item] = $.isNumeric(dataarr[item]) ? parseInt(dataarr[item]) : 0;
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
    var htmlslider =
      '<div class="sliders">' +
      '<div class="clear">' +
      '<div class="label">' +
      elm +
      propsnames[id - 1] +
      "</div>" +
      '<div id="' +
      elm +
      propsnames[id - 1] +
      '" class="clear elslider"></div>' +
      "</div>" +
      "</div>";

    return htmlslider;
  }
  var $parent = $("#systemcircle_" + count);
  var $rectsys = $parent.find("." + elm + " .uiwrap");
  for (var i = 1; i <= num; i++) {
    $rectsys.append(htmlsliderfn(i));

    $parent.find("#" + elm + propsnames[i - 1]).slider({
      min: 1,
      max: 100,
      value: obj.sliders[propsnames[i - 1]],
      change: function () {
        inchangeslider($(this));
      },
    });
  }

  function inchangeslider($elm) {
    var idstr = $elm.attr("id");
    idstr = idstr.replace(elm, "");

    //---escribir props
    setprops[count].systemcircle[elm].sliders[idstr] = $elm.slider("value");

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
    var htmlcheckbox =
      '<div class="wrapcheck clear">' +
      '<div class="label">' +
      elm +
      propsnames[id - 1] +
      "</div>" +
      '<div id="' +
      elm +
      propsnames[id - 1] +
      '" class="tooglebox">' +
      '<div class="check"></div>' +
      "</div>" +
      "</div>";

    return htmlcheckbox;
  }
  var $parent = $("#systemcircle_" + count);
  var $rectsys = $parent.find("." + elm + " .uiwrap");
  for (var i = 1; i <= num; i++) {
    $rectsys.append(htmlcheckboxfn(i));
  } //---for

  $rectsys.on("click", ".tooglebox", function (e) {
    var $this = $(this);
    var idstr = $this.attr("id");
    idstr = idstr.replace(elm, "");

    if ($this.hasClass("checked")) {
      $this.removeClass("checked");
      setprops[count].systemcircle[elm].checkboxes[idstr] = true;
      dibujargraphs(setprops, numsystem);
    } else {
      $this.addClass("checked");
      setprops[count].systemcircle[elm].checkboxes[idstr] = false;
      dibujargraphs(setprops, numsystem);
    }
  });
} //------slidermaker

function category_ui(wrap, count) {
  $(".wrap-ui-system " + wrap).append(
    '<div class="category"><h2>Categories</h2><div class="uiwrap"></div></div>'
  );
  slidermaker(setprops[count].systemcircle.category, "category", count);
  checkboxmaker(setprops[count].systemcircle.category, "category", count);
}

function circle_system_ui(count) {
  $(".wrap-ui-system").append(
    '<div id="systemcircle_' + count + '" class="thesys"></div>'
  );
  $("#systemcircle_" + count).append(
    '<div class="circle"><h2>Circle sistem</h2><div class="uiwrap"></div></div>'
  );

  slidermaker(setprops[count].systemcircle.circle, "circle", count);
  checkboxmaker(setprops[count].systemcircle.circle, "circle", count);
  category_ui("#systemcircle_" + count, count);

  datamaker(count);
}

function dropdownpanel() {
  $(".wrap-ui-system").on("click", "h2", function () {
    $(this).toggleClass("do").next().slideToggle();
  });
}
