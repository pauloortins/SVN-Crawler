function Httpd() {
   this.btnStart;
   this.isShowingCommits;
}

Httpd.prototype.init = function() {
  this.createReferences();
  this.bindElements();
}

Httpd.prototype.createReferences = function () {
  this.commitMap = new HeatMap('commit-map', 'commit-progressbar', 'commit-progress-label', 'commit-messages');  
  this.emailMap = new HeatMap('email-map', 'email-progressbar', 'email-progress-label', 'email-messages');  
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
  this.commitMap.start();
  this.emailMap.start();
}

Httpd.prototype.stop = function() {
  this.commitMap.stop();
  this.emailMap.stop();
}

Httpd.prototype.clear = function() {
  this.commitMap.clear();
  this.emailMap.clear();
}

