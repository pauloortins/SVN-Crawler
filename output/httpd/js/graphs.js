function Graphs() {
	this.createReferences();
	this.setDraggable();
}

Graphs.prototype.setDraggable = function() {
  $(".draggable").draggable({ containment: "#graph-container"});
}

Graphs.prototype.createReferences = function() {
	this.weekdayGraph = this.createWeekdayGraph();

    this.timeoftheday = this.createTimeOfTheDayGraph();

    this.time = this.createTimeGraph();
};

Graphs.prototype.update = function (commitData, emailData) {
	var self = this;

	self.weekdayGraph.highcharts().series[0].setData(self.generateDataPerWeekday(commitData));
	self.weekdayGraph.highcharts().series[1].setData(self.generateDataPerWeekday(emailData));

	self.timeoftheday.highcharts().series[0].setData(self.generateDataPerTimeOfTheDay(commitData));
	self.timeoftheday.highcharts().series[1].setData(self.generateDataPerTimeOfTheDay(emailData));	

	self.time.highcharts().series[0].setData(self.generateDataPerTime(commitData));
	self.time.highcharts().series[1].setData(self.generateDataPerTime(emailData));
};

Graphs.prototype.generateDataPerWeekday = function(data) {
	var weekdayData = [0,0,0,0,0,0,0];

	var unit;
	for (var i = 0; i < data.length; i++) {
		unit = data[i];
		weekdayData[unit.weekday] = weekdayData[unit.weekday] + 1;
	};

	return weekdayData;
};

Graphs.prototype.generateDataPerTimeOfTheDay = function(data) {
	var timeOfTheDayData = [0,0,0,0,0,0,0,0,0,0,0,0];
	var hour;
	
	for (var i = 0; i < data.length; i++) {
		unit = data[i];
		hour = unit.time[0] + "" + unit.time[1];
		var position = parseInt(hour/2);
		timeOfTheDayData[position] = timeOfTheDayData[position] + 1
	};

	return timeOfTheDayData;
};

Graphs.prototype.generateDataPerTime = function(data) {

	var toDate = function(string) {
		var array = string.split('-');
		return Date.UTC(array[0], array[1]-1, 1);
	};

	var getMonth = function(string) {
		var array = string.split('-');
		return array[0] + "-" + array[1];
	};

	var times = [];
	var date;
	var lastDate;
	var counter = 0;
	for (var i = 0; i < data.length; i++) {
		value = data[i].value;
		date = getMonth(data[i].date);

		if (lastDate == undefined || date == lastDate) {			
			counter += 1;
		} else {
			if (date != lastDate) {
				times.push([toDate(lastDate), counter]);
				counter = 1;
			}
		}

		if (i == data.length - 1) {
			times.push([toDate(date), counter]);
		}

		lastDate = date;		
	};

	return times;
};

Graphs.prototype.createWeekdayGraph = function() {
	return $('#weekday-graph').highcharts({
            chart: {width: $("#weekday").width() - 30, height: $("#weekday").height()},
            exporting: {
            	enabled: false
            },
            title: {
                text: 'Commits by Weekday',
                x: -70 //center
            },
            xAxis: {
                categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },
            yAxis: {
                title: {
                    text: ''
                },
                min: 0,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'top',
                borderWidth: 0,
                floating: true
            },
            series: [{
                name: 'Commit',
                data: [0,0,0,0,0,0,0]
            }, {
                name: 'Email',
                data: [0,0,0,0,0,0,0]
            }]
        });
};

Graphs.prototype.createTimeOfTheDayGraph = function() {
	return $('#timeoftheday-graph').highcharts({
            chart: {width: $("#timeoftheday").width() - 30, height: $("#timeoftheday").height() },
            exporting: {
            	enabled: false
            },
            title: {
                text: 'Time Of The Day',
                x: -70 //center
            },
            xAxis: {
                categories: ['12am', '2am', '4am', '6am', '8am', '10am',
                    '12pm', '2pm', '4pm', '6pm', '8pm', '10pm']
            },
            yAxis: {
                title: {
                    text: ''
                },
                min: 0,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'top',
                borderWidth: 0,
                floating: true
            },
            series: [{
                name: 'Commit',
                data: [0,0,0,0,0,0,0,0,0,0,0,0]
            }, {
                name: 'Email',
                data: [0,0,0,0,0,0,0,0,0,0,0,0]
            }]
        });
};

Graphs.prototype.createTimeGraph = function() {
	return $('#time-graph').highcharts({
            chart: {width: $("#time").width() - 30, height: $("#time").height() },
            exporting: {
            	enabled: false
            },
            title: {
                text: 'By Time',
                x: -60 //center
            },
            xAxis: {
            	type: 'datetime'
            },
            yAxis: {
            	title: {
                    text: ''
                },
                min: 0,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'top',
                borderWidth: 0,
                floating: true
            },
            series: [{
                name: 'Commit',
                data: []
            }, {
                name: 'Email',
                data: []
            }]
        });
};

