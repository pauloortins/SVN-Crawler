function HeatMap(mapId, progressBarId, progressLabelId, source) {
	var self = this;

	var mapOptions = {
	    zoom: 2,
	    center: new google.maps.LatLng(17.978733,31.585693),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};

  self.map = new google.maps.Map(document.getElementById(mapId), mapOptions);

  self.pointArray = new google.maps.MVCArray([]);

	self.heatmap = new google.maps.visualization.HeatmapLayer({
		data: self.pointArray,
    dissipation: true,
    maxIntensity: 100
	});

  self.source = source;
  self.retriever = new InfoRetriever('', '', new source().get());

  self.heatmap.setMap(self.map);
  self.progressLabel = $("#" + progressLabelId);

	self.progressBar = $("#"+ progressBarId).progressbar({
    value: 0,
    change: function() {
      self.progressLabel.text( self.progressBar.progressbar( "value" ) + "%" );
    },
    complete: function() {
      self.progressLabel.text( "Complete!" );
    }
  });
}

HeatMap.prototype.start = function(startDate, endDate) {
  this.retriever = new InfoRetriever(startDate, endDate, new this.source().get());
	this.isShowingCommits = true;
  this.addPoint();
};

HeatMap.prototype.addPoint = function() {
	var self = this;

    if (self.retriever.hasNext()) {
    	var commits = self.retriever.getNextPoints();

	    for (var i = 0; i < commits.length; i++) {

	      var commit = commits[i];

        if (commit.lat != -1 && commit.lng != 1) {
  	      self.pointArray.push({
              location: new google.maps.LatLng(commit.lat,commit.lng), 
              weight: commit.value
            });     
        }
	      
	      setTimeout(function() {
	        self.progressBar.progressbar( "value", self.retriever.getCompleteProgress());
	      }, 10);  
	    }

  		if (this.isShowingCommits) {
  		    setTimeout(function() {
  		      self.addPoint.call(self)
  		    }, 10);    
  		}
    } else {
      setTimeout(function() {
        self.progressBar.progressbar( "value", self.retriever.getCompleteProgress());
      }, 10);
    } 	
};

HeatMap.prototype.stop = function() {
	this.isShowingCommits = false;
};

HeatMap.prototype.clear = function() {
	var self = this;

    self.stop.call(self);

    setTimeout(function() {      
        self.retriever = new InfoRetriever('', '', new self.source().get());  
        self.pointArray.clear();
        self.progressBar.progressbar( "value", self.retriever.getCompleteProgress());
    }, 10);
}
