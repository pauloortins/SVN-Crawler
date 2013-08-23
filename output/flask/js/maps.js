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
};

Maps.prototype.update = function(commitData) {
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
};