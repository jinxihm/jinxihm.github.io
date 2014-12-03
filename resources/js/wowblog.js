$(document).ready(function() {
	
	var listener = new window.keypress.Listener();
	
	listener.simple_combo("shift s", function() {
	    console.log("You pressed shift and s");
	});
	
	listener.simple_combo("tab", function() {
	    console.log("You pressed tab ");
	});
	
	listener.simple_combo("space a", function() {
	    console.log("You pressed space a s ");
	});

	// There are also a few other shortcut methods:

	// If we want to register a counting combo
	listener.counting_combo("tab space", function(e, count) {
	    console.log("You've pressed this " + count + " times.");
	});

	// If you want to register a sequence combo
	listener.sequence_combo("up up down down left right left right b a enter", function() {
	    lives = 30;
	}, true);
	
	
	
	
	
	
	
	
	
	
	
	
	window.wowblog = {};
	wowblog.category = null;
	wowblog.pageInfo = {};
	// 获取目录信息
	/*(function(){
		$.getJSON("/category.json", function(data){
			wowblog.category = data; 
		});
	})();*/
	
	// 更新目录数据
	getContent('/category.json',function(data){
		wowblog.category = data;
		
	}, function(data){
		
	})
	
	
	
	function isNewPage(){
		//return (location.href.indexOf('newblog')>-1);
		return true;
	}

	// 新建页面
	if(isNewPage()){
		$('#blogTitle').attr('contentEditable',true).css('min-height',"24px").focus();
		$('#blogContent').attr('contentEditable',true).css('min-height',"300px");
		$('#edit').hide();
		$('#cancel').hide();
		$('#save').show();
		$('#categoryDropMenu').text("请选择分类");
	// 直接打开已存在页面
	}else{
		// 获取页面信息
		(function(){
			getContent(location.pathname,function(data){
				wowblog.pageInfo.path = data.path;
				wowblog.pageInfo.sha = data.sha;
			},function(data){
				console.log("获取页面信息失败:");
				console.log(data);
			});
		})();
	}
	
	
	// 编辑
	$('#edit').click(function() {
		$('#edit').hide();
		$('#save').show();
		$('#cancel').show();
		$('#info').html("");
		$('#toobBar').show();
		$('#blogTitle').attr('contentEditable', true);
		$('#blogContent').attr('contentEditable', true).css("min-height","300px").focus();
		
		// 
		blogInfo.oldTitle = $('#blogTitle').html();
		blogInfo.oldContent = $('#blogContent').html();
	});	
	
	// 取消
	$('#cancel').click(function() {
		$('#blogTitle').html(blogInfo.oldTitle);
		$('#blogContent').html(blogInfo.oldContent);		
		$('#blogTitle').attr('contentEditable', false).removeClass("inEdit");
		$('#blogContent').attr('contentEditable', false).removeClass("inEdit");
		$('#save').hide();
		$('#cancel').hide();
		$('#toobBar').hide();
		$('#edit').show();
	});	
	
	

	$('#delete').click(function() {
		
	});
	// 保存
	$('#save').click(function() {
		// 检查
		if($('#blogTitle').text().length == 0){
			alert('请输入标题');
			return;
		}
		if($('#categoryDropMenu').text() === "请选择分类"){
			alert('请选择分类');
			return;
		}
		
		if(!isNewPage() && !wowblog.pageInfo.sha){
			alert('正在获取文件信息，请重新保存');
			return;
		}
		
		// 修改页面元素状态
		$('#blogTitle').attr('contentEditable',false).css('background-color','transparent');
		$('#blogContent').attr('contentEditable',false).css('background-color','transparent');
		$('#toobBar').hide();
		$('#save').hide();
		$('#cancel').hide();
		
		document.title = $('#blogTitle').text();
		
		if(isNewPage()){
			path = "/"  + (new Date()).getTime() + ".html";
		}
				
		// 整个html文档,编码成base64.
		var content = "<!DOCTYPE html><html>" + $('html').html() + "</html>";
		
		saveFile(path, content, wowblog.pageInfo.sha, saveFileSucceed, saveFileFailed);
		
		$('#info').html("正在保存,请稍等...");
		
		function saveFileSucceed(data){
			// 更新blogInfo对象
			wowblog.pageInfo.path = data.content.path;
			wowblog.pageInfo.sha = data.content.sha;
			
			// 更改地址栏
			var stateObject = {};
			var title = "Wow Title";
			var newUrl = wowblog.pageInfo.path;
			history.pushState(stateObject,title,newUrl);
			
			window.addEventListener('popstate', function(event) {
				//debugger;  
				//alert(event);
				});
			
			
			$('#info').html("已保存");
			$('#edit').show();
		}
		
		function saveFileFailed(data){
			$('#info').html("保存失败.\n" + data.message);
		}
		
		
	});
	
	
	
	
	
	
	
	$('#contentNavBtn').click(function(){
		$('#contentNavBtn').addClass("sel");
		$('#contentNavBtn').siblings().removeClass("sel");
		$('#contentNavArea').show();
		$('#contentNavArea').siblings().hide();
		
	});
	$('#contentCategoryBtn').click(function(){
		$('#contentCategoryBtn').addClass("sel");
		$('#contentCategoryBtn').siblings().removeClass("sel");
		$('#contentCategoryArea').show();
		$('#contentCategoryArea').siblings().hide();
		
	});
	$('#contentNoteBtn').click(function(){
		$('#contentNoteBtn').addClass("sel");
		$('#contentNoteBtn').siblings().removeClass("sel");
		$('#contentNoteArea').show();
		$('#contentNoteArea').siblings().hide();
	});
	$('#contentRefBtn').click(function(){
		$('#contentRefBtn').addClass("sel");
		$('#contentRefBtn').siblings().removeClass("sel");
		$('#contentRefArea').show();
		$('#contentRefArea').siblings().hide();
	});
	
	
	
	$('#editorToolbar').children().click(function(){
		alert('正在完善中...');
	});
	
	$('#contentCategoryArea .dropdown a').click(function(){
		$('#categoryDropMenu').text($(this).text());
	});
	
	
	function updateCategory(){
		var categoryList = wowblog.category;
		for(var i = 0; i < categoryList.length; i++){
			if($('#categoryDropMenu').text() === categoryList[i].title){
				var url = makeupUrl(wowblog.pageInfo.path);
				categoryList[i].push({title:$('#blogTitle').text(), url: url});
			}
		}
	}
	
	
	
	
	
	
	
	
		
	
});
