var http = require('https');
var body = '';
exports.getApps = function (request, response, AuthId, OrgId, applicationName, callback) {
  // Build the post string from an object
  
  var post_data = JSON.stringify({
      /*'username' : request.body.username,*/
	  'username' : request.body.username,
      'password': request.body.password
  });
  
  
  // An object of options to indicate where to post to
  var post_options = {
      host: 'anypoint.mulesoft.com',
      port: '443',
      path: '/apiplatform/repository/v2/organizations/'+ OrgId + '/applications/',
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
		  'Authorization':'Bearer ' + AuthId		  
      }
  };
  // Set up the request
  var post_req = http.request(post_options, function(res, err) {
	  if(err)
	  {
		  console.log(err);		  
	  }
		
	  else 
	  {
		  res.setEncoding('utf8');
		  res.on('data', function (chunk) {	
			body+= chunk;			
		  });
		  
		  res.on('end', function(){			  
			return callback(JSON.parse(body));
		  });
	  }
  });   
	post_req.end();
	
  // post the data

}

