var nmo		= require('nai-mysql-onchange').init({
	host: "10.226.144.75",
	user: "gts",
	password: "opengts",
	database: "gts"
});
var request	= require('request');
var fs		= require('fs');

var send = function( row, type ){
	request.post({
		url: 'http://10.226.144.73/api/avl',
		form: {
			MyId: row.deviceID,
			Angle: row.lastValidHeading,
			Xcord: row.lastValidLatitude,
			Ycord: row.lastValidLongitude,
			SpeedByte: row.lastValidSpeedKPH,
			_MyDateTime: new Date( row.lastGPSTimestamp * 1000 )
		}
	});
}
var log = function( row, type ){
	var str = ('record = ' + row.deviceID + ' , event = ' + type + ' , time = ' + new Date().toJSON());
	//fs.appendFileSync('./log', str+'\n' );
	console.log( str );
}

nmo.watch({
	table: "Device",
	uniqueField: "deviceID",
	interval: 1000
}).onUpdate( function(row, oldRow){
	send(row, 'update');
	log(row, 'update');
}).onInsert( function(row){
	send(row, 'insert');
	log(row, 'insert');
}).onDelete( function(row){
	send(row, 'delete');
	log(row, 'delete');
});



