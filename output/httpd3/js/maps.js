function Maps() {
	var self = this;
	this.createReferences();
}

Maps.prototype.createReferences = function() {
	var self = this;

	var mapOptions = {
	    zoom: 2,
	    center: new google.maps.LatLng(17.978733,31.585693),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	self.commitMap = new google.maps.Map(document.getElementById('commit-map'), mapOptions);
	self.commitPointArray = new google.maps.MVCArray([]);
	self.commitHeatMap = new google.maps.visualization.HeatmapLayer({
		data: self.commitPointArray,
    	dissipation: true,
    	maxIntensity: 100
	});
	self.commitHeatMap.setMap(self.commitMap);

	self.emailMap = new google.maps.Map(document.getElementById('email-map'), mapOptions);
	self.emailPointArray = new google.maps.MVCArray([]);
	self.emailHeatMap = new google.maps.visualization.HeatmapLayer({
		data: self.emailPointArray,
    	dissipation: true,
    	maxIntensity: 100
	});
	self.emailHeatMap.setMap(self.emailMap);
};

Maps.prototype.update = function(commitData, emailData) {
	var self = this;

	var commit;
	self.commitPointArray.clear();
	for (var i = 0; i < commitData.length; i++) {
		commit = commitData[i];
		self.commitPointArray.push({
            location: new google.maps.LatLng(commit.lat,commit.lng), 
            weight: commit.value
        });
	};

	var email;
	self.emailPointArray.clear();
	for (var i = 0; i < emailData.length; i++) {
		email = emailData[i];
		self.emailPointArray.push({
            location: new google.maps.LatLng(email.lat,email.lng), 
            weight: email.value
        });
	};	
};