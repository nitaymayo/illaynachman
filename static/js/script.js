/*jshint jquery:true */
/*global $:true */

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
	/*	Contact Map
	/* ---------------------------------------------------------------------- */
	var contact = {"lat":"51.51152", "lon":"-0.104198"}; //Change a map coordinate here!

	try {
		var mapContainer = $('#map');
		mapContainer.gmap3({
			action: 'addMarker',
			latLng: [contact.lat, contact.lon],
			map:{
				center: [contact.lat, contact.lon],
				zoom: 14
				},
			},
			{action: 'setOptions', args:[{scrollwheel:true}]}
		);
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

});

/* ---------------------------------------------------------------------- */
/*	New post modal
/* ---------------------------------------------------------------------- */

// Get the modal
var modal = document.getElementById("newpostmodal");

// Get the button that opens the modal
var btn = document.getElementById("newpostmodalbtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("closemodal")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
  document.body.style.overflow = 'hidden';

  document.getElementById('upload-btn').addEventListener('click', function () {
	  if (new_post_validation()) {
		  if (Dropzone.forElement('#new_post_dropzone').getQueuedFiles().length > 0) {
			  Dropzone.forElement('#new_post_dropzone').on('queuecomplete', function (file) {
				  document.getElementById('new-post-form').submit()
			  })
			  Dropzone.forElement('#new_post_dropzone').processQueue()
		  } else {
			  if (confirm("Do you want to upload a post with out images?")) {
				  document.getElementById('new-post-form').submit()
			  }
		  }
	  }
	})
}



// Check upload form validation


function showError(input, message){
    // add the error class
    input.classList.add('error');
	input.classList.remove('success');
    // show the error message
    const error = document.querySelector(`.container small.${input.getAttribute('id')}_err`);
	error.classList.remove('hidden')
    error.textContent = message;
}

const showSuccess = (input) => {
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
    showError(nameInput, 'Please enter your name.');
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
  if (postDescription.length > 3000) {
    showError(postDescriptionInput, 'Post description must be below 3000 characters.');
    valid = false
  } else {
	  showSuccess(postDescriptionInput)
  }


  // If all validations pass, the form is considered valid
  return valid;
}


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  document.body.style.overflow = 'auto';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Function used in post page, makes the clicked photo appear big in the center of the screen
function showinbig(img){
	let showinbig = document.querySelector('.showinbig-div')
	showinbig.classList.remove('hidden')
	showinbig.querySelector('img').setAttribute('src', img.getAttribute('src'))
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
		tags.push(all_tags[j].innerText)
	}
	return tags
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
			  document.querySelector('.like_number').innerText = parseInt(document.querySelector('.like_number').innerText) + 1
		  } else{
			  document.querySelector('.like_number').innerText = parseInt(document.querySelector('.like_number').innerText) - 1
		  }
		toggle_like_fa(element);
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

	// make images selectable to allow user to delete them
	document.querySelector('.select-images-info').classList.remove('hidden')
	const post_imgs = document.querySelectorAll('div.img-card>img')
	for (i = 0; i < post_imgs.length; i++){
		post_imgs[i].setAttribute('onclick', "this.classList.toggle('selected')")
	}

	// make post name an input to allow user to change it
	const post_name = document.querySelector('.post_name')
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


	post_name.innerHTML = `<input type='text' dir="auto" class='post_name_input' value='${post_name.innerText}'/>`
	post_description.parentNode.replaceChild(post_description_input, post_description)
	// post_description.innerHTML = `<textarea style="resize: vertical; height: 100%" maxlength="3000" dir="auto" class='post_description_input'>${post_description.innerText}</textarea>'`

	// show new images upload dropzone
	document.querySelector('.add_new_images').classList.remove('hidden')


	// set click listener to the update post btn
	document.querySelector('#add_post_photos_btn').addEventListener('click', function (){
		// update post name and description + delete selected photos
		const new_name = document.querySelector('.post_name_input').value
		const new_description = document.querySelector('.post_description_input').value
		const new_access = document.querySelector('#new_access_type').value
		let selected_images = []
		for (i=0; i < document.querySelectorAll('img.selected').length; i++){
			selected_images.push(document.querySelectorAll('img.selected')[i].getAttribute('src'))
		}
		const data = JSON.stringify({
			'name': new_name,
			'description': new_description,
			'access': new_access,
			'images': selected_images
		})
		// send xhr post request to do the update
		const xhr = new XMLHttpRequest();
		xhr.open("POST", "/postpage/updatepost/" + post_id.toString());
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		const body = "data=" + data
		xhr.onload = () => {
			if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 299) {
				// if queue is empty reload page
				if (Dropzone.forElement('#upload_new_photos').getQueuedFiles().length == 0){
					location.reload()
				} else {
					// If the update returned good status, upload new photos
					Dropzone.forElement('#upload_new_photos').on('queuecomplete', function (file){
					location.reload()
				})
				}
				Dropzone.forElement('#upload_new_photos').processQueue()
			} else {
				console.log("request status: " + xhr.status)
				alert(xhr.responseText)
			}
		};
		xhr.send(body)
	})
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
function validate_login_Form() {
	const name_input = document.getElementById('username')
	const password_input = document.getElementById('login_password')
	const regExp = /\s|[,;\/.\\\]\[{}()\-=+#*`]/;
	let valid = true;

	// Username validation
  if (regExp.test(name_input.value)) {
	  showError(name_input, `Username cannot have whitespace or the following characters: ${regExp}.`);
	  valid = false
  } else {
	  showSuccess(name_input)
  }

  // Password validation
  if (regExp.test(password_input.value)) {
	  showError(password_input, `Password cannot have whitespace or the following characters: ${regExp}.`);
	  valid = false;
  } else {
	  showSuccess(password_input)
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
	  if (/|[,;\/.\\\]\[{}()\-=+#*`]/.test(approximation_input.value)) {
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