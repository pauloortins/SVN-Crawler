function Page() {
}

Page.prototype.init = function() {
  this.createReferences();
  this.bindElements();
  this.setDraggable();

  this.flowsyManager.goTo('initial');
}

Page.prototype.setDraggable = function() {
  var self = this;


  $(".draggable").draggable({ containment: "#graph-container"});

  // $("#weekday").resizable({
  //     stop: function() {
  //       $('#weekday-graph').highcharts().setSize($(this).width(), $(this).height());
  //     }
  //   });

  // $("#timeoftheday").resizable({
  //     stop: function() {
  //       $('#timeoftheday-graph').highcharts().setSize($(this).width(), $(this).height());
  //     }
  // });

  // $("#time").resizable({
  //     stop: function() {
  //       $('#time-graph').highcharts().setSize($(this).width(), $(this).height());
  //     }
  // });
}

Page.prototype.createReferences = function () {
  var self = this;

  this.commitMap = new HeatMap('commit-map', 'commit-progressbar', 'commit-progress-label', CommitRetriever);  
  this.emailMap = new HeatMap('email-map', 'email-progressbar', 'email-progress-label', EmailRetriever);  
  this.flowsyManager = new Flowsy({
      'initial': {action: self.initial.bind(self), 'play': 'playing'},
      'playing': {action: self.playing.bind(self), 'stop': 'stopped'},
      'stopped': {action: self.stopped.bind(self), 'play': 'playing', 'clear': 'initial'}
  });

  this.weekdayGraph = $('#weekday-graph').highcharts({
            chart: {width: $("#weekday").width() - 30, height: $("#weekday").height()},
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        });

    this.timeoftheday = $('#timeoftheday-graph').highcharts({
            chart: {width: $("#timeoftheday").width() - 30, height: $("#timeoftheday").height() },
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        });

    this.time = $('#time-graph').highcharts({
            chart: {width: $("#time").width() - 30, height: $("#time").height() },
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        });
}

Page.prototype.bindElements = function() {
  var self = this;

  this.btnStart = $("#btnStart").click(function () {
    self.start.call(self);
  });

  this.btnStop = $("#btnStop").click(function () {
    self.stop.call(self);
  });

  this.btnClear = $("#btnClear").click(function () {
    self.clear.call(self);
  });

  this.cmbStartDate = $("#cmbStartDate");
  this.cmbEndDate = $("#cmbEndDate");
}

Page.prototype.start = function() {
  this.flowsyManager.goTo('playing');
}

Page.prototype.stop = function() {
  this.flowsyManager.goTo('stopped');
}

Page.prototype.clear = function() {
  this.flowsyManager.goTo('initial');
}

Page.prototype.initial = function () {
  this.commitMap.clear();
  this.emailMap.clear();
  this.btnStart.removeAttr('disabled');
  this.btnStop.prop('disabled', true);
  this.btnClear.prop('disabled', true);
  $(this.txtStartDate).datepicker('enable');
  $(this.txtEndDate).datepicker('enable');
}

Page.prototype.playing = function () {
  this.commitMap.start('01/01/' + this.cmbStartDate.val(), '12/31/' + this.cmbEndDate.val());
  this.emailMap.start('01/01/' + this.cmbStartDate.val(), '12/31/' + this.cmbEndDate.val());
  this.btnStart.prop('disabled', true);
  this.btnStop.removeAttr('disabled');
  this.btnClear.prop('disabled', true);
  $(this.txtStartDate).datepicker('disable');
  $(this.txtEndDate).datepicker('disable');
}

Page.prototype.stopped = function () {
  this.commitMap.stop();
  this.emailMap.stop();
  this.btnStart.removeAttr('disabled');
  this.btnStop.prop('disabled', true);
  this.btnClear.removeAttr('disabled');
  $(this.txtStartDate).datepicker('disable');
  $(this.txtEndDate).datepicker('disable');
}

