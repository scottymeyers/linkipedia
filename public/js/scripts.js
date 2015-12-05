$(function(){

  // table filtering on history
  new Tablesort(document.getElementById('history'), {});

  // foundation (forms)
	$(document).foundation();

  // reset button
  $('.reset').on('click', function(){
    location.reload();
  });

  // form submit
	$('#search').on('valid.fndtn.abide', function() {
		var formData = {
		  'start' : $('input[name="start"]').val(),
			'end'   : $('input[name="end"]').val(),
      'exact' : $('input[name="exact"]').is(':checked')
		};

    $('#results').empty();

    $('body').addClass('loading');

    $.ajax({
      type        : 'POST',
      url         : '/scrape',
      data        : formData,
      dataType    : 'json',
      encode          : true
    })
    .done(function(data) {
      $('body').removeClass('loading');

      if (data.error) {
        console.log(data.error);
        $('#results').append('<span class="error">There was an error, check your terms and try again. ('+ data.error +')</span>');
      } else {
        visualize(data);
      }
    });
  });
});

function visualize(json){
  var response, item, items = [];

  $.get( json.urls, function( data ) {
    var $urls = $('#urls');

    for ( var i = 0; i < data.length; i++ ) {
      if ( $('div[data-id="'+ data[i].parent +'"]').length ) {
        $('div[data-id="'+ data[i].parent +'"]').append('<div data-id="'+ data[i].id +'" class="url"></div>');
      } else {
        $urls.append('<div data-id="'+ data[i].id +'" class="url"></div>');
      }
    }
  });

  $.get( json.result, function( data ) {
    response = data[0];

    while (response.hasOwnProperty('children')){
      items.push(response.href);
      response = response.children[0];
    }

    if (response.href) {
      items.push(response.href);
    }

    $('#results').append('<p>Pages Searched: <em>'+ json.count +'</em> | Depth: <em>'+ json.depth +'</em></p><ul></ul>');

    for ( var i = 0; i < items.length; i++ ) {
      $('#results ul').append('<li>'+ items[i] +'</li>');
    }

  });
}
