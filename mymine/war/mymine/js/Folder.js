
function Folder(){this.initialize.apply(this, arguments)};
(function(Class){
	var INBOX = "inbox";
	var FOLDERS = [
	    {name:INBOX,     title:"受信箱",     icon:"img/inbox.png", nosave:true},
	    {name:"trash",   title:"ゴミ箱",     icon:"img/bin_closed.png", nosave:true},
	    {name:"sepa1",   title:"---",        icon:"---"},
	    {name:"now",     title:"至急",       icon:"img/alarm.png"},
	    {name:"play",    title:"現行作業",   icon:"img/hand.png"},
	    {name:"reserve", title:"予定作業",   icon:"img/bookmark_folder.png"},
	    {name:"todo",    title:"後回し",     icon:"img/folder.png"},
	    {name:"ovserve", title:"相談のみ",   icon:"img/comment.png"},
	    {name:"wait",    title:"進捗待ち",   icon:"img/comment.png"},
	    {name:"other",   title:"その他",     icon:"img/folder.png"}
	];

	var folders = {};
	var currentName = null;
	var isFirstInbox = true;

	Class.searchKeyword = null;

	Class.prototype.initialize = function() {
	}

	Class.resetAll = function() {
		folders = {};
		for (var i=0; i<FOLDERS.length; i++) {
			var folder = FOLDERS[i]
			folder.seq = i;
			folder.tickets = {};
			folders[folder.name] = folder;
			Storage.saveFolder(folder);
		}
	}

	Class.init = function() {
		//Storage.cleanup("/folder/");
		//Class.resetAll();

		Class.refresh();
		Tickets.setSorted("hUpDate", false);
	}
	Class.hover = function(isIn, _this) {
		var cursor = "pointer";
		if (MyMine.isDrag()) {
			var sels = Tickets.getSelection();
			var img = (sels.length>=2) ? "tickets":"ticket";
			if (_this.id == currentName) img += "-no";
			cursor = "url(img/"+img+".png) 16 8, pointer";
		}
		var $this = $(_this);
		$this.css("cursor", cursor);

		if (_this.id != currentName) {
			$this.css("border", isIn?"1px solid #ddd":"0");
		}
	}

	Class.isInbox = function() {
		return currentName == INBOX;
	}
	Class.getCurrentName = function() {
		return currentName;
	}
	Class.getCurrentFolder = function() {
		if (currentName == null) return null;
		return folders[currentName];
	}

	Class.add = function(folder) {
		var seq = 0;
		for (var name in folders) seq = Math.max(seq, folders[name].seq);
		folder.seq = seq+1;
		folder.tickets = {};
		Storage.saveFolder(folder);
		Class.put(folder);
	}
	Class.removeFolder = function() {
		var folder = folders[currentName];
		if (folder == null) return;
		if (folder.nosave) return;
		Storage.removeFolder(folder);
		delete folders[currentName];
		Class.refresh();
	}


	Class.put = function(folder) {
		folders[folder.name] = folder;
		//Class.refresh();
	}
	Class.dropTicket = function (name) {
		var selects = Tickets.getSelection();
		for (var i=0; i<selects.length; i++) {
			var ticketNum = selects[i];
			Class.remove(currentName, Ticket.issue(ticketNum));
			Class.register(name, Ticket.issue(ticketNum));
		}
		Class.refresh();
		Class.select(currentName);
	}

	Class.register = function (name, issue) {
		var folder = folders[name];
		if (name != INBOX) issue.folder = name;
		Ticket.register(issue);
		folder.tickets[issue.id] = 1;
		Storage.saveFolder(folder);
	}
	Class.remove = function (name, issue) {
		var folder = folders[name];
		if (folder == null) return;
		issue.folder = null;
		Ticket.register(issue);
		delete folder.tickets[issue.id];
		Storage.saveFolder(folder);
	}
	Class.isNoSave = function (name) {
		var folder = folders[name];
		if (folder == null) return true;
		return folder.nosave;
	}

	var inboxPage = 1;
	var isInboxFin = false;
	Class.inbox = function() {
		isFirstInbox = false;
		inboxPage = 1;
		isInboxFin = false;
		folders[INBOX].tickets = {};
		Tickets.reload(folders[INBOX].tickets);
		inbox();
	}
	Class.inboxAppend = function() {
		if (currentName != INBOX) return;
		if (isInboxFin) return;
		inboxPage++ ;
		inbox();
	}


	var SORT_NAME = {
		hNum      : "id",
		hAssigned   : "assigned_to",
		hUpDate   : "updated_on",
		hDueDate  : "due_date",
		hDoneRate : "done_rate",
		hSubject  : "subject"
	}

	function inbox() {
		var prjId = $("#projectSelector").val();
		var opts = {page:inboxPage, project_id:prjId};

		var custom = Control.checkButtonGroup("custom");
		var query = null;
		if (custom>=0) query = Config.redmineCustomQuery[custom];

		if (Control.checkButtons.filter_user) opts.assigned_to_id=Control.userId;
		if (Control.checkButtons.filter_closed) opts.status_id="*";
		var masterTable = MasterTable.getMasterTable();
		for (var k in masterTable) {
			var val = Control.getValue("filter_"+k);
			if (val) opts[k+masterTable[k].idSuf] = val;
		}
		
		
		var sorted = Tickets.getSorted();
		if (sorted.name) {
			opts.sort = SORT_NAME[sorted.name];
			if (!sorted.asc) {
				opts.sort += ":desc";
			}
		}

		new RedMine().getIssues(function(data){
			for (var i=0; i<data.issues.length; i++) {
				var issue = Ticket.register(data.issues[i]);
				Folder.register(INBOX, issue);
				MasterTable.register(issue);
			}

			Folder.select(INBOX);
			Folder.refresh();

			isInboxFin = (data.issues.length==0);
		}, query, opts);
	}

	Class.inboxOne = function(num) {
		MyMine.waiting(true);
		isFirstInbox= false;
		folders[INBOX].tickets = {};
		folders[INBOX].tickets[num] = 1;
		new RedMine().getIssue(num, function(data){
			Ticket.register(data.issue);
			Folder.select(INBOX);
			Folder.refresh();
			MyMine.waiting(false);
		});
	}


	Class.refresh = function () {
		var $section = $("#folders");
		var $template = $("#templ_folder");

		$section.html("");
		var list = [];
		for (var name in folders) {
			list.push(folders[name]);
		}
		list.sort(function(a,b){return a.seq-b.seq;});

		for (var i=0; i<list.length; i++) {
			var folder = list[i];
			if (folder.title=="---") {
				$section.append($("<hr/>"));
			} else {
				var $article = $template.clone();
				$article.attr("id",folder.name);
				$article.html(getTitleWithCount(folder));
				$article.css("background","url("+folder.icon+") no-repeat  2px 2px");
				$section.append($article);
			}
		}
		Class.select(currentName);
	}

	function getTitleWithCount(folder) {
		if (folder.nosave) return folder.title;
		var unchecked = 0;
		var total = 0;
		for (var num in folder.tickets) {
			if (!Ticket.isChecked(num)) unchecked++;
			total++;
		}
		if (total == 0) return folder.title;
		if (unchecked == 0) {
			return "<span class='Count'>("+total+") </span>"+folder.title;
		}
		return "<span class='Count'>("
			+"<b>"+unchecked+"</b>/"+total
			+") </span>"+folder.title;
	}


	Class.select = function(name) {
		if (folders[name] == null) return;
		if (name == INBOX && isFirstInbox) {
			Class.inbox();
		}

		$(".Folder").css({backgroundColor:"transparent", border:"0"});
		$("#"+name).css({backgroundColor:"white", border:"1px solid #aaa"});
		currentName = name;

		$("#editFolderButton").toggle(!folders[name].nosave);

		Tickets.reload(folders[name].tickets);
		Tickets.clearSelection();
	}


	Class.updateTickets = function(name) {
		MyMine.waiting(true);
		var allTickets = getAllTickets(name);
		var redmine = new RedMine();
		var count = 0;
		var total = 0;
		for (var num in allTickets) {
			count++;
			redmine.getIssue(num, function(data){
				data.issue.folder = allTickets[data.issue.id];
				Ticket.register(data.issue);
				if (--count <= 0) {
					MyMine.waiting(false);
					Class.refresh();
				}
				MyMine.progress(100*(total-count)/total);
			});
		}
		total = count;
		if (count == 0) {
			MyMine.waiting(false);
		}
	}

	function getAllTickets(name) {
		if (name != null) {
			var all = {};
			var tickets = folders[name].tickets;
			for (var num in tickets) all[num] = name;
			return all;
		}

		var all = {};
		for (var name in folders) {
			var tickets = folders[name].tickets;
			for (var num in tickets) all[num] = name;
		}
		return all;
	}

	Class.insert = function(name1, name2) {
		if (folders[name1].nosave || folders[name2].nosave) return;
		var tmp = folders[name1].seq;
		folders[name1].seq = folders[name2].seq;
		folders[name2].seq = tmp;
		return;
	}


	var handle = null;
	var callback = null;
	Class.isDrag = function() {
		return handle != null;
	}
	Class.moveDrag = function(elem) {
		if (handle != null && handle != elem) {
			Folder.insert(elem.id, handle.id);
			Folder.refresh();
		}
	}
	Class.startDrag = function(elem, func) {
		handle = elem;
		callback = func;
		Folder.select(elem.id);
	}
	Class.endDrag = function() {
		handle = null;
	}
	Class.move = function(ev) {
		if (handle == null) return;
		$(".Folder").css({cursor:"row-resize"});
	}


})(Folder);
