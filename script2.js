var appId = '7reogkcbozs088jdpq1zsw5usbz7vtd1id936ks9bqk6r34k';
var appKey = 'da3nhru3nu9ob8wek51dkbwn4qvfnmdw338le9b8tiab9o5j';

var Tag = AV.Object.extend('Tag');
var Post = AV.Object.extend('Post');
var Comment = AV.Object.extend('Comment');

function logError(msg, error) {
	console.log(msg + ": Error code: " + error.code + " . Error message: " + error.message);
}

// 加载标签
function loadTag() {

	$('#tagPanel').empty();
	var tagElmTmpl = $('#tagTempl').clone().removeAttr('id');
	var qry = new AV.Query(Tag);
	qry.descending('postNum');
	qry.find().then(function(tags) {
		// 更新标签面板
		for (var i = 0; i < tags.length; i++) {
			var tagName = tags[i].get('name');
			var tagElm = $('#tagTempl').clone().removeAttr('id').text(tagName).appendTo('#tagPanel');
			if (tagName === '未分类') {
				tagElm.attr('id', 'notCatgTag');
			}
		}
		if ($('#notCatgTag').length > 0) {
			$('#notCatgTag').remove();
			var tagElm = $('#tagTempl').clone().removeAttr('id').text('未分类').appendTo('#tagPanel');
		}
		$('#tagTempl').clone().removeAttr('id').text('全部').appendTo('#tagPanel');
	}, function(error) {
		logError('query tags error.', error);
	});
};

// 添加文章到页面
function appendPosts(posts) {
	$('#postList').empty();
	$('#newPostItem').css('display','block');
	if (!posts || posts.length == 0) {
		$('#newPostItem').addClass('bottom-radius');
		return;
	} else {
		$('#newPostItem').removeClass('bottom-radius');
	}
	for (var i = 0; i < posts.length; i++) {
		var postElm = $('#postItemTempl').clone().appendTo('#postList').removeAttr('id');
		if (i == 0) {// 标记第一个post
			postElm.addClass('first-post');
		}
		if (i == posts.length - 1) {// 最后一篇post,有可能也是第一个post.
			postElm.addClass('last-post');
		}
		postElm.find('.box').html(posts[i].get('html')).data('postId',posts[i].id);
	}
}

// 查询文章
function queryPost(from, size) {
	var query = new AV.Query(Post);
	query.descending('createdTime');
	if (from !== null) {
		query.skip(from);
	}
	if (size !== null) {
		query.limit(size);
	}
	query.find({
		success : function(posts) {
			appendPosts(posts);
		},
		error : function(error) {
			logError('query posts error.', error);
		}
	});
}

// 查找标签下的全部文章
function loadPostOfTag(tagName) {
	if (tagName === '全部') {
		queryPost();
		return;
	}
	var tagQry = new AV.Query(Tag);
	tagQry.equalTo("name", tagName);
	tagQry.first().then(function(object) {
		if (!object) {
			return;
		}
		var postIdsArr = object.get('postId');
		var postIdsStr = postIdsArr.join('","');
		var cql = 'select html,id from Post where objectId in ( "' + postIdsStr + '" ) order by createdTime desc';
		AV.Query.doCloudQuery(cql, {
			success : function(result) {
				appendPosts(result.results);
			},
			error : function(error) {
				logError('query post by tag failed.', error);
			}
		})
	}, function(error) {
		logError('query tag failed.', error);
	})
}

function savePost(text, html) {
	var post = new Post();
	post.set('text', text);
	post.set('html', html);
	post.set('createdTime', (new Date()).getTime());
	post.save(null, {
		success : function(post) {
			$('#newPostBox').html('').blur();
			$('.first-post').removeClass('first-post');
			var itemTemp = $('#postItemTempl').clone().removeAttr('id').addClass('first-post').prependTo('#postList');
			itemTemp.find('.box').html(html);

			// 匹配标签,双#号之间1到15个非空白字符
			var reg = /#\S{1,15}#/g;
			var tags = text.match(reg);
			if (!tags || tags.length == 0) {
				tags = [ '#未分类#' ];
			}
			saveTags(tags, post.id);
		},
		error : function(post, error) {
			logError('save post failed.', error);
		}
	});
}

function saveTags(tags, postId) {

	if (!tags || tags.length == 0) {
		return;
	}
	// 取最后一个,并去除前后#号,过滤掉'全部'标签
	var tagName = null;
	while ((tagName = tags.pop().slice(1, -1)) == '全部') {
		continue;
	}
	// var tagName = tags.pop().slice(1, -1);
	var query = new AV.Query(Tag);
	query.equalTo('name', tagName);
	query.find().then(function(results) {
		// topic已存在
		if (results !== null && results.length > 0) {
			var tag = results[0];
			tag.add('postId', postId);
			tag.set('postNum', (tag.get('postNum') || 0) + 1);
			return tag.save();
			// topic不存在
		} else {
			var tag = new Tag();
			tag.set('name', tagName);
			tag.set('postId', [ postId ]);
			tag.set('postNum', 1);
			return tag.save(null, {
				success : function(tag) {
					console.log('create new tag succeed: ' + tag.id);
				}
			});
		}
	}).then(function() {
		console.log("save tag succeed");
		// 递归调用
		return saveTags(tags, postId)
	}, function(error) {
		logError('save tag error. ', error);
	}).then(function() {
		return loadTag();
	}).then(function() {
		console.log('query tags succeed');
	}, function(error) {
		logError('query tags ', error);
	});
}

function createComment(text,html, postId){
	var comment = new Comment();
	comment.set('text',text);
	comment.set('html',html);
	comment.set('postId',postId);
	comment.set('createdTime', (new Date()).getTime());
	comment.save(null, {success:function(comment){
		console.log('save comment succeed.' + comment.id);
	},error:function(comment, error){
		logError('save comment error ', error);
	}});
}

function registEvent(){
	
	$('#tagPanel').on({
		click : function() {
			loadPostOfTag($(this).text());
		}
	}, ".tag");

	$('#newPostPlaceholder').click(function() {
		$(this).css('display', 'none');
		$('#newPostBox').css('display', 'block').focus();
		$('#toolBar').css('display', 'block');
		$('#newPostItem').css('margin-bottom', '15px').removeClass('top-radius');
		$('#newPostItem').css('box-shadow', '1px 1px 40px rgba(0, 109, 109, 1)');
		$('.first-post').addClass('top-radius');
		$('#postList .post-item').css('opacity', '0.1');
	});

	$('#newPostBox').blur(function() {
		var text = $(this).text();
		var html = $(this).html();
		if (text.trim() === "" && html.indexOf('<img') < 0 && html.indexOf('<video') < 0) {
			$(this).css('display', 'none');
			$('#toolBar').css('display', 'none');
			$('#newPostPlaceholder').css('display', 'block');
			$('#newPostItem').css('margin-bottom', '0px').addClass('top-radius');
			$('#newPostItem').css('box-shadow', 'none');
			$('.first-post').css('border-top-left-radius', '0px').removeClass('top-radius');
			$('#postList .post-item').css('opacity', '1');
		}
	});

	$('#newPostBox').keyup(function(e) {
		if ($(this).text().trim() === "") {
			$('#createPostBtn').prop('disabled', true);
		} else {
			$('#createPostBtn').prop('disabled', false);
			if (e.ctrlKey && e.which == 13) {
				$('#createPostBtn').click();
			}
		}
	});

	$('#createPostBtn').click(function() {
		savePost($('#newPostBox').text(), $('#newPostBox').html());
	});
	
	
	$('#postList').on({click:function(){
		$(this).parent().find('.info').toggleClass('hide');
	}},'.box');
	
	$('#postList').on({click:function(){
		$(this).css('display','none').next().css('display', 'block').focus();
		$('.comment-tool-bar').css('display','block');
	}},'.new-comment-placeholder');
	
	$('#postList').on({blur:function(){
		var text = $(this).text();
		var html = $(this).html();
		if (text.trim() === "" && html.indexOf('<img') < 0 && html.indexOf('<video') < 0) {
			$(this).css('display','none').prev().css('display','block');
			
		}
	},keyup:function(e){
		var createCommentBtn = $(this).next().find('.create-comment-btn')
		if ($(this).text().trim() === "") {
			createCommentBtn.prop('disabled', true);
		} else {
			createCommentBtn.prop('disabled', false);
			if (e.ctrlKey && e.which == 13) {
				createCommentBtn.click();
			}
		}
	}},'.new-comment-box');
	
	$('#postList').on({click:function(){
		var newCommentBox = $(this).parent().prev();
		createComment(newCommentBox.text(), newCommentBox.html(), '2323232323');
	}},'.create-comment-btn');
	
	
	
}





















