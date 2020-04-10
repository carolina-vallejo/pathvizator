$(document).ready(function () {
  //__INITIALIZATION
  dropdownpanel(); //---crear listener para todos los droppanels
  initcircles(1);
  btnsiconpaths(1); //---draw iconpaths---
  $("#btnpath1").addClass("act");
  $("#systemcircle_0").addClass("act");
  $("#arcswrap_" + 0).attr("class", "arc act");

  //---more circles
  $("#more-circle").on("click", function () {
    $(".wrap-ui-system").empty(); //---ojo mirar para cuando hayan rects

    //--maximo de circulos permitido
    numsystem += 1;

    if (numsystem > num_maxcircles) {
      numsystem = num_maxcircles;
    } else {
      btnsiconpaths(numsystem);
    }
    initcircles(numsystem);

    init_ui_act(numsystem - 1);
  }); ///---mas circles
  //---less circles
  $("#minus-circle").on("click", function () {
    $(".wrap-ui-system").empty(); //---ojo mirar para cuando hayan rects

    //--minimo de circulos permitido
    numsystem = numsystem < 2 ? 1 : (numsystem -= 1);
    initcircles(numsystem);
    $("#btnpath" + (numsystem + 1)).remove();

    init_ui_act(numsystem - 1);
  }); //---minus

  //---make a graph
  $("#graph").on("click", function () {
    $("html body").animate({ scrollTop: 0 }, 600);

    if ($(".inputtype .act").attr("id") === "sheets") {
      dividedata(thesheetsdata, actsistema);
    } else {
      dividedata(getformdata(), actsistema);
    }

    //
  });

  //----SHEETS FORM / EASY FORM
  $(".inputtype").on("click", "button", function () {
    var $this = $(this);
    $this.parent().children().removeClass("act");
    $this.addClass("act");

    if ($this.attr("id") === "sheets") {
      $("#inputtype-form").hide();
      $("#inputtype-sheets").show();
      console.log($this);
    } else {
      $("#inputtype-form").show();
      $("#inputtype-sheets").hide();
    }
  });

  enterdetector(0);
}); //----ready

function getformdata() {
  var $elemt = $("#catscontainer");
  var theobject = new Object();
  theobject.id = 0;
  theobject.type = "type1";
  theobject.data = [];

  $elemt.children("div").each(function (i) {
    theobject.data[i] = {
      color: $(this).find(".colorcat").css("background-color"),
      category: $(this).find(".label").val(),
      value: $.isNumeric($(this).find(".value").val())
        ? parseInt($(this).find(".value").val())
        : 0,
    };
  });
  // console.log('getdata'+JSON.stringify(theobject));
  return theobject;
}
//-----SPLIT DATA
function dividedata(obj, count) {
  var datavalue = [];
  var datacateg = [];
  var datacolor = [];
  for (var item in obj.data) {
    datavalue.push(obj.data[item].value);
    datacateg.push(obj.data[item].category);
    datacolor.push(obj.data[item].color);
  }
  //--si no hay ningun data se inicializa a 1
  if (datavalue.length === 1) {
    if (datavalue[0] === 0) {
      datavalue[0] = 1;
    }
  }
  setprops[count].systemcircle.data = datavalue;
  setprops[count].systemcircle.textcateg = datacateg;
  setprops[count].systemcircle.color = datacolor;

  dibujargraphs(setprops, numsystem);
}

function getgooglesheets() {
  $("#graph").hide();

  // ID of the Google Spreadsheet
  var spreadsheetID = "13YsPJFSmPXDE5PRr-d74vN78OHlrkJAfrwauzrIPmpk";

  var url =
    "https://spreadsheets.google.com/feeds/list/" +
    spreadsheetID +
    "/od6/public/values?alt=json";

  $.getJSON(url, function (data) {
    var entry = data.feed.entry;

    var theobject = new Object();
    theobject.id = 0;
    theobject.type = "type1";
    theobject.data = [];

    //--color management

    var arrdata = [];

    $(entry).each(function (i) {
      theobject.data[i] = {
        color: "gray",
        category: this.gsx$label1.$t,
        value: parseInt(this.gsx$value1.$t),
      };
      arrdata.push(parseInt(this.gsx$value1.$t));
    });

    // console.log(arrdata);
    // console.log('MAX: ' + getMaxOfArray(arrdata));
    // console.log('MIN: ' + getMinOfArray(arrdata));
    // console.log('length: ' + arrdata.length);

    var maxval = getMaxOfArray(arrdata);
    var minval = getMinOfArray(arrdata);
    var rangepaleta = 7;

    for (var val in arrdata) {
      var num = arrdata[val];

      //--- PALETE COLOR RANGE
      theobject.data[val].color =
        paleta[Math.round(num.map(minval, maxval, 1, 7))];
      var percent = Math.round(num.map(minval, maxval, 1, 100));
      //--MONO COLOR
      //theobject.data[val].color = 'hsl(200, 80%, '+Math.round(num.map(minval, maxval, 100, 1))+'%)';
    }

    thesheetsdata = theobject;
    $("#graph").show();
  });
}
getgooglesheets();
var thesheetsdata;

function enterdetector(num) {
  var valueinput = $(".value").get(num);
  Mousetrap(valueinput).bind("enter", function (e, combo) {
    $("#graph").trigger("click");
  });
}

function initcircles(numsystem) {
  for (var i = 0; i < numsystem; i++) {
    //----crear todos los systemas

    if (i < numsystem - 1) {
      var clonecirclesys = JSON.parse(JSON.stringify(setprops[0]));
      setprops.push(clonecirclesys);
    }
    setprops[i].systemcircle.circle.sliders.radio = i * 8 + 30;
    //setprops[i].systemcircle.category.sliders.off = (numsystem - i) * 30;
    circle_system_ui(i);

    //console.log('numsystem: ' + numsystem +' i '+ i);

    if (numsystem - 1 === i) {
      //para un nuevo circulo VACIAR DATA / CATEG / COLOR;
      setprops[i].systemcircle.data = [1];
      setprops[i].systemcircle.textcateg = [""];
      setprops[i].systemcircle.color = ["rgb(0, 187, 211)"];
    }
  }

  dibujargraphs(setprops, numsystem);
}

var numsystem = 1;
var num_maxcircles = 10;
//---ojo crear otro objeto default para rects!
var dataset = [1];
var datacateg = ["1"];
var datacolor = ["rgb(0, 187, 211)"];

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
          off: 60,
          fontsize: 25,
        },
        checkboxes: {
          rotate: true,
          connect: true,
          hide: true,
        },
      },
      data: dataset,
      textcateg: datacateg,
      color: datacolor,
    },
  },
];

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
      "<span id='label-value-" +
      elm +
      propsnames[id - 1] +
      "'></span>" +
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
        var idstr = $(this).attr("id");
        var $labelValue = $parent.find("#label-value-" + idstr);
        $labelValue.text($(this).slider("value"));
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
}

function dropdownpanel() {
  $(".wrap-ui-system").on("click", "h2", function () {
    $(this).toggleClass("do").next().slideToggle();
  });
}
