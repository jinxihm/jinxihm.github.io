$(document).ready(function() {

	function isNewBlog(){
		return (location.href.indexOf('newblog')>-1);
	}

	// 新建博客
	if(isNewBlog()){
		$('#blogTitle').attr('contentEditable',true).css('min-height',"24px").focus();
		$('#blogContent').attr('contentEditable',true).css('min-height',"300px");
		$('#edit').hide();
		$('#cancel').hide();
		$('#save').show();
	}
	
	var urlPre = "https://api.github.com/repos/jinxihm/jinxihm.github.io/contents/";
	var token = "?access_token=41228f8e62cef808a68215e6a7b90296465b3db9";
	
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
		// 修改页面元素状态
		$('#blogTitle').attr('contentEditable',false);
		$('#blogContent').attr('contentEditable',false);
		$('#toobBar').hide();
		$('#save').hide();
		$('#cancel').hide();
		$('#info').html("正在保存,请稍等...");
		
		var path =  blogInfo.path || (new Date()).getTime() + ".html";
		
		// 整个html文档,编码成base64.
		var content = "<!DOCTYPE html><html>" + $('html').html() + "</html>";
		
		saveFile(path, content, blogInfo.sha, saveFileSucceed, saveFileFailed);
		
		function saveFileSucceed(data){
			// 更新blogInfo对象
			blogInfo.path = data.content.path;
			blogInfo.sha = data.content.sha;
			blogInfo.url = data.content.url;
			blogInfo.html_url = data.content.html_url;
			
			// 更改地址栏
			var stateObject = {};
			var title = "Wow Title";
			var newUrl = blogInfo.path;
			history.pushState(stateObject,title,newUrl);
			
			window.addEventListener('popstate', function(event) {
				debugger;  
				alert(event);
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
		
	})
	$('#contentNoteBtn').click(function(){
		$('#contentNoteBtn').addClass("sel");
		$('#contentNoteBtn').siblings().removeClass("sel");
		$('#contentNoteArea').show();
		$('#contentNoteArea').siblings().hide();
	})
	$('#contentRefBtn').click(function(){
		$('#contentRefBtn').addClass("sel");
		$('#contentRefBtn').siblings().removeClass("sel");
		$('#contentRefArea').show();
		$('#contentRefArea').siblings().hide();
	})
	
	
	
	$('#editorToolbar').children().click(function(){
		alert('正在完善中...');
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
		
	
});