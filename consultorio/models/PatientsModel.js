/**
 * @author IsaiasSilva
 */

// The Patient Model

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var patientSchema = new Schema({
	_id : ObjectId,
	active : Boolean,
	firstname : String,
	lastname : String,
	birthdate : Date,
	email : String,
	phone : [{type : String, format : "phone"}],
	address : String,
	notes : { detail: { type : String } , date: { type : Date } },
	balance : { type : "number" } 
});

module.exports = mongoose.model('PatientModel', patientSchema , 'Patient');