/* url for repositories API*/
var reposUrl = "https://api.github.com/repos/jinxihm/jinxihm.github.io/contents/";
var token = "?access_token=41228f8e62cef808a68215e6a7b90296465b3db9"
	
var getFileContent = function getFileContent(path){
	
}

var getDirContent = function getDirContent(dirPath, successFunc, failFunc){
	$.ajax({
		type: "get",
		url: reposUrl + dirPath + token,
		dataType : "json",
		success: successFunc,
		error: failFunc
	});
}

/**
 * 保存或更新文件。文件夹需要通过创建文件间接创建。
 */
var saveFile = function saveFile(path, fileContent, sha ,successFunc, failFunc){
	var inputData = {};
	inputData.message = "my commit message";
	inputData.committer = {	"name" : "n1",	"email" : "n2@gmail.com" };
	// base64编码，参见mdn
	inputData.content = window.btoa(unescape(encodeURIComponent(fileContent)));
	// 有sha参数表明是更新文件，否则为创建文件
	if(sha !== null){
		inputData.sha = sha;
	}
	$.ajax({
		type : "put",
		url :   reposUrl + path+ token,
		contentType : "application/json",
		data : JSON.stringify(inputData),			
		dataType : "json",
		success: successFunc,
		error: failFunc
	})
}
