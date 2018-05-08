var express = require('express');
var session = require('express-session');
var app = express();
var router = express.Router();
var path = require('path');
const bodyParser = require('body-parser');
var http = require('https');
var callvalidations= require('./validations.js')
var callLogin = require('./loginAP.js')
var getOrgId = require('./me.js')
var getAPIs = require('./fetchAPIs.js')
var createApplications = require('./createApplications.js')
var createContracts = require('./createContracts.js')
var getIndiApplicationName= require('./getIndiApplicationName.js')
var applicationId = ''
var successfulAPIs = []

var authId = '';

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'html');

var sess;


app.get('/home', function(request, response){
	sess = request.session;
	
	response.render('login.ejs', {successfulAPIs: successfulAPIs});
});


app.post('/home', function(req, res){	
	/* validate incoming json data */
	callvalidations.validate(req, res, function(validateStatus, jData){
		if(validateStatus == true)
		{			
			callLogin.loginAP(req, res, function(data){	
				/*res.render('./fetchAPIs.ejs', {title: data});	*/											
				getOrgId.getOrgId(	req, res, data.access_token,function(orgData){
					console.log('Logged in');
					/* create applications */				
					if(jData.applications != null)
					jData.applications.forEach(function(applicationName)
					{
						getIndiApplicationName.getApps(req, res, data.access_token, orgData.user.organization.id, applicationName, function(application){	
						if(application.applications != null)
						application.applications.forEach(function(apps){								
								if(apps.name == applicationName)
								{
										applicationId = apps.id;
										console.log(applicationId);
								}								
						});
						if(applicationId == '')
						{
							createApplications.createApplications(req, res, data.access_token, orgData.user.id, orgData.user.organization.id, applicationName, function(appCreatestatus){
							applicationId = appCreatestatus.id;								
							console.log('Application Created Successfully');
							});
						}
						/* get apis*/
						getAPIs.getApis(req, res, data.access_token, orgData.user.organization.id, function(apis){								
							/* loop apis */
							if(apis.total > 0)
							{
								console.log('Got APIs list');
								apis.apis.forEach(function(apiElement)
								{								
									/* loop api versions*/
									apiElement.versions.forEach(function(verElement)
									{										
										if(verElement != null)
										{
											jData.apis.forEach(function(apiName)
											{															
																								
												if(apiName == verElement.assetId && verElement.name.indexOf(jData.environment) != -1)
												{
													/* create permissions or contracts */																										
													createContracts.createContracts(req, res, data.access_token, orgData.user.id, orgData.user.organization.id, applicationId, verElement.id, 
													function(contractCreatestatus){		
														console.log('Creating Contracts...:' + apiName);															
														successfulAPIs.push(apiName);													
													});
												}												
											});
										}										
									});
								});
							}
							else 
							{
								console.log("There is no API available");
							}							
							res.render('login.ejs', {successfulAPIs: successfulAPIs});					
							res.end();

						});							
						
						});																	
					});
				});									

			});
		}
		else 
		{
			console.log("Please enter valid json data");
		}				
	});			
	});

app.listen(9009);
console.log('listening 9009');