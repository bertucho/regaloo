var descubrir = function(){
	//$('#modalbox').fadeTo(1000,0.7);
	var select = $(this).attr('id');
	thisDiv = $(this);
	if($(this).attr('class') == 'tapado'){
		$.ajax({
			type: "POST"
			, url: "/rifa"
			, data: JSON.stringify({select: select})
			, contentType: "application/json; charset=utf-8"
			, dataType: "json"
			, success: function(data){
				$('#contenido').html('<div id="valor">Por <span id="punt">'+data.puntos+'</span> puntos!</div>')
				$('#contenido').append('<br>'+data.texto);
				//$('#modalbox').append('<div id="cerrar"><a id="comprobar">Continuar</a></div>');
				$('#modalbox, #darken').fadeTo(1000,0.8);
				thisDiv.attr('class', 'descubierto');
				thisDiv.text(data.texto);
				$('#puntos').text(data.total);
			}
			, error: function(err){
				var msg = 'Status: ' + err.status + ': ' +err.responseText;
				alert(msg);
			}
		});
	}

	return false;
}


$(document).ready(function(){
	$('.tapado').click(descubrir);
	$('#cerrar').click(function(){
		$('#modalbox, #darken').fadeOut();

	});
});