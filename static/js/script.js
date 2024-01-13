/*jshint jquery:true */
// global $:true

// capitalize function
Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

// check mobile function
window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

var $ = jQuery.noConflict();

$(document).ready(function($) {
	"use strict";

	/*-------------------------------------------------*/
	/* =  portfolio isotope
	/*-------------------------------------------------*/



	var winDow = $(window);
		// Needed variables
		var $container=$('.blog-box, .portfolio-box');

		try{
			$container.imagesLoaded( function(){
				$container.show();
				$container.isotope({
					layoutMode:'masonry',
					animationOptions:{
						duration:750,
						easing:'linear'
					}
				});
			});
		} catch(err) {
		}

		winDow.bind('resize', function(){

			try {
				$container.isotope({ 
					animationOptions: {
						duration: 750,
						easing	: 'linear',
						queue	: false,
					}
				});
			} catch(err) {
			}
			return false;
		});

	/*-------------------------------------------------*/
	/* =  preloader function
	/*-------------------------------------------------*/
	var body = $('body');
	body.addClass('active');

	winDow.load( function(){
		var mainDiv = $('#container'),
			preloader = $('.preloader');

			preloader.fadeOut(400, function(){
				mainDiv.delay(400).addClass('active');
			});
	});

	/*-------------------------------------------------*/
	/* =  flexslider
	/*-------------------------------------------------*/
	try {

		var SliderPost = $('.flexslider');

		SliderPost.flexslider({
			animation: "fade",
			slideshowSpeed: 4000,
		});
	} catch(err) {

	}

	/*-------------------------------------------------*/
	/* =  header height fix
	/*-------------------------------------------------*/
	var content = $('#content');
	content.imagesLoaded( function(){
		var bodyHeight = $(window).outerHeight(),
		containerHeight = $('.inner-content').outerHeight(),
		headerHeight = $('header');

		if( bodyHeight > containerHeight ) {
			headerHeight.css('height',bodyHeight);
		} else {
			headerHeight.css('height',containerHeight);	
		}
	});

	winDow.bind('resize', function(){
		var bodyHeight = $(window).outerHeight(),
		containerHeight = $('.inner-content').outerHeight(),
		headerHeight = $('header');

		if( bodyHeight > containerHeight ) {
			headerHeight.css('height',bodyHeight);
		} else {
			headerHeight.css('height',containerHeight);	
		}
	});

	/* ---------------------------------------------------------------------- */
	/*	nice scroll
	/* ---------------------------------------------------------------------- */

	try {
		var HTMLcontainer = $("html");
		HTMLcontainer.niceScroll();
	} catch(err) {

	}

	try {
		var post_description = $("p.post_description");
		post_description.niceScroll();
	} catch(err) {

	}


	/* ---------------------------------------------------------------------- */
	/*	project hover effects
	/* ---------------------------------------------------------------------- */

	try {
		var projectPost = $('.project-post ');
		projectPost.each( function() { $(this).hoverdir(); } );
	} catch(err) {

	}

	/* ---------------------------------------------------------------------- */
	/*	magnific-popup
	/* ---------------------------------------------------------------------- */

	try {
		// Example with multiple objects
		var ZoomImage = $('.zoom, .zoom-image');
		ZoomImage.magnificPopup({
			type: 'image'
		});
	} catch(err) {

	}

	/*-------------------------------------------------*/
	/* =  Testimonial
	/*-------------------------------------------------*/
	try{
		var testimUl = $('.testimonial ul');

		testimUl.quovolver({
			transitionSpeed:300,
			autoPlay:true
		});
	}catch(err){
	}

	/* ---------------------------------------------------------------------- */
	/*	Tabs
	/* ---------------------------------------------------------------------- */
	var clickTab = $('.tab-links li a');

	clickTab.on('click', function(e){
		e.preventDefault();

		var $this = $(this),
			hisIndex = $this.parent('li').index(),
			tabCont = $('.tab-content'),
			tabContIndex = $(".tab-content:eq(" + hisIndex + ")");

		if( !$this.hasClass('active')) {

			clickTab.removeClass('active');
			$this.addClass('active');

			tabCont.slideUp(400);
			tabCont.removeClass('active');
			tabContIndex.delay(400).slideDown(400);
			tabContIndex.addClass('active');
		}

	});

	/*-------------------------------------------------*/
	/* = skills animate
	/*-------------------------------------------------*/

	try {
		var animateElement = $(".meter > span");
		animateElement.each(function() {
			$(this)
				.data("origWidth", $(this).width())
				.width(0)
				.animate({
					width: $(this).data("origWidth")
				}, 1200);
		});
	} catch(err) {

	}

	/* ---------------------------------------------------------------------- */
	/*	menu responsive
	/* ---------------------------------------------------------------------- */

	const links = document.querySelectorAll('.menu-box .menu a')
	let current_page = document.location.href.split('/').slice(-1)[0];
	if (current_page === ''){current_page = 'home'}

	for (let i = 0; i<links.length; i++){
		if (links[i].innerHTML.toLowerCase() === current_page){
			links[i].classList.add('active')
		} else{
			links[i].classList.remove('active')
		}
	}


	var menuClick = $('a.elemadded'),
		navbarVertical = $('.menu-box');
		
	menuClick.on('click', function(e){
		e.preventDefault();

		if( navbarVertical.hasClass('active') ){
			navbarVertical.slideUp(300).removeClass('active');
		} else {
			navbarVertical.slideDown(300).addClass('active');
		}
	});

	winDow.bind('resize', function(){
		if ( winDow.width() > 768 ) {
			navbarVertical.slideDown(300).removeClass('active');
		} else {
			navbarVertical.slideUp(300).removeClass('active');
		}

	});

	if (winDow.width() < 500){
		const upload_btn = $('.post-box')
		const social_box = $('.social-box')
		const contact_box = $('.contact-box')

		const menu_box = $('.menu-box')

		upload_btn.appendTo(menu_box)
		social_box.appendTo(menu_box)
		contact_box.appendTo(menu_box)
	}

	/* ---------------------------------------------------------------------- */
	/*	post page main div image arrange
	/* ---------------------------------------------------------------------- */
	if (location.href.includes('postpage')) {
		var image_container = $('div.main-images.post-images')

		try{
			image_container.imagesLoaded( function(){
				image_container.show();
				image_container.isotope({
					layoutMode:'masonry',
					animationOptions:{
						duration:750,
						easing:'linear'
					}
				});
			});
		} catch(err) {
		}
		winDow.bind('resize', function(){

			try {
				image_container.isotope({
					animationOptions: {
						duration: 750,
						easing	: 'linear',
						queue	: false,
					}
				});
			} catch(err) {
			}
			return false;
		});
	}


	/* ---------------------------------------------------------------------- */
	/*	Load more post btn
	/* ---------------------------------------------------------------------- */

	// send request to load more posts
	const more_post_btn = document.querySelector('a.blog-page-link')
	if (more_post_btn) {
		more_post_btn.addEventListener('click', function () {
			const xhr = new XMLHttpRequest();
			const body = document.querySelectorAll('div.post').length;
			xhr.open("GET", "/homepage/loadmoreposts?posts=" + body.toString());

			// xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.onload = () => {
				if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 299) {
					if (xhr.status == 201) {
						var data = JSON.parse(xhr.responseText)
						let posts_added = []

						for (const [post_id, post] of Object.entries(data)) {


							const post_element = document.querySelector('.post').cloneNode(true)

							// Set main image
							post_element.querySelector('ul.slides img').setAttribute('src', Object.values(post['images'].location)[0])

							// Set post link and name
							const post_link = post_element.querySelector('.post-content h2 a')
							post_link.setAttribute('href', `/postpage/${post_id}`)
							post_link.innerHTML = Object.values(post['data'].name)[0]

							// Set post description
							const post_description = post_element.querySelector('.post-content>p')
							post_description.innerText = Object.values(post['data'].description)[0].replace("<br>", "")

							// Set post tags
							// delete all tags of the old post
							post_element.querySelectorAll('li.tag').forEach(tag => {
								tag.remove()
							})

							for (const [index, tag] of Object.entries(post['tags'].name)) {
								const new_tag = `<li class="tag"><a><i class="fa fa-flag" aria-hidden="true"></i><span class="tag_name">${tag}</span></a></li>`
								const post_tag_innerHtml = post_element.querySelector('.post-tags').innerHTML
								post_element.querySelector('.post-tags').innerHTML = new_tag + post_tag_innerHtml
							}

							// Set username
							post_element.querySelector('li.post_owner span').innerText = Object.values(post['data'].username)[0]

							// Set post likes
							post_element.querySelector('li.post_likes span').innerText = post['likes']

							// Set post upload time
							const days_ago = Object.values(post['data'].uploaded)[0]
							let uploaded_time_ago = ""
							if (days_ago === 0) {
								uploaded_time_ago = "uploaded today"
							} else if (days_ago < 7) {
								uploaded_time_ago = `uploaded ${days_ago} day(s) ago`
							} else if (days_ago < 365) {
								uploaded_time_ago = `uploaded ${parseInt(`${days_ago / 7}`)} week(s) ago`
							} else {
								uploaded_time_ago = `uploaded ${parseInt(`${days_ago / 365}`)} year(s) ago`
							}
							post_element.querySelector('li.post_days_ago span').innerText = uploaded_time_ago

							document.querySelector('div.blog-box').appendChild(post_element)
							posts_added.push(post_element)
						}
						$(posts_added).imagesLoaded(function () {
							$container.isotope('appended', $(posts_added))
						})

					} else {
						document.querySelector('.blog-page-link').innerText = "No more posts to show"
						document.querySelector('.blog-page-link').addEventListener('click', '')
					}
				} else {
					console.log(`Error: ${xhr.status}`);
					alert(xhr.responseText + ` (response code = ${xhr.status})`)
				}
			};
			xhr.send();
		})
	}

	/* ---------------------------------------------------------------------- */
	/*	Contact Form
	/* ---------------------------------------------------------------------- */

	var submitContact = $('#submit_contact'),
		message = $('#msg');

	submitContact.on('click', function(e){
		e.preventDefault();

		var $this = $(this);
		
		$.ajax({
			type: "POST",
			url: 'contact.php',
			dataType: 'json',
			cache: false,
			data: $('#contact-form').serialize(),
			success: function(data) {

				if(data.info !== 'error'){
					$this.parents('form').find('input[type=text],textarea,select').filter(':visible').val('');
					message.hide().removeClass('success').removeClass('error').addClass('success').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
				} else {
					message.hide().removeClass('success').removeClass('error').addClass('error').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
				}
			}
		});
	});

	/* ---------------------------------------------------------------------- */
	/*	load tags in new post form
	/* ---------------------------------------------------------------------- */

	if (document.querySelector('#newpostmodalbtn')) {
		const tags_div = document.querySelector('.new_post_tags')

		async function set_new_post_tags() {
			const tags = await fetch_tags()
			if (tags) {
				let tag_template = ""
				tags_div.innerHTML = ""
				for (let i = 0; i < tags.length; i++) {
					tag_template = `<input type="checkbox" id="${tags[i][0]}" name="tag_${tags[i][0]}">
						   <label for="${tags[i][0]}">${tags[i][0].capitalize()}</label><br>`
					tags_div.innerHTML += tag_template
				}
			} else {
				tags_div.innerHTML = `<h3>No tags found</h3>`
			}
		}
		set_new_post_tags()
	}

	// call load tags in header function to load the tags and periods filter in the side header
	async function load_header_filters() {
		await load_tags_in_header()
		await load_periods_in_header()
	}
	load_header_filters()

	// loads posts to the search modal
	load_posts_for_search()


	Dropzone.autoDiscover = false;

	$(function (){
		// configure new post dropzone
		var postUploadDz = new Dropzone('div#newPostDropzone', {
			paramName: "file",
			url: "/home/newpost",
			previewsContainer: "div.dropzone-previews",
			addRemoveLinks: true,
			autoProcessQueue: false,
			uploadMultiple: true,
			parallelUploads: 50,
			maxFiles: 50,
			init: function (){
				let myDropzone = this;

				// First change the button to actually tell Dropzone to process the queue.
				document.querySelector("#upload-btn").addEventListener("click", function(e) {
				  // Make sure that the form isn't actually being sent.
				  e.preventDefault();
				  e.stopPropagation();
				  if (new_post_validation()) {
					  if (myDropzone.getQueuedFiles().length === 0){
						  if(confirm('Please confirm you want to upload post without images')) {
							  var blob = new Blob();
							  blob.upload = {'chunked': myDropzone.options.chunking};
							  myDropzone.uploadFile(blob);
						  }
					  } else {
						  myDropzone.processQueue();
					  }
				  } else {
					  $(".modal-content").animate({ scrollTop: 0 }, "smooth");
				  }
				});

				this.on("sendingmultiple", function(file, xhr, form) {
					const post_name = document.getElementById('post_name').value
					const post_year = document.getElementById('post_year').value
					const post_description = document.getElementById('free_text').value
					const post_access = document.getElementById('access_type').value
					let post_tags = []
					// get tags
					const tag_checkboxes = document.querySelectorAll('#new-post-form input[type=checkbox]')

					for (let i = 0; i<tag_checkboxes.length; i++){
						if (tag_checkboxes[i].checked){
							post_tags.push(tag_checkboxes[i].id.toLowerCase())
						}
					}

					const body = JSON.stringify({
						"post_name": post_name,
						"post_description": post_description,
						"post_year": post_year,
						"post_access": post_access,
						"post_tags": post_tags
					});
					form.append("data", body);
				});

				this.on("successmultiple", function(files, response) {
			      document.location = '/'
			    });
			}
		})

		// configure add imgs to post dropzone
		var updatePostDz = new Dropzone('div#uploadNewPhotos', {
			paramName: "file",
			url: "/postpage/updatepost",
			previewsContainer: "div.dropzone-previews.added_images",
			addRemoveLinks: true,
			autoProcessQueue: false,
			uploadMultiple: true,
			parallelUploads: 50,
			maxFiles: 50,
			init: function (){
				let myDropzone = this;

				// First change the button to actually tell Dropzone to process the queue.
				document.querySelector("#update_post_btn").addEventListener("click", function(e) {
				  // Make sure that the form isn't actually being sent.
				  e.preventDefault();
				  e.stopPropagation();
				  if (myDropzone.getQueuedFiles().length === 0){
					  var blob = new Blob();
					  blob.upload = {'chunked': myDropzone.options.chunking};
					  myDropzone.uploadFile(blob);
				  } else {
					  myDropzone.processQueue();
				  }
				});

				this.on("sendingmultiple",process_new_post_data);

				this.on("successmultiple", function(files, response) {
			      location.reload()
			    });
			}
		})
	})
	function process_new_post_data(file, xhr, form) {
					const post_id = document.querySelector('.project-post-content').getAttribute('post')
					const new_name = document.querySelector('.single-box-content input.post_name_input').value
					const new_description = document.querySelector('.single-box-content textarea.post_description_input').value
					const new_access = document.querySelector('#new_access_type').value
					const new_year = document.querySelector('.single-box input.post_year_input').value
					let new_tags = []
					for (let i = 0; i < document.querySelectorAll('div.tags-box ul li:not(.not_selected) a').length; i++){
						new_tags.push(document.querySelectorAll('div.tags-box ul li:not(.not_selected) a')[i].innerText.toLowerCase())
					}
					let delete_images = []
					for (let i = 0; i < document.querySelectorAll('div.img-card.delete-img').length; i++){
						delete_images.push(document.querySelectorAll('div.img-card.delete-img img')[i].getAttribute('alt'))
					}
					let cover_images_src = []
					let cover_imgs = document.querySelectorAll('div.img-card.cover-img')
					for (let i = 0; i < cover_imgs.length; i++){
						cover_images_src.push(cover_imgs[i].querySelector('img').getAttribute('alt'))
					}
					const body = JSON.stringify({
						'name': new_name,
						'description': new_description,
						'year': new_year,
						'access': new_access,
						'images': delete_images,
						'cover_images': cover_images_src,
						'tags': new_tags,
						'post_id': post_id
					})

					form.append("data", body);
				}

});


/* ---------------------------------------------------------------------- */
/*	New post modal
/* ---------------------------------------------------------------------- */

// Get the modal
var new_post_modal = document.getElementById("newpostmodal");

// Get the button that opens the modal
var new_post_btn = document.getElementById("newpostmodalbtn");

// Get the <span> element that closes the modal
var new_post_close_span = document.querySelector("#newpostmodal .closemodal");

// When the user clicks on the button, open the new post modal
if (new_post_btn) {
	new_post_btn.addEventListener('click', () => {
		new_post_modal.style.display = "block";
		document.body.style.overflow = 'hidden';
		$('html').getNiceScroll().hide();
		$('#newpostmodal>div.modal-content').niceScroll()
	})

	// When the user clicks on <span> (x), close the modal
	new_post_close_span.addEventListener('click', () => {close_modal(new_post_modal)})

	// When user clicks upload post buttton
// 	document.getElementById('upload-btn').addEventListener('click', function () {
// 	if (new_post_validation()) {
// 		if (Dropzone.forElement('#new_post_dropzone').getQueuedFiles().length > 0) {
// 			Dropzone.forElement('#new_post_dropzone').on('completemultiple', () => {submit_new_post(true)})
// 			Dropzone.forElement('#new_post_dropzone').processQueue()
// 		} else {
// 			if (confirm("Do you want to upload a post with out images?")) {
// 				submit_new_post(false);
// 			}
// 		}
// 	} else {
// 		$(".modal-content").animate({ scrollTop: 0 }, "smooth");
// 	}
// })

}



/* ---------------------------------------------------------------------- */
/*	search modal
/* ---------------------------------------------------------------------- */

// Get the modal
var search_modal = document.getElementById("searchmodal");

// Get the button that opens the modal
var search_btn = document.getElementById("searchmodalbtn");

// Get the <span> element that closes the modal
var search_close_span = document.querySelector("#searchmodal .closemodal");

// Get search bar input
var search_input = document.querySelector('input#search_input')

// When the user clicks on the button, open the new post modal
if (search_btn) {
	search_btn.onclick = function () {
		search_modal.style.display = "block";
		document.body.style.overflow = 'hidden';
		$('html').getNiceScroll().hide();
		$('#searchmodal>div.modal-content').niceScroll()
	}
}

// Function to load all valid posts in the search modal
async function load_posts_for_search(){
	const container = $('div#searchmodal div.search_results')
	const searchPostsPromise = await fetch('/homepage/getpostsforsearch');
	const posts = await searchPostsPromise.json();
	let reasult_card = ""
	for (var index in posts){
		days_ago = posts[index].uploaded
		let uploaded_ago_str = ''
		if (days_ago === 0){
			uploaded_ago_str = "uploaded today"
		} else if (days_ago < 7){
			uploaded_ago_str = `uploaded ${days_ago} day(s) ago`
		} else if (days_ago < 365){
			uploaded_ago_str = `uploaded ${parseInt(days_ago/7)} week(s) ago`
		} else {
			uploaded_ago_str = `uploaded ${parseInt(days_ago/365)} year(s) ago`
		}
		reasult_card = `<div class="result_card">
              <h2 class="post_name"><a href="/postpage/${posts[index].post_id}">${posts[index].name}</a></h2>
              <h3 class="uploaded_ago"><a>
                <i class="fa fa-calendar"></i>
                    <span>
                    ${uploaded_ago_str}                      
                    </span>
                </a>
              </h3>
              <ul class="post-tags">
                    <li class="post_period"><a><i class="fa fa-clock-o"></i><span>${posts[index].period}</span></a></li>
                    <li class="post_owner"><a><i class="fa fa-user"></i><span>${posts[index].username}</span></a></li>
                    <li class="post_likes"><a><i class="fa fa-heart"></i><span>${posts[index].likes} likes</span></a></li>
                </ul>
          </div>`
		// reasult_card = $.parseHTML(reasult_card)[0]
		container.append(reasult_card)
	}
}


if (search_input){

	search_input.addEventListener('keyup', (event) => {
		const result_cards = [...document.querySelectorAll('.search_results .result_card')]
		const search_value = event.target.value

		const relavent_posts = result_cards.filter((post_card) => {
			let post_card_name = post_card.querySelector('.post_name a')
			let post_card_owner = post_card.querySelector('li.post_owner span')
			post_card_name.innerHTML = post_card_name.innerHTML.replace(`<span class="highlight">`, "").replace(`</span>`, "")
			post_card_owner.innerHTML = post_card_owner.innerHTML.replace(`<span class="highlight">`, "").replace(`</span>`, "")

			if (search_value === ""){
			result_cards.map((post) => {post.classList.remove('hidden')})
				return
			}
			result_cards.map((post) => {post.classList.add('hidden')})
			if (post_card_name.textContent.includes(search_value)){
				post_card_name.innerHTML = post_card_name.innerHTML.replace(search_value, `<span class="highlight">${search_value}</span>`)
				return true
			} else if (post_card_owner.textContent.includes(search_value)){
				post_card_owner.innerHTML = post_card_owner.innerHTML.replace(search_value, `<span class="highlight">${search_value}</span>`)
				return true
			} else {
				return false
			}
		})
		relavent_posts.map((post) => {post.classList.remove('hidden')})
	})

	// When the user clicks on <span> (x), close the modal
	search_close_span.addEventListener('click', () => {close_modal(search_modal)})

}

// function to execute when user wants to exit modal
function close_modal(modal){
	modal.style.display = "none";
	$('html').getNiceScroll().show();
}

// When the user clicks anywhere outside the modal, close it
window.onmouseup = function(event) {

  if (event.target === new_post_modal) {
	  close_modal(new_post_modal)
  } else if (event.target === search_modal){
	  close_modal(search_modal)
  }
}


// submit new post form
function  submit_new_post(with_images){
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "/home/newpost");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// get inputs
	const post_name = document.getElementById('post_name').value
	const post_year = document.getElementById('post_year').value
	const post_description = document.getElementById('free_text').value
	const post_access = document.getElementById('access_type').value
	let post_tags = []
	// get tags
	const tag_checkboxes = document.querySelectorAll('#new-post-form input[type=checkbox]')

	for (let i = 0; i<tag_checkboxes.length; i++){
		if (tag_checkboxes[i].checked){
			post_tags.push(tag_checkboxes[i].id.toLowerCase())
		}
	}

	const body = JSON.stringify({
		"post_name": post_name,
		"post_description": post_description,
		"post_year": post_year,
		"post_access": post_access,
		"post_tags": post_tags //variable to tell the server if the post is imageless
	});
	xhr.onload = () => {
	  if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 299) {
		alert(xhr.responseText)
		window.location = '/'
	  } else {
		console.log(`Error: ${xhr.status}`);
		alert(xhr.responseText + ` (response code = ${xhr.status})`)
	  }
	};
	xhr.send('data=' + body);
}

function showError(input, message){
    // add the error class
    input.classList.add('error');
	input.classList.remove('success');
    // show the error message
    const error = document.querySelector(`.container small.${input.getAttribute('id')}_err`);
	error.classList.remove('hidden')
	error.textContent = message;
}

function showSuccess(input) {
    // add the success class
    input.classList.remove('error');
	input.classList.add('success');


    // hide the error message
    const error = document.querySelector(`.container small.${input.getAttribute('name')}_err`);
	error.classList.add('hidden')
    error.textContent = '';
};

function new_post_validation() {
  // Get form elements
  var nameInput = document.getElementById('post_name');
  var postYearInput = document.getElementById('post_year');
  var postDescriptionInput = document.getElementById('free_text');
  var valid = true;

  // Validation checks for name
  var name = nameInput.value;
  if (name.trim() === '') {
    showError(nameInput, 'Please enter post name.');
	valid = false
  } else {
	  // Check if name contains restricted characters
	  var restrictedChars = /[\(\)'\/*;.\[\]{}\\`]/;
	  if (restrictedChars.test(name)) {
		showError(nameInput, 'Name cannot contain characters such as (), \', /, ;, ., \\, [], {}, `.');
		valid = false
	  } else {
		  showSuccess(nameInput)
	  }
  }



  // Validation check for post_year
  var postYear = parseInt(postYearInput.value, 10);
  if (isNaN(postYear) || postYear < 2000 || postYear > 2023) {
    showError(postYearInput, 'Please enter a valid year between 2000 and 2023.');
    valid = false
  } else {
	  showSuccess(postYearInput)
  }

  // Validation check for post_description length
  var postDescription = postDescriptionInput.value;
  if (/['\/;.\[\]{}\\`]/.test(postDescription)){
	      showError(postDescriptionInput, 'Post description cannot contain characters such as \', /, ;, ., \\, [], {}, `.');
  } else if (postDescription.length > 3000) {
    showError(postDescriptionInput, 'Post description must be below 3000 characters.');
    valid = false
  } else {
	  showSuccess(postDescriptionInput)
  }


  // If all validations pass, the form is considered valid
  return valid;
}

// Function used in post page, makes the clicked photo appear big in the center of the screen
function showinbig(img){
	let showinbig = document.querySelector('.showinbig-div')
	showinbig.classList.remove('hidden')
	showinbig.querySelector('img').setAttribute('src', img.getAttribute('src'))
}

// like/dislike function - add or remove like from a post
function toggle_like(current_post_id, element){

	const xhr = new XMLHttpRequest();
	xhr.open("POST", "/postpage/addremovelike");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	const body = JSON.stringify({
		"post_id": current_post_id
	});
	xhr.onload = () => {
	  if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 299) {
		  if (xhr.status == 201){
			  element.querySelector('.like_number').innerText = parseInt(element.querySelector('.like_number').innerText) + 1
			  element.querySelector('i').style.color = "red"
		  } else{
			  element.querySelector('.like_number').innerText = parseInt(element.querySelector('.like_number').innerText) - 1
			  element.querySelector('i').style.color = "inherit"
		  }
		  // element.querySelector('i').style= "color=red"
		// toggle_like_fa(element.querySelector('.like_icon'));
	  } else {
		console.log(`Error: ${xhr.status}`);
		alert(xhr.responseText + ` (response code = ${xhr.status})`)
	  }
	};
	xhr.send('data=' + body);
}

// Changes the Color of the like button
function toggle_like_fa(span){
	span.classList.toggle('invert_color_span')
	span.querySelector('i').classList.toggle('invert_color_fa')
}

function delete_post(post_id){
	if (confirm('Are you sure you want to delete the post?')){
		if (confirm("Please be alert that the post is about to be deleted")){
			const xhr = new XMLHttpRequest();
			xhr.open("POST", "/postpage/deletepost");
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			const body = "post_id=" + post_id
			xhr.onload = () => {
				if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 299) {
					alert('Post deleted successfully')
					window.location = '/'
				} else {
					console.log("request status: " + xhr.status)
					alert(xhr.responseText)
				}
			};
			xhr.send(body)

		}
	}
}



/* ---------------------------------------------------------------------- */
/*	Post edit functions (used in postpage for editing your)
/* ---------------------------------------------------------------------- */

function edit_post(post_id){
	if (!confirm('Enter edit mode?')){
		return
	}

	document.querySelector('.single-box-content').style = 'border: 7px solid blue'
	document.querySelector('.edit_post').innerText = "exit edit mode"
	document.querySelector('.edit_post').setAttribute('onclick', 'exit_edit_mode()')
	document.querySelector('.access_type_label').classList.remove('hidden')
	document.querySelector('.access_type').classList.remove('hidden')



	// set cover image change and delete image feature
	const post_imgs = document.querySelectorAll('div.main-images div.img-card')
	let cover_imgs = Array.from(document.querySelectorAll('div.main-images div.cover-img'))
	for (let i = 0; i < post_imgs.length; i++){
		let make_cover_btn = post_imgs[i].querySelector('.make_cover')
		let delete_image_btn = post_imgs[i].querySelector('.delete_img')

		make_cover_btn.parentElement.classList.remove('hidden')

		make_cover_btn.addEventListener('click', function (event){
			const img_card = event.target.closest('.img-card')
			if (img_card.classList.contains('cover-img')){
				img_card.classList.remove('cover-img')

			} else {
				img_card.classList.add('cover-img')
				if (cover_imgs.length === 3) {
					let removed_from_cover = cover_imgs.pop()
					removed_from_cover.classList.remove('cover-img')
				}
			}
			cover_imgs = Array.from(document.querySelectorAll('div.main-images div.cover-img'))
		})
		delete_image_btn.addEventListener('click', function (event){
			const img_card = event.target.closest('.img-card')
			if (img_card.classList.contains('delete-img')){
				img_card.classList.remove('delete-img')
			} else {
				img_card.classList.add('delete-img')
			}
		})
	}
	document.querySelector('.select-images-info').classList.remove('hidden')


	// make post name an input to allow user to change it
	const post_name = document.querySelector('.project-text .post_name')
	const post_description = document.querySelector('.post_description')

	const post_name_input = document.createElement('input')
	post_name_input.setAttribute('type', 'text')
	post_name_input.setAttribute('dir', 'auto')
	post_name_input.setAttribute('class', 'post_name_input')
	post_name_input.setAttribute('value', post_name.innerText)

	const post_description_input = document.createElement('textarea')
	post_description_input.setAttribute('style', 'resize: vertical;')
	post_description_input.setAttribute('maxlength', '3000')
	post_description_input.setAttribute('class', 'post_description_input')
	post_description_input.setAttribute('dir', 'auto')
	post_description_input.innerHTML = post_description.innerText


	post_name.parentNode.replaceChild(post_name_input, post_name)
	post_description.parentNode.replaceChild(post_description_input, post_description)

	// make post year an input
	const post_year = document.querySelector('div.post-info span.post_year')
	const post_year_input = $.parseHTML(`<input type='number' min="2000" max="2023" class='post_year_input' value='${post_year.innerHTML}'/>`)[0]
	document.querySelector('div.post-info li.post_year a').replaceChild(post_year_input, post_year)
	document.querySelector('label.change-year-info').classList.remove('hidden')

	// show all tags available
	document.querySelector('.select-tags-info').classList.remove('hidden')
	set_postpage_tags()

	// show update post button
	document.querySelector('.update_post_div').classList.remove('hidden')

	// show new images upload dropzone
	$('#uploadNewPhotos').niceScroll()
}

// load all tags to the post page when user clicks edit mode
	async function set_postpage_tags(){
		const tag_lookup = await fetch_tags()
		let previous_child= ''
		let new_child = ''
		for (let i = 0; i<tag_lookup.length; i++){
			if (!document.querySelector(`li.${tag_lookup[i][0]}_tag`)){
				new_child = $.parseHTML(`<li class="${tag_lookup[i][0]}_tag not_selected"><a>${tag_lookup[i][0].capitalize()}</a></li>`)[0]
				if (!previous_child){
					document.querySelector('div.tags-box ul').prepend(new_child)
				} else {
					previous_child.after(new_child)
				}
				previous_child = new_child
			} else {
				previous_child = document.querySelector(`li.${tag_lookup[i][0]}_tag`)
			}
		}
		const all_tags = document.querySelectorAll('div.tags-box ul li')
		for (let i = 0; i<all_tags.length ; i++){
			all_tags[i].addEventListener('click', () => {all_tags[i].classList.toggle('not_selected')})
		}
	}

// function to be used when user wants to exit edit mode without saving
function exit_edit_mode(){
	if (confirm('Do you want to exit edit mode? any changes made to the post will not be saved')){
		location.reload()
	}
}





// ****************************************************
// *  Log in page
// ****************************************************

// log in form validation

let login_button = document.getElementById('login-btn')
	if (login_button) {
		login_button.addEventListener('click', function () {
			if (validate_login_Form()) {
				document.getElementById('login-form').submit()
			}
		})
	}
function validate_login_Form() {
	const name_input = document.getElementById('username')
	const password_input = document.getElementById('login_password')
	const regExp = /\s|[,;\/.\\\]\[{}()\-=+#*`]/;
	let valid = true;

	// Username validation
  if (regExp.test(name_input.value)) {
	  showError(name_input, `Username cannot have whitespace or the following characters: ${regExp}.`);
	  valid = false
  } else if (name_input.value === "") {
	  showError(name_input, `Username cannot be blank`);
	  valid = false
  } else {
		  showSuccess(name_input)
  }

  // Password validation
  if (regExp.test(password_input.value)) {
	  showError(password_input, `Password cannot have whitespace or the following characters: ${regExp}.`);
	  valid = false;
  } else if (password_input.value === "") {
	  showError(password_input, `Password cannot be blank`);
	  valid = false
  } else {
		  showSuccess(name_input)
  }

  return valid
}


// sign up form validation
function validate_signup_Form() {
	const name_input = document.getElementById('uname')
	const password_input = document.getElementById('psw')
	const email_input = document.getElementById('email')
	const approximation_input = document.getElementById('approximation_more_info')
	const regExp = /\s|[,;\/.\\\]\[{}()\-=+#*`]/;
	var valid = true;

  // Username validation
  if (regExp.test(name_input.value)) {
      showError(name_input, `Username cannot have whitespace or the following characters: ${regExp}.`);
    valid = false
  } else {
	  showSuccess(name_input)
  }

  // Password validation
  if (password_input.value.length < 8) {
    showError(password_input, "Password must be at least 8 characters long.");
    valid = false;
  } else if (regExp.test(password_input.value)) {
   showError(password_input, `Password cannot have whitespace or the following characters: ${regExp}.`);
   valid = false;
  } else {
	showSuccess(password_input)
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email_input.value)) {
    showError(email_input, "Invalid email format.");
    valid = false;
  } else {
	  showSuccess(email_input)
  }

  if (!approximation_input.classList.contains('hidden')) {
	  // Other input validation
	  if (/[,;\/.\\\]\[{}()\-=+#*`]/.test(approximation_input.value)) {
		  showError(approximation_input, `This field cannot have the following characters: ${/|[,;\/.\\\]\[{}()\-=+#*`]/}.`);
		  valid = false;
	  } else {
		  showSuccess(approximation_input)
	  }
  }

  return valid
}


// Function used in sign in form
// when approximation field is changed check if approximation_info input needs to be shown
function approximation_change(select_element){
	const approximation_selected = select_element.value;
	const more_info_input = document.querySelector('#approximation_more_info')
	const more_info_label = document.querySelector('#approximation_more_info_label')

	// Make requierd
	more_info_input.setAttribute('required', '')

	// Clear input value
	more_info_input.value = ''

	if (approximation_selected === 'Army'){
		more_info_input.classList.remove('hidden')
		more_info_label.classList.remove('hidden')
		more_info_label.querySelector('b').innerText = 'From where in the army?'
	} else if (approximation_selected === 'Work'){
		more_info_input.classList.remove('hidden')
		more_info_label.classList.remove('hidden')
		more_info_label.querySelector('b').innerText = 'From which work place?'
	} else if (approximation_selected === 'Trips'){
		more_info_input.classList.remove('hidden')
		more_info_label.classList.remove('hidden')
		more_info_label.querySelector('b').innerText = 'From where in the trip?'
	} else if (approximation_selected === 'Other'){
		more_info_input.classList.remove('hidden')
		more_info_label.classList.remove('hidden')
		more_info_label.querySelector('b').innerText = 'Let us know how you know Ilay'
	} else {
		more_info_input.classList.add('hidden')
		more_info_label.classList.add('hidden')
		more_info_input.removeAttribute('required')
	}
}

// *---------------------------------
// * Header function
// *---------------------------------

// pull tags option from tag-lookup table
async function fetch_tags() {
  try {
    const response = await fetch(
      "/homepage/gettags",
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data
  } catch (error) {
    console.error(`Could not get tags: ${error}`);
	setTimeout(() => {
		return fetch_tags()
	}, 5000)
  }
}

// Function used when clicking a tag, shows only the post with that specific tag
// pressing again on an activated tag disables it and shows all posts
function tag_press(tag){
	const all_posts = document.querySelectorAll('.blog-box > .post');
	const tag_name = tag.innerText.toLowerCase();

	// Show all posts
	for (i = 0; i < all_posts.length; ++i) {
			all_posts[i].classList.remove('hidden')
	}

	// If an active tag filter has been pressed -> remove filter
	if (tag.querySelector('i').classList.contains('fa-arrow-circle-right')){
		tag.querySelector('i').classList.remove('fa-arrow-circle-right')

	// Otherwise -> change filter to the pressed one
	} else {
		// Remove active marker from the previous filter btn
		const tags_btn = document.querySelectorAll('ul.categories i.fa')
		for (i = 0; i < tags_btn.length; i++){
		tags_btn[i].classList.remove('fa-arrow-circle-right')
		}

		// Hide irelevant posts
		for (i = 0; i < all_posts.length; ++i) {
			if (!get_tags(all_posts[i]).includes(tag_name)) {
				all_posts[i].classList.add('hidden')
			}
		}
		tag.querySelector('i').classList.add('fa-arrow-circle-right')
	}
	let winDow = $(window)
	winDow.resize()
}

//returns all tags of a post
function get_tags(post){
	let tags = [];
	var all_tags = post.querySelectorAll('.tag_name')
	for (j = 0; j < all_tags.length ; ++j ){
		tags.push(all_tags[j].innerText.toLowerCase())
	}
	return tags
}

// Load tags on sidebar for filter options
// this function is called on the document onload function above
function load_tags_in_header(){
	const tagsPromise = fetch_tags()
	const tag_box = document.querySelector('.categories-box ul.categories')
	let tag_tamplate = ""
	tagsPromise.then((tags) => {
		for (let i = 0; i < tags.length ; i++){
			tag_box.innerHTML += `<li><a onclick="tag_press(this)"><i class="fa" aria-hidden="true"></i>${tags[i][0].capitalize()}</a></li>`
		}
	})
}

// Load periods on sidebar for filter options
// this function is called on the document onload function above
function load_periods_in_header(){
	const periodsPromise = fetch_periods()
	const period_box = document.querySelector('.periods-box ul.periods')
	let period_tamplate = ""
	periodsPromise.then((periods) => {
		for (let i = 0; i < periods.length ; i++){
			period_box.innerHTML += `<li><a onclick="period_press(this)"><i class="fa" aria-hidden="true"></i>${periods[i][0].capitalize()}</a></li>`
		}
	})
}

// pull periods option from period-lookup table
async function fetch_periods() {
  try {
    const response = await fetch(
      "/homepage/getperiods",
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data
  } catch (error) {
    console.error(`Could not get periods: ${error}, retry in 5s`);
    setTimeout(() => {
		return fetch_periods()
	}, 5000)

  }
}

// Function used when clicking a period, shows only the post with that specific period
// pressing again on an activated period disables it and shows all posts
function period_press(period){
	const all_posts = document.querySelectorAll('.blog-box > .post');
	const period_name = period.innerText.toLowerCase();

	// Show all posts
	for (i = 0; i < all_posts.length; ++i) {
			all_posts[i].classList.remove('hidden')
	}

	// If an active period filter has been pressed -> remove filter
	if (period.querySelector('i').classList.contains('fa-arrow-circle-right')){
		period.querySelector('i').classList.remove('fa-arrow-circle-right')

	// Otherwise -> change filter to the pressed one
	} else {
		// Remove active marker from the previous filter btn
		const periods_btn = document.querySelectorAll('ul.periods i.fa')
		for (i = 0; i < periods_btn.length; i++){
		periods_btn[i].classList.remove('fa-arrow-circle-right')
		}

		// Hide irelevant posts
		for (i = 0; i < all_posts.length; ++i) {
			if (all_posts[i].getAttribute('lifeperiod') !== period_name) {
				all_posts[i].classList.add('hidden')
			}
		}
		period.querySelector('i').classList.add('fa-arrow-circle-right')
	}
	let winDow = $(window)
	winDow.resize()
}