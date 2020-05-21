jQuery(function($) {

	//Preloader
	var preloader = $('.preloader');
	$(window).load(function(){
		preloader.remove();
	});

	//#main-slider
	var slideHeight = $(window).height();
	$('#home-slider .item').css('height',slideHeight);

	$(window).resize(function(){'use strict',
		$('#home-slider .item').css('height',slideHeight);
	});
	
	//Scroll Menu
	$(window).on('scroll', function(){
		if( $(window).scrollTop()>slideHeight ){
			$('.main-nav').addClass('navbar-fixed-top');
		} else {
			$('.main-nav').removeClass('navbar-fixed-top');
		}
	});
	
	// Navigation Scroll
	$(window).scroll(function(event) {
		Scroll();
	});

	$('li.scroll a, a[data-scroll]').on('click', function(e) {  
		var off = $($(this).attr("href")).offset().top - $(".main-nav").outerHeight();
		if(!$(".navbar-fixed-top").length) off -= 25;
		$('html, body').animate({scrollTop: off}, 1000);
		return false;
	});

	// User define function
	function Scroll() {
		var contentTop      =   [];
		var contentBottom   =   [];
		var winTop      =   $(window).scrollTop();
		var rangeTop    =   200;
		var rangeBottom =   500;
		$('.navbar-collapse').find('.scroll a').each(function(){
			contentTop.push( $( $(this).attr('href') ).offset().top);
			contentBottom.push( $( $(this).attr('href') ).offset().top + $( $(this).attr('href') ).height() );
		})
		$.each( contentTop, function(i){
			if ( winTop > contentTop[i] - rangeTop ){
				$('.navbar-collapse li.scroll')
				.removeClass('active')
				.eq(i).addClass('active');			
			}
		})
	};

	$('#tohash').on('click', function(){
		$('html, body').animate({scrollTop: $(this.hash).offset().top - 5}, 1000);
		return false;
	});
	
	//Initiat WOW JS
	new WOW().init();
	//smoothScroll
	smoothScroll.init();
	
	// Progress Bar
	$('.progressbars').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
		if (visible) {
			$.each($('div.progress-bar'),function(){
				$(this).css('width', $(this).attr('aria-valuetransitiongoal')+'%');
			});
			$(this).unbind('inview');
		}
	});

	// Contact form
	var form = $('#main-contact-form');
	form.submit(function(event) {
		event.preventDefault();
		$("#formSubmit").attr("disabled", "disabled");
		
		var sendData = {};
		$("input, textarea", this).each(function() {
			var label = $(this).attr("name");
			sendData[label] = $(this).val();
		});

		var form_status = $('<div class="form_status"></div>');
		$.ajax({
			url: $(this).attr('action'),
			method: $(this).attr("method"),
			data: sendData,
			beforeSend: function(){
				form.prepend( form_status.html('<p><i class="fa fa-spinner fa-spin"></i> '+getTranslation("sending")+'</p>').fadeIn() );
			}
		}).done(function(data){
			if(data == "1") {
				form_status.html('<p class="text-success">'+getTranslation("success")+'</p>');
			} else {
				form_status.html('<p class="text-error">'+getTranslation("error")+'</p>').delay(5000).fadeOut();
				$("#formSubmit").removeAttr("disabled");
			}
		});
	});
	
	// Call-To-Action
	setTimeout(function() {
		$("#callbar").show();
	}, 2*1000);

	//Google Map
	if($("#google-map").length) {
		var latitude = $('#google-map').data('latitude')
		var longitude = $('#google-map').data('longitude')
		function initialize_map() {
			var myLatlng = new google.maps.LatLng(latitude,longitude);
			var mapOptions = {
				zoom: 14,
				scrollwheel: false,
				center: myLatlng
			};
			var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
			var contentString = '';
			var infowindow = new google.maps.InfoWindow({
				content: '<div class="map-content"><ul class="address">' + $('.address').html() + '</ul></div>'
			});
			var marker = new google.maps.Marker({
				position: myLatlng,
				map: map
			});
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map,marker);
			});
		}
		google.maps.event.addDomListener(window, 'load', initialize_map);
	}
});

function getTranslation(id) {
	return $("#translation ."+id).html();
}

