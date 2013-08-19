function Page() {
}

Page.prototype.init = function() {
  this.createReferences();
  this.bindElements();

  this.flowsyManager.goTo('initial');
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

