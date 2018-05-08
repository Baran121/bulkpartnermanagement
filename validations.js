exports.validate = function (req, response, callback) {	
var jsonData = '';
	try 
	{		
		jsonData = JSON.parse(req.body.applicationNames);		
		if(jsonData.applications == null || jsonData.apis == null)
		{
			return callback(false, null);
		}			
	}
	catch(err)
	{
		return callback(false, null);
	}
	return callback(true, jsonData);	
}