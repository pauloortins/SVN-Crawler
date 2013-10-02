function InfoRetriever(source){
   this.data = source;
   this.snapshot = [];
}

InfoRetriever.prototype.filterData = function(startDate, endDate, developer) {
	var self = this;

	var isBetweenInterval = function (item, index) {
		 var objDate = self.fromStringToDate(item.date, 'yyyy-mm-dd');

		 return objDate >= startDate && objDate < endDate && (developer == "ALL" || item.author == developer);
	};

	self.snapshot = $.grep(self.data, isBetweenInterval);
	return this.snapshot;
};

InfoRetriever.prototype.getSnapShot = function(string,format) {
   return this.snapshot;
}

InfoRetriever.prototype.fromStringToDate = function(string,format) {
	if (format == 'mm/dd/yyyy') {
      var array = string.split('/');
		return new Date(array[2],array[0]-1, array[1]);
	} else if (format == 'yyyy-mm-dd') {
      var array = string.split('-');
		return new Date(array[0], array[1]-1, array[2]);
	}
};

InfoRetriever.prototype.getCompletedProgress = function() {   
   if (this.data.length == 0) {
      return 100;
   }

   var progress = this.snapshot.length * 100 / this.data.length;
   var rounded_progress = Math.round(progress * 100) / 100;

   return rounded_progress;
};
