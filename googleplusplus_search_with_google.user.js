// ==UserScript==
// @name           googleplusplus_search_with_google
// @author         Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus_search_with_google
// @include        *plus.google.com*
// @description    
// @version        0.1.2
// ==/UserScript==

function searchWithGoogle(){
	var search_box_new_html = '<form style="display:none" id="ggp__search_with_google" method="get" action="http://www.google.com/search?" target="_blank"><input type="hidden" name="hl" value="en-GB"><input type="hidden" name="q" value="site:plus.google.com -buzz -&quot;google reader&quot;"><input class="a-b-fi-O a-fi-O a-G-O wa-O-wa" id="gpp__search-box" autocomplete="off" type="text" maxlength="2048" name="q" value="Search with Google" placeholder="Search with Google"></form> <a style="float:right;font-weight:bold;font-size:9px" id="gpp__search_with_google_swap">TOGGLE SEARCH TYPE</a>';
	
	var sbox = $('#search-box').after(search_box_new_html);
	var sbox_new = $('#ggp__search_with_google');
	
	$('#gpp__search-box').focus(function(){
		var t = $(this);
		if( t.val() == 'Search with Google' ){
			t.val('');
		}
	});
	
	$('#gpp__search_with_google_swap').click(function(){
		sbox.toggle();
		sbox_new.toggle();
	});
		
}

/****** Load jQuery then callback upon load function ******/
function addJQuery(callback){
	var script = document.createElement("script");
	script.setAttribute("src", protocol + "ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

/****** Call Load jQuery + callback function ******/
var protocol = window.location.protocol + '//';
addJQuery(searchWithGoogle);