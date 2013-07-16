function HeatMap(mapId, progressBarId, progressLabelId, messagesId) {
	var self = this;

	var mapOptions = {
	    zoom: 2,
	    center: new google.maps.LatLng(17.978733,31.585693),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};

  	self.map = new google.maps.Map(document.getElementById(mapId), mapOptions);

  	self.pointArray = new google.maps.MVCArray([]);

	self.heatmap = new google.maps.visualization.HeatmapLayer({
		data: self.pointArray
	});

  	self.heatmap.setMap(self.map);

  	self.retriever = new InfoRetriever(undefined, undefined, new CommitRetriever().get());
  	self.commitMessages = document.getElementById(messagesId);  

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

HeatMap.prototype.start = function() {
	this.isShowingCommits = true;
  	this.addPoint();
};

HeatMap.prototype.addPoint = function() {
	var self = this;

    if (self.retriever.hasNext()) {
    	var commits = self.retriever.getNextPoints();

	    for (var i = 0; i < commits.length; i++) {

	      var commit = commits[i];

	      self.pointArray.push(new google.maps.LatLng(commit.lat,commit.lng), commit.value);     
	      
	      setTimeout(function() {
	        self.updateCommitMessage.call(self, commit);
	        self.progressBar.progressbar( "value", self.retriever.getCompleteProgress());
	      }, 1);  
	    }

		if (this.isShowingCommits) {
		    setTimeout(function() {
		      self.addPoint.call(self)
		    }, 10);    
		}
  }	
};

HeatMap.prototype.stop = function() {
	this.isShowingCommits = false;
};

HeatMap.prototype.updateCommitMessage = function (commit) {
   var self = this;
   self.commitMessages.innerHTML = '<br> <h2><strong>' + commit.date + '      #' + commit.commitNumber + '      ' + commit.name + '<strong><h2>';             
}

HeatMap.prototype.clear = function() {
	var self = this;

    self.stop.call(self);

    setTimeout(function() {
        self.retriever = new InfoRetriever(undefined, undefined, new CommitRetriever().get());
        self.pointArray.clear();
        self.commitMessages.innerHTML = '';
        self.progressBar.progressbar( "value", self.retriever.getCompleteProgress());
    }, 10);
}
