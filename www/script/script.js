$(document).ready(function(){
	
		var lat;
			var lon;
//			
//			if(navigator.geolocation){
//				navigator.geolocation.getCurrentPosition(function(position){
//					lat = position.coords.latitude;
//					lon = position.coords.longitude;
//
//				});
//			}
//			
//			
			
			$.ajax({
				
				url: "https://ipinfo.io/geo",
				dataType:"json",
				success:function(result){
					var loc = result.loc;
					loc = loc.split(",");
					lat = loc[0]; 
					lon = loc[1]; 
				} 
				
			});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//세로 가로 
	
	// 헤더바 , 섹션 높이 설정해주기
	function secset(){
		var vh = parseInt($(window).outerHeight());
		var vw = parseInt($(window).outerWidth());
		
		var hh = parseInt($("#hdbar").outerHeight());
		var mh = parseInt($("#mid").outerHeight());
		var bh = parseInt($("#bot").outerHeight());
		$("section").height(vh-hh);
		$("#top").height(vh-hh-mh-bh);
		
		
		if (vh < vw){
			$("#midbot").css("margin-top",vh-hh-220+"px");
		}else {
			$("#midbot").css("margin-top","0");
			
		}
	}
	
	secset();
	// 윈도우가 시작될떄마다 함수 실행 
	$(window).resize(function(){
		secset();
	});
	
	
	//city 글자수에 따라 글자크기 지정하기 
	function clen(){
		var len = $("#city").text().length;
		if(len >= 14){
			$("city").addClass("stext");
			
		}else{
			
			$("city").removeClass("stext");
		}
		
	}
	clen(this);
	// http://api.openweathermap.org/data/2.5/forecast
	//	q=London
	//  mode=json
	//	&units=metric
	//  appid=77a61c82273af44c1191342495c45b6e
	var link="http://api.openweathermap.org/data/2.5/forecast";
	var myid ="77a61c82273af44c1191342495c45b6e";
	
	function id2icon(id){
		
		if(id>=200 && id<300){
			icon = "fas fa-bolt";
		}else if(id>=300 && id<400){
			icon = "fas fa-cloud-rain";
		}else if(id>=400 && id<600){
			icon = "fas fa-cloud-showers-heavy";
		}else if(id>=600 && id<700){
			icon = "fas fa-snowflake";
		}else if(id>=700 && id<800){
			icon = "fas fa-smog";
		}else if(id==800){
			icon = "fas fa-sun";
		}else if(id==801 || id==802){
			icon = "fas fa-cloud-sun";
		}else if(id==803 || id==804){
			icon = "fas fa-cloud";
		}
//		alert(icon);
		return icon;
	}
	//	0	1	2	3	4	5		6	7	
	//	i	i	i	i	i	i		i	i	
	//	9	12	15	18	21	24(0)	3	6
	// 3시간 5일 
	function settime(tz){

		var now = new Date();
		var result;
		now = now.getUTCHours() + tz;
		if(now >= 0 && now < 3){
			result = 5;
		}else if(now >= 3 && now < 6){
			result = 6;
		}else if(now >= 6 && now < 9){
			result = 7;
		}else if(now >= 9 && now < 12){
			result = 0;
		}else if(now >= 12 && now < 15){
			result = 1;
		}else if(now >= 15 && now < 18){
			result = 2;
		}else if(now >= 18 && now < 21){
			result = 3;
		}else if(now >= 21 && now < 24){
			result = 4;
		}
		return result;
	}
	function suc(result){
					var timezone = result.city.timezone / 3600;
					var listindex= settime(timezone);
					console.log(result);
					$("#city").text(result.city.name);
					var icontxt = id2icon(result.list[listindex].weather[0].id);
					$("#icon").removeClass().addClass(icontxt);
					$("#info").text(result.list[listindex].weather[0].description);
					var temp = result.list[0].main.temp;
					temp = temp.toFixed(1);
					$(".temp").text(temp);
					var spped = result.list[listindex].wind.speed;
					spped =	spped.toFixed(1);
					$("#speed").text(spped);
					$("#hum").text(result.list[listindex].main.humidity);
					var deg = result.list[listindex].wind.deg;
					$("#dir").css("transform","rotate("+deg+"deg)");
					var max = result.list[listindex].main.temp_max;
					var min = result.list[listindex].main.temp_min;

					max = max.toFixed(1);
					min = min.toFixed(1);
					$("#max").text(max);
					$("#min").text(min);
					clen(this);
					for(i=0; i<5; i++){
						// 당시에 시간 : ftime 
						var ftime = new Date(result.list[i*8].dt*1000);
						var fmonth = ftime.getMonth() + 1;
						var fdate = ftime.getDate();
						$(".fdate").eq(i).text(fmonth +"/"+fdate);
						var code = result.list[i*8].weather[0].id;
						var icon = id2icon(code);
						$(".fc").eq(i).children("svg").removeClass().addClass(icon);
						var ftemp = result.list[i*8].main.temp;
						ftemp = ftemp.toFixed(1);
						$(".fc").eq(i).children(".ftemp").text(ftemp);

					}
					var sunset = result.city.sunset * 1000;
					sunset = new Date(sunset);
					var now = new Date();
					$("#top,#mid,#bot").css({
								backgroundColor:"transparent"
							});
					if(now < sunset){
						if(icontxt == "fas fa-sun"){
							$("section").css("background-image","url(images/day_clear.jpg)");

						}else if(icontxt == "fas fa-cloud" || icontxt == "fas fa-cloud-sun" ){
							$("section").css("background-image","url(images/day_crane.jpg)");

						}else {
							$("section").css({
								backgroundImage:"url(images/day_rain.jpg)",    
//								filter: "opacity(1)"
							});
//							$("#top,#mid,#bot").css({
//								backgroundColor:"rgba(0,0,0,0.5)",    
//							});
						}
					}else{
						$("section").css("background-image","url(images/2.jpg)");

					}

				}

	function upd(subject){
		var city = $(subject).attr("data");
		if(city != "custom"){
				// 도시명검색
			$.ajax({
				
				url: link,
				method : "GET",
				dataType: "json",
				data: {
					"q":city,
					"mode":"json",
					"appid":myid,
					"units":"metric"
				},
				success:suc
			});
//			alert("도시명 검색");
		}else{
			// 위도, 경도 검색
//			
		
			
			$.ajax({
				
				url: link,
				method : "GET",
				dataType: "json",
				data: {
					"lat":lat,
					"lon":lon,
					"mode":"json",
					"appid":myid,
					"units":"metric"
				},
				success:suc
			});
			//위도 경도 검색
//			alert("위도 경도 검색");
		}
		
	}
	
	
	
	$(".citybtn").click(function(){
		
		upd(this);
		
	});
	
	upd($(".citybtn:nth-of-type(2)"));
	
	
	
	
	
});