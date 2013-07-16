function Httpd() {
}

Httpd.prototype.init = function() {
  this.createReferences();
  this.bindElements();

  this.flowsyManager.goTo('initial');
}

Httpd.prototype.createReferences = function () {
  var self = this;

  this.commitMap = new HeatMap('commit-map', 'commit-progressbar', 'commit-progress-label', 'commit-messages', CommitRetriever);  
  this.emailMap = new HeatMap('email-map', 'email-progressbar', 'email-progress-label', 'email-messages', EmailRetriever);  
  this.flowsyManager = new Flowsy({
      'initial': {action: self.initial.bind(self), 'play': 'playing'},
      'playing': {action: self.playing.bind(self), 'stop': 'stopped'},
      'stopped': {action: self.stopped.bind(self), 'play': 'playing', 'clear': 'initial'}
  });
}

Httpd.prototype.bindElements = function() {
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

  this.txtStartDate = $("#txtStartDate").datepicker();
  this.txtEndDate = $("#txtEndDate").datepicker();

  this.btnEraseStartDate = $("#btnEraseStartDate").click(function () {    
    self.txtStartDate.val('');    
  });

  this.btnEraseStartDate = $("#btnEraseEndDate").click(function () {    
    self.txtEndDate.val('');
  });
}

Httpd.prototype.start = function() {
  this.flowsyManager.goTo('playing');
}

Httpd.prototype.stop = function() {
  this.flowsyManager.goTo('stopped');
}

Httpd.prototype.clear = function() {
  this.flowsyManager.goTo('initial');
}

Httpd.prototype.initial = function () {
  this.commitMap.clear();
  this.emailMap.clear();
  this.btnStart.removeAttr('disabled');
  this.btnStop.prop('disabled', true);
  this.btnClear.prop('disabled', true);
  $(this.txtStartDate).datepicker('enable');
  $(this.txtEndDate).datepicker('enable');
}

Httpd.prototype.playing = function () {
  this.commitMap.start(this.txtStartDate.val(), this.txtEndDate.val());
  this.emailMap.start(this.txtStartDate.val(), this.txtEndDate.val());
  this.btnStart.prop('disabled', true);
  this.btnStop.removeAttr('disabled');
  this.btnClear.prop('disabled', true);
  $(this.txtStartDate).datepicker('disable');
  $(this.txtEndDate).datepicker('disable');
}

Httpd.prototype.stopped = function () {
  this.commitMap.stop();
  this.emailMap.stop();
  this.btnStart.removeAttr('disabled');
  this.btnStop.prop('disabled', true);
  this.btnClear.removeAttr('disabled');
  $(this.txtStartDate).datepicker('disable');
  $(this.txtEndDate).datepicker('disable');
}

