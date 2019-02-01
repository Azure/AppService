var content = $("#content").html();
if(content !='')
{ 
	content ='<p>'+ content.replace(/\n/g,'</p> <p>').replace(/\r\n/g,'</p> <p>' )+'</p>'; 
	$("#content").html(content);
}