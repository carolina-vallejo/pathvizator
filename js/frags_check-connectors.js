////---- NEW CONNECTORS FORM
function conectorsform() {

  var allcheckhtml = '';

  for (var i = 0; i < todocoords.length; i++) {
    allcheckhtml += '<input type="checkbox" name="' +
      todocoords[i].system.tipo + '_' + i +
      '" value="' + todocoords[i].system.tipo + '_' + i + '">' + todocoords[i].system.tipo + '_' + i;

  }

  $('#selconnector').append('<div class="wrapchecks">' + allcheckhtml + '</div>').css('display', 'block');

  $("#selconnector").on('submit', function(event) {

    $("#selconnector input[type=checkbox]").each(function(index) {
      if ($(this).prop('checked')) {
        console.log($(this).attr('name') + '  ' + index);
      }
    });
    event.preventDefault();
  });
}