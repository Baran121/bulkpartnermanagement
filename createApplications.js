var http = require('https');
var body = '';
exports.createApplications = function (request, response, AuthId, userId, OrgId, appName, callback) {
  // Build the post string from an object
  
  var post_data = JSON.stringify({
      /*'username' : request.body.username,*/
	  'name' : appName,
      'ownerId':userId,
	  'parentOrganizationId':OrgId,
	  'grantTypes':[
		'refresh_token',
		'client_credentials',
		'password'
	  ]
  });
  
  
  // An object of options to indicate where to post to
  var post_options = {
      host: 'anypoint.mulesoft.com',
      port: '443',
      path: '/apiplatform/repository/v2/organizations/'+ OrgId +'/applications',
      method: 'POST',
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
    post_req.write(post_data);  		
	post_req.end();
	
  // post the data

}

