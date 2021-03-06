function InfoRetriever(startDate, endDate, source){
   
   this.count = 0;

   if (startDate != undefined && startDate != '') {
   	this.startDate = this.fromStringToDate(startDate, 'mm/dd/yyyy');
   } else {
   	this.startDate = this.fromStringToDate('1996-01-01', 'yyyy-mm-dd');	
   }
   
   if (endDate != undefined  && endDate != '') {
   	this.endDate = this.fromStringToDate(endDate, 'mm/dd/yyyy');
   } else {
   	this.endDate = this.fromStringToDate('2013-06-10', 'yyyy-mm-dd');	
   }   
   
   this.source = source;

   this.data = this.filterData(this.startDate, this.endDate);
   this.length = this.data.length;
}

InfoRetriever.prototype.getNextInterval = function () {      

   if (this.intervalStart == undefined && this.intervalEnd == undefined) {
      this.intervalStart = this.startDate;

      var copy = new Date();
      copy.setTime(this.startDate.getTime());
      this.intervalEnd = new Date(copy.setMonth(copy.getMonth()+1));
   } else {
      this.intervalStart = new Date(this.intervalStart.setMonth(this.intervalStart.getMonth()+1));	
      this.intervalEnd = new Date(this.intervalEnd.setMonth(this.intervalEnd.getMonth()+1));	
   }

   return {
   	start: this.intervalStart,
   	end: this.intervalEnd
   };
}

InfoRetriever.prototype.hasNext = function () {
	return this.intervalEnd < this.endDate || this.intervalEnd == undefined;
};

InfoRetriever.prototype.getNextPoints = function() {
	var self = this;

	var interval = self.getNextInterval();

	var data = self.filterData(interval.start, interval.end);
	this.count = this.count + data.length;

	return data;
};

InfoRetriever.prototype.filterData = function(startDate, endDate) {
	var self = this;

	var isBetweenInterval = function (item, index) {
		 var objDate = self.fromStringToDate(item.date, 'yyyy-mm-dd');

		 return objDate >= startDate && objDate < endDate;
	};

	var data = $.grep(this.source, isBetweenInterval);
	return data;
};

InfoRetriever.prototype.fromStringToDate = function(string,format) {
	if (format == 'mm/dd/yyyy') {
      var array = string.split('/');
		return new Date(array[2],array[0]-1, array[1]);
	} else if (format == 'yyyy-mm-dd') {
      var array = string.split('-');
		return new Date(array[0], array[1]-1, array[2]);
	}
};

InfoRetriever.prototype.getCompleteProgress = function() {   
	if (this.length == 0) {
      return 100;
   }

   var progress = this.count * 100 / this.length;
	var rounded_progress = Math.round(progress * 100) / 100;

	return rounded_progress;
};

