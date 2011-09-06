// ==UserScript==
// @name           googleplusplus_search_with_google
// @author         Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus_search_with_google
// @include        *plus.google.com*
// @description    
// @version        0.1.8
// ==/UserScript==

function searchWithGoogle(){
	
	var logging = false;

	function log(txt) {
	  if(logging) {
	    console.log(txt);
	  }
	}

	function re_map(mappings){
		if(mappings == null)
			return false; //Scripts without a default (bundled) mapping resource
		var m = mappings;
		SEL = {
			'post' : "[id^='update-']", //"[id^='update-']"
			'posts' : m['XVDd7kiawTA9Z68I'], //".tn"
			'comments_wrap' : m['nqBp6N6dKqueig2R'], //".Ij"
			'comment_editor_cancel' : "[id*='.cancel']", //[id*='.cancel']
			'plust1_and_comments_link_wrap' : m['YAnwDHrlMoy67el9'], //".Bl"
			'old_comment_count_span' : m['9Iug6cv5o3NgTEEv'], //".Gw"
			'recent_comments_wrap' : m['CgYb1dbCZGVfpUAj'], //'.mf'
			'circle_links_wrap' : '#content ' + m['tZ7bxNTZEoVrcPyj'] + ' + div', //"#content .a-ud-B + div"		
			'circle_links' : "#content " + m['NCQTv2BvLd3MFT9q'].replace(':hover','') + " a[href*='stream/']", //"#content .a-ob-j-X a[href*='stream/']"
			'stream_link' : "#content " + m['XLINtDfuUFUIgeVl'] + " + a[href='/stream']:first", //"#content .a-ob-Fd a[href='/stream']:first"
			'stream_link_active' : "#content " + m['XLINtDfuUFUIgeVl'] + " + a[href='/stream']" + m['oL8HuLz0SCCVwtPK'] + ":first", //"#content .a-f-ob-B a[href='/stream'].a-ob-j-ia:first"
			'user_link' : m['tuVm7xq63YKbjl9u'] + ' a:first', //'.Nw a:first'
			'share_link' : m['xG7OYDQoYoP4QS0R'] + ' a:first', //'.gx a:first'
			'permalink_wrap' : m['tuVm7xq63YKbjl9u'], //'.Nw',
			'img_divs' :  "#content " + m['rWCWLOSJ4yQRU41j'] + "[data-content-url]", //#contentPane .F-y-Ia[data-content-url]
			'search_input_classes' : m['ikY6QG1yVApfM0ib'].replace('.','') + ' ' + m['9WbMI68ODRm5sxgV'].replace('.','') + ' ' + m['QvnLjkPdyzwsVmEq'].replace('.',''), //'a-pu-z a-x-z Ka-z-Ka'
			'___' : ''
		};
	}

	function set_selector_mappings(){
		
		/*** Scripts without a default (bundled) mapping resource ***/
		var default_selector_map = {
			'mapping date right' : '0000-00-00.000',
			'mappings' : null
			};
		/***********************************************************/
		
		var mappings = {};
		try{
			//console.log(SEL);
			/*stor_del('GPlus CSS Map');
			stor_del('Last Got GPlus CSS Map Date');
			stor_del('GPlus CSS Map Date');
			return;*/

			//var now = new Date("August 25, 2011 22:27:00"); //new Date();
			var now = new Date();

			var stored_mappings;
			var stored_last_check_for_map_update;
			var stored_map_date;

			//Check for resume flag
			var uncheckable_dom_litmus_location = false;
			var path = window.location.pathname;
			if( path !=  '/' && path.indexOf('/stream/') == -1 && path.indexOf('/posts') == -1 ){
				uncheckable_dom_litmus_location = true;
			}

			//Set mappings if first time upon page load
			if( !SET_SELECTOR_MAPPINGS_DONE_ONCE ){
				stored_mappings = $.parseJSON(stor_get('GPlus CSS Map', null));
				stored_last_check_for_map_update = stor_get('Last Got GPlus CSS Map Date', 0);
				stored_map_date = stor_get('GPlus CSS Map Date', '');

				//User stored mapping if newer than default mappings
				if((stored_last_check_for_map_update != 0) && (stored_mappings) && (stored_map_date > default_selector_map['mapping date right'])){
					mappings = stored_mappings; //local storage copy of map
					default_selector_map['mapping date right'] = stored_map_date; //Scripts without a default (bundled) mapping resource
				}else{
					mappings = default_selector_map.mappings; //included default map file
				}

				//console.log('mappings_before_remap:');
				//console.log(default_selector_map.mappings);
				re_map(mappings);
				//console.log(SEL);
			}else{
				SET_SELECTOR_MAPPINGS_DONE_ONCE = true; //done once, set flag
			}

			//Check if resume mode is needed
			if(uncheckable_dom_litmus_location){
				RESUME_MAP_CHECK_UPON_ROOT_PATH = true; //flag to re-run when at root URL
				return;
			}

			RESUME_MAP_CHECK_UPON_ROOT_PATH = false; //unset flag

			//Check remote mappings in case of update
			var timediff = now.getTime() - stored_last_check_for_map_update;
			//console.log('timediff:');
			//console.log(timediff/60*1000*60);
			//console.log('stored_last:');
			//console.log(stored_last_check_for_map_update);
			//console.log('stored_map:');
			//console.log(stored_map_date + ' and ' + stored_map_date);
			//console.log('stored_last:' + stored_last_check_for_map_update); console.log('timediff:' + (timediff > 30*60*1000)); console.log('force:' + SET_SELECTOR_MAPPINGS_FORCED);
			if((default_selector_map.mappings == null) || (stored_last_check_for_map_update == 0) || (timediff > 30*60*1000) || (SET_SELECTOR_MAPPINGS_FORCED)){ /* 30*60*1000 = 0.5 hour interval*/
				SET_SELECTOR_MAPPINGS_FORCED = false; //unset flag
				//console.log('past interval');
				$.get('http://goldenview.wittman.org/map/current_gplus_mappings_timestamp.txt', function(data){
					//console.log(data);
					var remote_date = data;
					if((remote_date.length > 8 && remote_date.length < 16 && remote_date[0] == 2) && (remote_date > default_selector_map['mapping date right'])){ //2010-01-01.123
						$.getJSON('http://goldenview.wittman.org/map/current_gplus_mappings.json', function(data){
							//console.log('ajax map pull:'); console.log(data);
							var date_right = typeof data['mapping date right'] == 'undefined' ? default_selector_map['mapping date right'] : data['mapping date right'];	
							var mappings_length = Object.keys(data.mappings).length;
							//console.log('date_right, default_date');
							//console.log(date_right); console.log(default_selector_map['mapping date right']);
							if(date_right > default_selector_map['mapping date right'] && mappings_length > 999 && (!$(SEL.posts).length || !$(SEL.comments_wrap).length || !$(SEL.circle_links).length)){
								mappings = data.mappings;
								re_map(mappings);
								stor_set('GPlus CSS Map', JSON.stringify(mappings));
								stor_set('GPlus CSS Map Date', date_right);
								//console.log('update local from remote');
								//console.log(mappings);
							}
						});
					}
				});
				stor_set('Last Got GPlus CSS Map Date', now.getTime());
				//console.log('stored:'+now.getTime());
			}
			//console.log(mappings);
		}catch(e){
			SET_SELECTOR_MAPPINGS_DONE_ONCE = true; //done once, set flag
			////mappings = default_selector_map.mappings; //If all else fails, use included default map file
			////re_map(mappings);
			//console.log('exception caught, using default');
			//console.log('Remote map not pulled yet.')
			//console.log(e.message);
			//console.log(mappings);
		}
	}
	
	function setItem(key, value) {
		try{
			log("Inside setItem: " + key + ":" + value);
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}catch(e){
			log("Error inside setItem");
			log(e);
		}
		log("Return from setItem" + key + ":" +  value);
	}

	function getItem(key){
		var v;
		log('Get Item: ' + key);
		try{
			v = window.localStorage.getItem(key);
		}catch(e){
			log("Error inside getItem() for key: " + key);
			log(e);
			v = null;
		}
		log("Returning value: " + v);
		return v;
	}
	function removeItem(key) {
		try{
			log("Inside removetItem: " + key);
			window.localStorage.removeItem(key);
		}catch(e){
			log("Error inside removeItem");
			log(e);
		}
		log("Return from removeItem" + key);
	}
	function clearStorage(){
		log('about to clear local storage');
		window.localStorage.clear();
		log('cleared');
	}
	function GM_removeItem(name){
		removeItem(name);
	}
	function GM_setValue(name, value){
		setItem(name, value);
	}

	function GM_getValue(name, oDefault){
		var v = getItem(name);
		if(v == null){
			return oDefault;
		}else{
			return v;
		}
	}
	function set_item(key, value) {
		try{
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}catch(e){
			log(e);
		}
	}

	function get_item(key){
		var v;
		try{
			v = window.localStorage.getItem(key);
		}catch(e){
			log(e);
			v = null;
		}
		return v;
	}
	function del_item(key) {
		try{
			window.localStorage.removeItem(key);
		}catch(e){
			log(e);
		}
		log("Return from removeItem" + key);
	}
	function stor_clear(){
		log('about to clear local storage');
		window.localStorage.clear();
		log('cleared');
	}
	function stor_del(name){
		del_item(name);
	}
	function stor_set(name, value){
		set_item(name, value);
	}
	function stor_get(name, dfault){
		var v = get_item(name);
		if(v == null){
			return dfault;
		}else{
			return v;
		}
	}
	
	var SEL = {};
	var RESUME_MAP_CHECK_UPON_ROOT_PATH = false;
	var SET_SELECTOR_MAPPINGS_DONE_ONCE = false;
	var SET_SELECTOR_MAPPINGS_FORCED = false;
	var SET_SELECTOR_MAPPINGS_FORCED_ONCE = false;

	set_selector_mappings();
	
	
	var search_box_new_html = '<form style="display:none" id="ggp__search_with_google" method="get" action="http://www.google.com/search?" target="_blank"><input type="hidden" name="hl" value="en-GB"><input type="hidden" name="q" value="site:plus.google.com -buzz -&quot;google reader&quot;"><input class="' + SEL.search_input_classes + '" id="gpp__search-box" autocomplete="off" type="text" maxlength="2048" name="q" value="Search with Google" placeholder="Search with Google"></form> <a style="float:right;font-weight:bold;font-size:9px" id="gpp__search_with_google_swap">TOGGLE SEARCH TYPE</a>'; //NEW

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