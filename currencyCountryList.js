CEVisualizer.currencyCountryList = CEVisualizer.currencyCountryList || {};

CEVisualizer.currencyCountryList.getCurrencyCountryList = function(){
			var countryCurrencyInfo={};
			$.ajaxSetup({
				async : false
			});
			$.get("http://api.geonames.org/countryInfoJSON?username=cevisualizer", function(countryInfo){
				if(countryInfo.geonames){
					console.log("Country Information API successful.");
					for(var i=0; i<countryInfo.geonames.length; i++){
						var country = countryInfo.geonames[i];
						countryCurrencyInfo[country.countryName] = {
							currencyCode: country.currencyCode
						}
						if(country.east < 0 && country.west > 0){
							var posSide = 180 - country.west;
							var negSide = 180 + country.east;
							var midTotal = (posSide + negSide)/2;
							var longitude;
							if((longitude=country.west + midTotal) > 180){
								longitude = -180 - midTotal - posSide;
							}
							countryCurrencyInfo[country.countryName].longitude =  longitude;
						}
						if(country.north < 0 && country.south > 0){
							var posSide = 90 - country.south;
							var negSide = 90 + country.north;
							var midTotal = (posSide + negSide)/2;
							var latitude;
							if((latitude=country.west + midTotal) > 90){
								latitude = -90 - midTotal - posSide;
							}
							countryCurrencyInfo[country.countryName].latitude =  latitude;
						}
						if(!countryCurrencyInfo[country.countryName].longitude){
							countryCurrencyInfo[country.countryName].longitude =  (country.east + country.west)/2
						}
						if(!countryCurrencyInfo[country.countryName].latitude){
							countryCurrencyInfo[country.countryName].latitude =  (country.north + country.south)/2
						}
					}
				}
				else{
					console.log("Country Information API unsuccessful.");
				}
			});
			$.ajaxSetup({
				async : true
			});
			return countryCurrencyInfo;
}