var cuestiones = [
  {
  	pregunta: ""
  	, imagen: "image-path"
  	, respuestas: [
  	  {
  	  	texto: ""
  	  	, puntos: 0
  	  	, mensaje: ""
  	  },
  	  {
  	  	texto: ""
  	  	, puntos: 0
  	  	, mensaje: ""
  	  }
	]

  }
 ];



 var regalos = [
   {
   	texto: ""
      , puntos: 3
	},
   {
   	texto: ""
      , puntos: 2
	}
 ];

function fisher_yates(array){
    var i=array.length;
    while(i--){
        var j=Math.floor( Math.random() * (i+1) );
        var tmp=array[i];
        array[i]=array[j];
        array[j]=tmp;
    }
}

exports.index = function(req, res){
  res.render('index', { title: 'Regalator' });
};

exports.juego = function(req, res){
  	if (!req.session.paso){
  		req.session.paso = 0;
  		req.session.puntos = 0;
  	}
	var cuestion = cuestiones[req.session.paso];
	console.log(cuestion.pregunta);
	res.render('juego', {title: 'Regalator', cuestion: cuestion, puntos: req.session.puntos});
}

exports.comprobar = function(req,res){
	var apunte = null;
	var paso = req.session.paso;
	var select = parseInt(req.body.select);
	var ultimo = req.session.paso == cuestiones.length -1;
	req.session.puntos += cuestiones[paso].respuestas[select].puntos;
	if(typeof(cuestiones[paso].apunte) != "undefined" && cuestiones[paso].respuestas[select].puntos<3){
		apunte = cuestiones[paso].apunte;
	}
	console.log("paso: "+ paso+"select: "+select+ "ultimo: " +ultimo);
	res.json({
		status: 'ok'
		, mensaje: cuestiones[paso].respuestas[select].mensaje
		, apunte: apunte
		, ultimo: ultimo
		, puntos: req.session.puntos
	});
	req.session.paso++;
	
	console.log("\npuntos: " + req.session.puntos + "\n");
}

exports.rifa = function(req,res){
	if(typeof(req.session.total) == "undefined"){
		for(i=0;i<regalos.length;i++){
			console.log(regalos[i].texto + ' / ' + regalos[i].puntos+'\n');		
		}

		fisher_yates(regalos);
		console.log("\n\n\n\n");
		for(i=0;i<regalos.length;i++){
			console.log(regalos[i].texto + ' / ' + regalos[i].puntos);		
		}
	}
	
	res.render('rifa', {title: 'Rifa!! Que alegría, qué alboroto, otro perrito piloto!'
						, regalos: regalos
						, puntos: req.session.puntos});
}

exports.regalar = function(req,res){
	select = parseInt(req.body.select);
	var finalizar = false;
	if(!req.session.total)
		req.session.total = 0;
	if(req.session.puntos > 4){
		if(regalos[select] != null && regalos[select].puntos == 5 && req.session.total < 9){
			for(i=0;i<regalos.length && !finalizar;i++){
				if(regalos[i] != null && i != select){
					var temp = regalos[i];
					regalos[i] =regalos[select];
					regalos[select] = temp;
					finalizar = true;
				}

			}
		}
	}else{
		if(req.session.puntos > 0){
			for(i=0;i<regalos.length && !finalizar;i++){
				if(regalos[i]!=null){
					if(regalos[i].puntos == 5){
						finalizar = true;
						regalos[i].puntos = req.session.puntos;
					}
				}
				
			}
			i--; //porque el bucle ha iterado una vez más para comprobar 'finalizar'
			select = i;	
		}else{
			regalos[select].texto = "Lo siento no te quedan puntos!";
			regalos[select].puntos = 0;
		}
		
	}
	if(regalos[select] == null){
		res.json({
			status: 'ok'
			, texto: "Ya has recogido este regalo"
			, total: req.session.puntos
			, puntos: 0 
		});
	}else{
		req.session.puntos -= regalos[select].puntos;
		res.json({
			status: 'ok'
			, texto: regalos[select].texto
			, total: req.session.puntos
			, puntos: regalos[select].puntos 
		});	
	}
	
	regalos[select] = null;	
}
