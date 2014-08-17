CEVisualizer.geoCountryCurrencyMarker = CEVisualizer.geoCountryCurrencyMarker || {};

CEVisualizer.geoCountryCurrencyMarker.drawMapWithMarkers = function(){
		var mapProp = {
			center: new google.maps.LatLng(0, 0),
			zoom: 2,
			minZoom: 2,
			maxZoom: 10,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map=new google.maps.Map(document.getElementById("map_canvas"), mapProp);
		geocoder = new google.maps.Geocoder();
		var countryCurrencyInfo = CEVisualizer.currencyCountryList.getCurrencyCountryList();
		for(country in countryCurrencyInfo){
			var latLng = new google.maps.LatLng(countryCurrencyInfo[country].latitude,countryCurrencyInfo[country].longitude);
			var marker = new google.maps.Marker({
					map: map,
					position: latLng
			});
			if(countryCurrencyInfo[country].currencyCode!==undefined){
				marker.setTitle(country + " : " +  countryCurrencyInfo[country].currencyCode);
			}
			else{
				marker.setTitle(country);

			}
			attachMarkerToolTip(marker);
		}
		
		function attachMarkerToolTip(marker){
			var infoWindow = new google.maps.InfoWindow({
				content: countryCurrencyInfo[country].currencyCode
			});
			marker.infoWindow=infoWindow;
			attachMarkerEvent(marker);
		}		
		function attachMarkerEvent(marker){
			google.maps.event.addListener(marker, 'click', function() {
				if(CEVisualizer.compareMarkers.length<2){
					if(CEVisualizer.compareMarkers[0] !== marker){
						if(CEVisualizer.compareMarkers[0]!==undefined){
							var country1 = marker.getTitle().split(":")[0].trim();
							var country2 = CEVisualizer.compareMarkers[0].getTitle().split(":")[0].trim();
							var curCode1 = marker.getTitle().split(":")[1].trim();
							var curCode2 = CEVisualizer.compareMarkers[0].getTitle().split(":")[1].trim();
							var exchangeRate=getExchangeRates(curCode1, curCode2);
							marker.infoWindow.setContent(country1 + "[" + curCode1 + "]: 1 equals " + country2 + "[" + curCode2 + "]: ");
							CEVisualizer.compareMarkers[0].infoWindow.setContent(country2 + "[" + curCode2 + "]: 1 equals " + country1 + "[" + curCode1 + "]: ");
						}
						CEVisualizer.compareMarkers.push(marker);
						marker.infoWindow.open(marker.get('map'), marker);
					}
					else{
						alert("No use of selecting me again.");
					}
				}
				else{
					alert("Can't select any more. Close one of the opened.");
				}
			});
			google.maps.event.addListener(marker.infoWindow,'closeclick',function(){
				if(CEVisualizer.compareMarkers[0] === marker){
					CEVisualizer.compareMarkers.splice(0,1);
				}else{
					CEVisualizer.compareMarkers.splice(1,1);
				}
			});
		}
		function getExchangeRates(curCode1, curCode2){
			$.ajax({
				async : false,
				dataType: 'jsonp',
				url : "http://www.freecurrencyconverterapi.com/api/convert?q=" + curCode1 + "-" + curCode2,
				success: function(exchangeRate){
					var exchangeRate1to2=exchangeRate.results[curCode1 + "-" + curCode2].val;
					CEVisualizer.compareMarkers[1].infoWindow.setContent(CEVisualizer.compareMarkers[1].infoWindow.getContent() + exchangeRate1to2);
					CEVisualizer.compareMarkers[0].infoWindow.setContent(CEVisualizer.compareMarkers[0].infoWindow.getContent() + Math.floor((1/exchangeRate1to2)*1000)/1000);
				}
			});
			/*$.ajax({
				async : false,
				dataType: 'jsonp',
				url : "http://www.freecurrencyconverterapi.com/api/convert?q=" + curCode2 + "-" + curCode1,
				success: function(exchangeRate){
					//CEVisualizer.compareMarkers[0].infoWindow.setContent(CEVisualizer.compareMarkers[0].infoWindow.getContent() + exchangeRate.results[curCode2 + "-" + curCode1].val);
				}
			});*/
		}
}