/*
Author: Jonathan Cutrell and Taylor Jones
*/
(function($, window, undefined){

	var wb = {}, // declare wb namespace
		windowHeight, windowWidth,contentHeight, contentWidth, topOffset, activeSlide, nextSlidePosition = 0, // declare numeric variables
		//other variables?
		gridSpeed = 400;

	wb.hideThings = function() {
		$("#grid-wrap, #main-nav, #about-top #slide-down").hide(); // hide lots of things
		$(".curtain").css('opacity',0);
	};

	wb.getWindowSize = function() {
		windowHeight = $(window).height();
		windowWidth = $(window).width();
	};

	wb.setArticleSize = function() {
		if (windowHeight > 720) {
			$("article.main").css({
				'height' : windowHeight
			});
		} else {
			$("article.main").css({
				'height' : '719px'
			});
		}
		if (windowWidth > 1023) {
			$("article.main").css({
				'width' : windowWidth
			});
		} else {
			$("article.main").css({
				'width' : '1024px'
			});
		}
	};

	wb.spaceContent = function () {
		$("#home-loader").each(function(i,el){
			var contentHeight = $(this).outerHeight();
			$(this).css({
				'margin-top' : ((windowHeight - contentHeight) / 2)
			});
		});
		$(".grid-box").css({
		 	'padding-left' : (windowWidth - (238 * Math.floor((windowWidth-80)/238)))/2
		});
	};

	// grid interactions
	wb.showGrid = function() {
		$(".content").fadeOut(gridSpeed * 0.5);
		$("#grid-wrap").fadeIn(gridSpeed);

	};

	wb.hideGrid = function(){
		$(".content").fadeIn(gridSpeed * 0.5);
		$("#grid-wrap").fadeOut(gridSpeed);
		$("article .curtain").stop().animate({opacity:0},gridSpeed);

	};

	// removes url(); from CSS background image URLs
	wb.exactURL = function(input){
		return input.replace(/"/g,"").replace(/url\(|\)$/ig, "");
	};

	wb.panels = function(panelContainer) {
		var thePanel = $(panelContainer + " .item-content .panel");
		thePanel.css({ height : windowHeight, width : windowWidth });
		$(panelContainer + " .item-content").each(function(i,el){
			// panelCount, panelContentHeight, activePanel
			var $el = $(el);
			$el.find('.panel-content').each(function(i2,el2){
				var panelContentHeight = $(el2).outerHeight();
				$(el2).css('margin-top', (windowHeight - panelContentHeight)/2);
			});
			var pretext = '<div class="prev-panel"></div><div class="next-panel"></div>';
			var aptext = '<div class="close-panel-wrap"><div class="close-panel hide-content">Close Case Study</div></div>';
			$el.prepend(pretext).append(aptext);
			var panelCount = $el.find('.panel').length;
			$el.children('.panel-slider').width(windowWidth * panelCount);
			var activePanel = 0; // to set the active slide to the first slide on load
			// advances slider to previous panel 
			$(".prev-panel").on("click",function(e){
				// if slider isn't on first slide, slide to the previous slide
				if (activePanel !== 0) {
					activePanel--;
					$(e.target).siblings('.panel-slider').stop().animate({"margin-left" : (windowWidth*-1*activePanel)},1000);

				} else {
					// if it is the first slide, return to the last slide
					activePanel = (panelCount - 1);
					$(e.target).siblings('.panel-slider').stop().animate({"margin-left" : ((panelCount -1) * windowWidth * -1)},1000);
				}
			});
			// advances slider to next slide
			$(".next-panel").on("click",function(e){
				// check to see if active slide is not the last slide
				if (activePanel < panelCount - 1) {
					// if it is the last slide, return to the first slide
					activePanel++;
					$(e.target).siblings('.panel-slider').stop().animate({"margin-left" : (windowWidth*-1*activePanel)},1000);
				} else {
					// otherwise, advance to the next slide by increasing the left margin by one times the slide width
					$(e.target).siblings('.panel-slider').stop().animate({"margin-left" : "0px"},1000);
					activePanel = 0;
				}
			});
		});
		$(".prev-panel, .next-panel").css("top", (windowHeight - 73) / 2);
		$(".hide-content").on("click",function(e){
			$(e.target).parents('article.main').find('.curtain').stop().animate({opacity:0},500);
			$(e.target).parents('article.main').find('.content').fadeIn();
		});
	};

	// scrolls to next proejct slide
	wb.nextProject = function(nextProject, nextProjectTop){
		topOffset = $(window).scrollTop();
		activeSlide = topOffset/windowHeight;
		activeSlide = Math.floor(activeSlide);
		nextProject = $("article.main:eq(" + (activeSlide+1) + ")");
		nextProjectTop = $(nextProject).offset().top;
		$('html,body').stop().animate({scrollTop: nextProjectTop}, 350);
	};

	// scrolls to previous proejct slide
	wb.prevProject = function(prevProject, prevProjectTop){
		topOffset = $(window).scrollTop();
		activeSlide = topOffset/windowHeight;
		activeSlide = Math.floor(activeSlide);
		prevProject = $("article.main:eq(" + (activeSlide-1) + ")");
		prevProjectTop = $(prevProject).offset().top;
		$('html,body').stop().animate({scrollTop: prevProjectTop}, 350);
	};

	wb.sizeContent = function(){
		var elHeight = $("#about-top .large").outerHeight();
		var contactHeight = $(".contact .contact-us").outerHeight();
		$("#about-top, .contact").css({
			'height' : windowHeight + "px"
		});
		$("#about-top .full-wrap").css({
			'padding-top' : ((windowHeight - elHeight) / 2)
		});
		$(".contact .dots").css({
			'padding-top' : ((windowHeight - contactHeight) / 2)
		});
		$(".panel").css({
			width : windowWidth
		})
	};

$(document).ready(function(){

	$("#main-nav div.nav-item").on("click", function(e){
		var targetElement = $(e.target).attr('data-target'),
		targetElementOffset = $(targetElement).offset(),
		targetHeight = targetElementOffset.top - 58,
		windowOffsetTop = $(window).scrollTop(),
		scrollSpeed = Math.abs(windowOffsetTop - targetHeight) / 5;
		$('html,body').stop().animate({scrollTop: targetHeight}, scrollSpeed, "linear");
	});


	$("div#slide-up").on("click", function(){
		$("article.current").stop().animate({
			'top' : ((-windowHeight) - 100)
		},300);
	});

	$(".activate-case-study").on("click",function(e){
		var parentArticle = $(e.target).parents('article'),
			parentArticleID = $(parentArticle).attr('id');
		wb.panels("#" + parentArticleID);
		var parentArticleTop = parentArticle.offset().top;
		$('html,body').stop().animate({scrollTop: parentArticleTop}, 500);
		var item = $(e.target);
		$(".panel-slider").css('margin-left',0); // to reset case study sliders to first panel
		// close everything out that may be open
		$("article .content").fadeIn(500);
		$("article .curtain").stop().animate({opacity:0},250);
		item.parents('.content').fadeOut();
		item.parents('article').find('.curtain').animate({opacity:1},500);
	});

	var gridState = "";
	$("#grid-btn").on("click", function(e){
		e.preventDefault();
		if ($(e.target).hasClass('active')){
			$(e.target).removeClass('active');
			wb.hideGrid();
		} else {
			$(e.target).addClass('active');
			wb.showGrid();
		}
	});

	$("article.main.project").each(function(i,el){
		$(el).append('<div class="dots"></div>');
		var articleImage = wb.exactURL($(el).css('background-image')),
			articleTitle = $(el).attr('title'),
			articleID = $(el).attr('id');
			articleImage = articleImage.replace('.jpg','');
		$(".grid-box").append('<a class="grid-item" data-article-id="' + articleID + '"><img src="' + articleImage + '-thumb.jpg"><div class="article-title">' + articleTitle + '</div></a>');
	});

	$(".grid-box").on("click", function(e){
		e.preventDefault();
		$("#grid-btn").removeClass('active');
		if ($(e.target).is("a")){
			var scrollPos = $("#" + $(e.target).data('article-id')).offset().top;
		} else if ($(e.target).closest("a").data("article-id") != ""){
			var scrollPos = $("#" + $(e.target).closest("a").data('article-id')).offset().top;
		}
		// $.scrollTo("#" + $(e.target).attr('data-article-id'), 2000, {axis:'y',easing:'swing'});
		if (scrollPos !== undefined){
			$("html,body").stop().animate({
				scrollTop : scrollPos
			});
		}
		wb.hideGrid();
	});

	$("a#close-grid").on("click", function(e){
		e.preventDefault();
		$("#grid-btn").removeClass('active');
		wb.hideGrid();
	});

	$("#slide-nav #slide-down").on("click", function(e){
		e.preventDefault();
		wb.nextProject();
	});

	$("#slide-up").on("click", function(e){
		e.preventDefault();
		wb.prevProject();
	});

	wb.hideThings();
	wb.getWindowSize();
	wb.setArticleSize();
	wb.sizeContent();
	wb.spaceContent();

	// load twitter on homepage
	$(".tweet-text").getTweet({
		'username' : 'thebeehivehouse'
	});

	$(".content .box").each(function(i,el){
		$(el).imagesLoaded(function(){
			var contentHeight = $(el).outerHeight();
			$(this).css({
				'margin-top' : ((windowHeight - contentHeight) / 2)
			});
		});
	});

	$("#about-top #slide-down").delay(1000).fadeIn(350);

	$("#about-top #slide-down").on("click", function(e){
		var directiveScrollTop = $("#directive").offset().top;
		e.preventDefault();
		$('html,body').stop().animate({scrollTop: directiveScrollTop - 60}, 350);
	});

});

$(window).on("resize", function(){
	wb.getWindowSize();
	wb.setArticleSize();
	wb.sizeContent();
	wb.spaceContent();
});


$(window).on("scroll", function(){
	var windowScroll = $(window).scrollTop();
	if (windowScroll > (windowHeight - 100)) {
		$("nav#main-nav").fadeIn(500);
	} else {
		$("nav#main-nav").fadeOut(500);
	}
});


})(jQuery, window);
