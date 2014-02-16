function Graphs() {
	this.createReferences();
	this.setDraggable();
}

Graphs.prototype.setDraggable = function() {
  //$(".draggable").draggable({ containment: "#graph-container"});
}

Graphs.prototype.createReferences = function() {
	this.weekdayGraph = this.createWeekdayGraph();
    this.timeoftheday = this.createTimeOfTheDayGraph();
    this.time = this.createTimeGraph();
    // this.fileTypeGraph = this.createFileTypeGraph();
};

Graphs.prototype.update = function (commitData, emailData) {
	var self = this;

	self.weekdayGraph.highcharts().series[0].setData(self.generateDataPerWeekday(commitData));
	self.weekdayGraph.highcharts().series[1].setData(self.generateDataPerWeekday(emailData));

	self.timeoftheday.highcharts().series[0].setData(self.generateDataPerTimeOfTheDay(commitData));
	self.timeoftheday.highcharts().series[1].setData(self.generateDataPerTimeOfTheDay(emailData));	

	self.time.highcharts().series[0].setData(self.generateDataPerTime(commitData));
	self.time.highcharts().series[1].setData(self.generateDataPerTime(emailData));

    self.createFileExtensionGraph(commitData);
};

Graphs.prototype.createFileExtensionGraph = function(commitData) {
    var self = this;

    // clear div
    $("#file-type-graph").empty();

    var extensionData = self.generateDataPerFileExtension(commitData);

    var files = {name: 'flare', children: extensionData};    
    var diameter = 500,
    format = d3.format(",d"),
    color = d3.scale.category20c();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("#file-type-graph").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

      var node = svg.selectAll(".node")
          .data(bubble.nodes(files)
          .filter(function(d) { return !d.children; }))
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      node.append("title")
          .text(function(d) { return d.className + ": " + format(d.value); });

      node.append("circle")
          .attr("r", function(d) { return d.r; })
          .style("fill", function(d) { return color(d.className); });

      node.append("text")
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .text(function(d) { return d.className.substring(0, d.r / 3); });

    d3.select(self.frameElement).style("height", diameter + "px");

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
		time = data[i].time.trim();
		hour = time[0] + "" + time[1];
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

Graphs.prototype.generateDataPerFileExtension = function(data) {
    var extensions = {};

    for (var i = 0; i < data.length; i++) {
        var commit = data[i];
        for (var j = 0; j < commit.paths.length; j++) {
            var fileExtension = this.getFileExtension(commit.paths[j]);

            if (extensions[fileExtension] == undefined) {
                extensions[fileExtension] = 0;
            } 

            extensions[fileExtension] = extensions[fileExtension] + 1;
        };
    }

    var extensionData = [];    

    for (var extension in extensions) {
        extensionData.push({className: extension, value: extensions[extension]});
    }

    return extensionData;
};

Graphs.prototype.getFileExtension = function(path) {
    var pieces = path.split('/');
    var fileName = pieces[pieces.length - 1];

    var filePieces = fileName.split('.');

    if (filePieces.length == 1) {
        return 'NotSpecified'
    } else {
        var extension = '';
        for (var i = 1; i < filePieces.length; i++) {
            extension += '.' + filePieces[i];
        };
        return extension;
    }
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

Graphs.prototype.createFileTypeGraph = function() {
    return $('#file-type-graph').highcharts({
            chart: {
                type: 'bar',
                width: $("#fileType").width() - 30,
                height: 2000
            },
            exporting: {
                enabled: false
            },
            title: {
                text: 'Commits by File Extension',
                x: -70 //center
            },
            xAxis: {
                categories: [],
                tickPixelInterval: 200
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
                name: 'File Extensions',
                data: []
            }]
        });
};

