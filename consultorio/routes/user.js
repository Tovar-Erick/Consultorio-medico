
/*
 * GET users listing.
 */
 
 // loads model file and engine
var userModel = require('../models/UsersModel'),
    utils = require('../models/utils'),
	ObjectId = require('mongoose').Types.ObjectId,
	_ = require('underscore')
	;



exports.list = function(req, res){
	query = userModel.find({});
	if (req.query)
		_.each(req.query , function (value, key){
			query.where(key).equals(value);
		});
	query.exec(function(err, rawUsers){
		if (!err){
	    	var blackList = ['password' , 'salt'];
	    	var users = [];
	    	_.each(rawUsers,function(currentUser){
	    		users.push(_.omit(currentUser.toObject(), blackList));
	    	}); 	
	        res.json({
	        	users : users
	        });
        }else{
    		res.json({
    			success : false,
  				message : "Couldn't retrieve user's list"
    		});
    		}
    });
};

exports.get = function(req,res){
	var id = req.params.id;
	var blackList = ['password' , 'salt'];
	userModel.findOne({_id : new ObjectId(id)} , function(err , user){
		if (!user)
			res.json({
				error : true,
				message : "User Not Found"
			});
		else{
			
			res.json({
				user : _.omit(user.toObject(),blackList)
			})
		}
	});
};

exports.update = function(req,res){
	var id = req.params.id;
	userModel.findOne({ _id : new ObjectId(id) }, function(err,user){
		if(user){
			var newval = req.body;
			user.username = newval.username || user.username;
			user.firstname = newval.firstname || user.firstname;
			user.lastname = newval.lastname || user.lastname;
			user.birthdate = newval.birthdate || user.birthdate;
			user.email = newval.email || user.email;
			user.phone = newval.phone || user.phone;
			user.address = newval.address || user.address;
			user.roles = newval.roles || user.roles;
			user.schedule = newval.schedule || user.schedule;
			if(newval.password){
				  var salt = utils.createSalt();
				  user.salt = salt;
				  var pass = utils.hash(newval.password , user.salt);
				  user.password = pass;
			}
						
			user.save(function(err){
				if(!err){
					res.json({
						success : true,
						message : "User was updated"
					});
				} else {
					res.json({
						success : false,
						message : "Can't update the specified user"
					});
				}
			});
		} else { 
			res.json({
				success : true,
				message : "User Not Found"
			});
		}
	});
};

exports.delete = function(req,res){
	var id = req.params.id;
	userModel.findOne({ _id : new ObjectId(id) }, function(err,user){
		if(user){
			userModel.remove({ _id : new ObjectId(id)}, function(err){
				if(!err){
					res.json({
						success : true,
						message : "User was removed"
					});
				} else {
					res.json({
						success : false,
						message : "Can't remove the specified user"
					});
				}
			})
		} else {
			res.json({
				success : true,
				message : "User Not Found"
			});
		}
	})
};


exports.add = function(req,res){
  //For now with this is enough
  user = new userModel(req.body);
  
  var salt = utils.createSalt();
  user.salt = salt;
  var pass = utils.hash(req.body.password , user.salt);
  user.password = pass;
  
  user.save(function (err) {
        messages = [];
        errors = [];
        if (!err){
            console.log('Success!');
			res.json({
				success : true,
				message : 'User Succesfully Added'
			});
        }
        else {
            console.log('Error !');
            console.log(err);
			res.json({
				success : false,
				message : 'Couldn\'t Add The User'
			});
        }
    });
};


