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
};

Graphs.prototype.update = function ( 
        gaudetCommits, 
        gaudetEmails,
        rbbCommits, 
        rbbEmails,
        wroweCommits, 
        wroweEmails,
        ndCommits, 
        ndEmails) {
            var self = this;

            self.weekdayGraph.highcharts().series[0].setData(self.generateDataPerWeekday(gaudetCommits));
            self.weekdayGraph.highcharts().series[1].setData(self.generateDataPerWeekday(gaudetEmails));
            self.weekdayGraph.highcharts().series[2].setData(self.generateDataPerWeekday(rbbCommits));
            self.weekdayGraph.highcharts().series[3].setData(self.generateDataPerWeekday(rbbEmails));
            self.weekdayGraph.highcharts().series[4].setData(self.generateDataPerWeekday(wroweCommits));
            self.weekdayGraph.highcharts().series[5].setData(self.generateDataPerWeekday(wroweEmails));
            self.weekdayGraph.highcharts().series[6].setData(self.generateDataPerWeekday(ndCommits));
            self.weekdayGraph.highcharts().series[7].setData(self.generateDataPerWeekday(ndEmails));

            self.timeoftheday.highcharts().series[0].setData(self.generateDataPerTimeOfTheDay(gaudetCommits));
            self.timeoftheday.highcharts().series[1].setData(self.generateDataPerTimeOfTheDay(gaudetEmails));	
            self.timeoftheday.highcharts().series[2].setData(self.generateDataPerTimeOfTheDay(rbbCommits));
            self.timeoftheday.highcharts().series[4].setData(self.generateDataPerTimeOfTheDay(rbbEmails));	
            self.timeoftheday.highcharts().series[4].setData(self.generateDataPerTimeOfTheDay(wroweCommits));
            self.timeoftheday.highcharts().series[5].setData(self.generateDataPerTimeOfTheDay(wroweEmails));	
            self.timeoftheday.highcharts().series[6].setData(self.generateDataPerTimeOfTheDay(ndCommits));
            self.timeoftheday.highcharts().series[7].setData(self.generateDataPerTimeOfTheDay(ndEmails));	

            self.time.highcharts().series[0].setData(self.generateDataPerTime(gaudetCommits));
            self.time.highcharts().series[1].setData(self.generateDataPerTime(gaudetEmails));
            self.time.highcharts().series[2].setData(self.generateDataPerTime(rbbCommits));
            self.time.highcharts().series[3].setData(self.generateDataPerTime(rbbEmails));
            self.time.highcharts().series[4].setData(self.generateDataPerTime(wroweCommits));
            self.time.highcharts().series[5].setData(self.generateDataPerTime(wroweEmails));
            self.time.highcharts().series[6].setData(self.generateDataPerTime(ndCommits));
            self.time.highcharts().series[7].setData(self.generateDataPerTime(ndEmails));
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

            if (fileExtension != "NotSpecified") {
                if (extensions[fileExtension] == undefined) {
                    extensions[fileExtension] = 0;
                } 

                extensions[fileExtension] = extensions[fileExtension] + 1;
            }
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
           colors: ["#f15c80", "#f15c80", "#90ed7d", "#90ed7d","#f7a35c", "#f7a35c", "#434348", "#434348"],
           exporting: {
               enabled: false
           },
           title: {
               text: 'Commits by Weekday',
               x: -430 //center
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
           series: [
           {
               name: 'Commits A',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "circle"
               }
           }, 
           {
               name: 'Emails A',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "triangle"
               }
           },
           {
               name: 'Commits B',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "circle"
               }
           },
           {
               name: 'Emails B',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "triangle"
               }
           },
           {
               name: 'Commits C',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "circle"
               }
           },
           {
               name: 'Emails C',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "triangle"
               }
           },
           {
               name: 'Commits D',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "circle"
               }
           },
           {
               name: 'Emails D',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "triangle"
               }
           }
    ]
    });
};

Graphs.prototype.createTimeOfTheDayGraph = function() {
    return $('#timeoftheday-graph').highcharts({
        chart: {width: $("#timeoftheday").width() - 30, height: $("#timeoftheday").height() },
           colors: ["#f15c80", "#f15c80", "#90ed7d", "#90ed7d","#f7a35c", "#f7a35c", "#434348", "#434348"],
           exporting: {
               enabled: false
           },
           title: {
               text: 'Time Of The Day',
               x: -430 //center
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
           series: [
           {
               name: 'Commits A',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "circle"
               }
           }, 
           {
               name: 'Emails A',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "triangle"
               }
           },
           {
               name: 'Commits B',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "circle"
               }
           },
           {
               name: 'Emails B',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "triangle"
               }
           },
           {
               name: 'Commits C',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "circle"
               }
           },
           {
               name: 'Emails C',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "triangle"
               }
           },
           {
               name: 'Commits D',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "circle"
               }
           },
           {
               name: 'Emails D',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "triangle"
               }
           }
    ]
    });
};

Graphs.prototype.createTimeGraph = function() {
    return $('#time-graph').highcharts({
        chart: {width: $("#time").width() - 30, height: $("#time").height() },
           colors: ["#f15c80", "#f15c80", "#90ed7d", "#90ed7d","#f7a35c", "#f7a35c", "#434348", "#434348"],
           exporting: {
               enabled: false
           },
           title: {
               text: 'By Time',
               x: -480//center
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
           series: [
           {
               name: 'Commits Dev A',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "circle"
               }
           }, 
           {
               name: 'Emails Dev A',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "triangle"
               }
           },
           {
               name: 'Commits Dev B',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "circle"
               }
           },
           {
               name: 'Emails Dev B',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "triangle"
               }
           },
           {
               name: 'Commits Dev C',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "circle"
               }
           },
           {
               name: 'Emails Dev C',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "triangle"
               }
           },
           {
               name: 'Commits Dev D',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "circle"
               }
           },
           {
               name: 'Emails Dev D',
               data: [0,0,0,0,0,0,0],
               marker: {
                   symbol: "triangle"
               }
           }
    ]
    });
};



