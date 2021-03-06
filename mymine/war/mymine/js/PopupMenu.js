
function PopupMenu(){this.initialize.apply(this, arguments)};
(function(Class){
	Class.options = null;

	Class.open = function(name, opts){
		Class.options = opts;

		var $menu  = $(name).show();
		var offset = {left:0, top:0};
		if (opts.offset) {
			offset = opts.offset;
		} else if (opts.element) {
			var $elem = $(opts.element);
			offset = $elem.offset();
			offset.top += $elem.height();
		} else if (opts.event) {
			offset = {left:opts.event.clientX, top:opts.event.clientY};
		}

		if (opts.corrent) {
			offset.left += opts.corrent.x;
			offset.top  += opts.corrent.y;
		}

		$menu.offset(offset);
	}

	Class.close = function(){
		// TODO: 複数Popup
		$(".PopupMenu").hide();
	}


	Class.makeIconMenu = function(name, url) {
		jQuery.get(url, null, function(data){
			var $menu = $(name);
			var icons = data.split("\n");

			for (var i=0; i<icons.length; i++) {
				var $img = $("<img class='PopupMenuItem'/>");
				$img.attr("src", icons[i]);
				$menu.append($img);
			}
		});
	}






})(PopupMenu);
