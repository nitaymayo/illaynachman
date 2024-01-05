/*jshint jquery:true */
// global $:true

// capitalize function
Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },

  enumerable: false
});

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

});


/* ---------------------------------------------------------------------- */
/*	New post modal
/* ---------------------------------------------------------------------- */

// Get the modal
var modal = document.getElementById("newpostmodal");

// Get the button that opens the modal
var new_post_btn = document.getElementById("newpostmodalbtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("closemodal")[0];

// When the user clicks on the button, open the modal
if (new_post_btn) {
	new_post_btn.onclick = function () {
		modal.style.display = "block";
		document.body.style.overflow = 'hidden';
		$('html').getNiceScroll().hide();
	}
}

// When user clicks upload post buttton
document.getElementById('upload-btn').addEventListener('click', function () {
	if (new_post_validation()) {
		if (Dropzone.forElement('#new_post_dropzone').getQueuedFiles().length > 0) {
			Dropzone.forElement('#new_post_dropzone').on('queuecomplete', submit_new_post(true))
			Dropzone.forElement('#new_post_dropzone').processQueue()
		} else {
			if (confirm("Do you want to upload a post with out images?")) {
				submit_new_post(false);
			}
		}
	} else {
		$(".modal-content").animate({ scrollTop: 0 }, "smooth");
	}
})

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
		"post_tags": post_tags,
		"with_images": with_images //variable to tell the server if the post is imageless
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
  }
}
async function get_tags_options(){
	// xhr request to pull tags options
	const xhr = new XMLHttpRequest
	xhr.open('GET', '/homepage/gettags');
	// xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xhr.onload = () => {
	  if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 299) {
		  const tags = JSON.parse(xhr.responseText)
		  return tags[0];
	  } else {
		  return false
	  }
	}

	xhr.send()
}


// function to execute when user wants to exit new post modal
function close_modal(){
	modal.style.display = "none";
	$('html').getNiceScroll().show();
}
// When the user clicks on <span> (x), close the modal
span.onclick = close_modal

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
	  close_modal()
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

	// show all tags available
	document.querySelector('.select-tags-info').classList.remove('hidden')
	set_postpage_tags()


	// show new images upload dropzone
	document.querySelector('.add_new_images').classList.remove('hidden')
	$('#upload_new_photos').niceScroll()


	// set click listener to the update post btn
	document.querySelector('#update_post_btn').addEventListener('click', function (){
		// update post name and description + delete selected photos
		const new_name = document.querySelector('.post_name_input').value
		const new_description = document.querySelector('.post_description_input').value
		const new_access = document.querySelector('#new_access_type').value
		let new_tags = []
		for (let i = 0; i < document.querySelectorAll('div.tags-box ul li:not(.not_selected) a').length; i++){
			new_tags.push(document.querySelectorAll('div.tags-box ul li:not(.not_selected) a')[i].innerText.toLowerCase())
		}
		let selected_images = []
		for (let i = 0; i < document.querySelectorAll('img.selected').length; i++){
			selected_images.push(document.querySelectorAll('img.selected')[i].getAttribute('src'))
		}
		const data = JSON.stringify({
			'name': new_name,
			'description': new_description,
			'access': new_access,
			'images': selected_images,
			'tags': new_tags
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

