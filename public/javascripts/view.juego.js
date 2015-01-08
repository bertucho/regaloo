var comprobar = function(){
	if($('a#comprobar').text() == "Comprobar"){
		var select = $("input[name='opciones']:checked").val();
		$.ajax({
			type: "POST"
			, url: "/comprobar"
			, data:  JSON.stringify({select: select})
			, contentType: "application/json; charset=utf-8"
			, dataType: "json"
			, success: function(data){
				$('#mensaje').text(data.mensaje);
				if(data.apunte!=null){
					$('#mensaje').append('<br>');
					$('#mensaje').append(data.apunte);
				}
				$('a#comprobar').text('Continuar');
				if(data.ultimo){
					$('a#comprobar').attr('href', '/rifa');
				}else{
					$('a#comprobar').attr('href', '/juego');				
				}
				//$('a#comprobar').attr('id', 'continuar');
			}
			, error: function(err){
				var msg = 'Status: ' + err.status + ': ' + err.responseText;
				alert(msg);
			}
		});
		return false;
	}else{
		next();
	}

}

$(document).ready(function(){
	// var texto = $('a#comprobar').attr('title');
	// if(texto == "Comprobar")
		$('a#comprobar').click(comprobar);
});