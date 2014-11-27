function Page() {
}

Page.prototype.init = function() {
  this.createReferences();
}

Page.prototype.createReferences = function () {
  var self = this;

  self.commitRetriever = new InfoRetriever(new CommitRetriever().get());
  self.emailRetriever = new InfoRetriever(new EmailRetriever().get());
  self.graphs = new Graphs();
  self.slider = $("#slider").dateRangeSlider({
    bounds: {min: new Date(1995, 0, 1), max: new Date(2013, 11, 31, 12, 59, 59)}
  }).bind("userValuesChanged", function(e,data) {
    self.refreshData.call(self,true);
  });

  self.cmbDevelopers = $("#cmbDevelopers").change(function() {self.refreshData.call(self,false);});

  self.commitProgressLabel = $("#commit-progress-label");
  self.commitProgressBar = $("#commit-progressbar").progressbar({
    value: 0,
    change: function() {
      self.commitProgressLabel.text( self.commitProgressBar.progressbar( "value" ) + "%" );
    },
    complete: function() {
      self.commitProgressLabel.text( "Complete!" );
    }
  });

  self.emailProgressLabel = $("#email-progress-label");

  self.emailProgressBar = $("#email-progressbar").progressbar({
    value: 0,
    change: function() {
      self.emailProgressLabel.text( self.emailProgressBar.progressbar( "value" ) + "%" );
    },
    complete: function() {
      self.emailProgressLabel.text( "Complete!" );
    }
  });
}

Page.prototype.refreshData = function(refreshCombo) {
  var self = this;

  var minDate = $("#slider").dateRangeSlider("min");
  var maxDate = $("#slider").dateRangeSlider("max");
  var developer = $("#cmbDevelopers").val();

  var gaudetCommits = self.commitRetriever.filterData(minDate, maxDate, 'dgaudet');
  var gaudetEmails = self.emailRetriever.filterData(minDate, maxDate, 'dgaudet');
  var rbbCommits = self.commitRetriever.filterData(minDate, maxDate, 'rbb');
  var rbbEmails = self.emailRetriever.filterData(minDate, maxDate, 'rbb');
  var wroweCommits = self.commitRetriever.filterData(minDate, maxDate, 'wrowe');
  var wroweEmails = self.emailRetriever.filterData(minDate, maxDate, 'wrowe');
  var ndCommits = self.commitRetriever.filterData(minDate, maxDate, 'nd');
  var ndEmails = self.emailRetriever.filterData(minDate, maxDate, 'nd');

  $.blockUI();
  self.graphs.update(
          gaudetCommits, 
          gaudetEmails,
          rbbCommits, 
          rbbEmails,
          wroweCommits, 
          wroweEmails,
          ndCommits, 
          ndEmails
       );
  self.commitProgressBar.progressbar( "value", self.commitRetriever.getCompletedProgress());
  self.emailProgressBar.progressbar( "value", self.emailRetriever.getCompletedProgress());
  $.unblockUI();
};

