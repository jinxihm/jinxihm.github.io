/* url for repositories API*/
var reposUrl = "https://api.github.com/repos/jinxihm/jinxihm.github.io/contents";
var sitePagesPath = "/sitepages";
var token = "?access_token=41228f8e62cef808a68215e6a7b90296465b3db9";



var getContent = function getContent(path, successFunc, failFunc) {
	$.ajax({
		type : "get",
		url : reposUrl + path + token,
		dataType : "json",
		success : successFunc,
		error : failFunc
	});
};

/**
 * 创建文件
 */
var createContent = function createContent(path, fileContent, successFunc, failFunc){
	updateContent(path, fileContent, null, successFunc, failFunc);
}

/**
 * 保存或更新文件。
 */
var updateContent = function updateContent(path, fileContent, sha, successFunc, failFunc) {
	var inputData = {};
	inputData.message = "my commit message";
	inputData.committer = {
		"name" : "n1",
		"email" : "n2@gmail.com"
	};
	// base64编码，参见mdn
	inputData.content = window.btoa(unescape(encodeURIComponent(fileContent)));
	// 有sha参数表明是更新文件，否则为创建文件
	if (sha !== null) {
		inputData.sha = sha;
	}
	$.ajax({
		type : "put",
		url : reposUrl + path + token,
		contentType : "application/json",
		data : JSON.stringify(inputData),
		dataType : "json",
		success : successFunc,
		error : failFunc
	});
};


/**
 * 文件夹需要通过创建文件间接创建。
 */
/*var createDir = function createDir(path, successFunc, failFunc){
	//var dirIndex = {pageNum:2,pages:[{titel:"title", path: "path"}]}
	
	path = path + "/dirIndex.json";
	var fileContent ="{}";
	saveFile(path, fileContent, null, successFunc, failFunc);
	
};*/


var makeupUrl = function makeupUrl(path){
	return reposUrl + path;
}














