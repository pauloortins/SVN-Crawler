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
  self.maps = new Maps();
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

  var commitData = self.commitRetriever.filterData(minDate, maxDate, developer);
  var emailData = self.emailRetriever.filterData(minDate, maxDate, developer);

  $.blockUI();
  self.maps.update(commitData, emailData);
  self.graphs.update(commitData, emailData);
  self.commitProgressBar.progressbar( "value", self.commitRetriever.getCompletedProgress());
  self.emailProgressBar.progressbar( "value", self.emailRetriever.getCompletedProgress());
  if (refreshCombo) {
    self.updateCombo(commitData);
  }
  $.unblockUI();
};

Page.prototype.updateCombo = function(data) {
  
  var authors = [];
  var author;
  for (var i = 0; i < data.length; i++) {
    author = data[i].author;
    if (authors.indexOf(author) == -1) {
      authors.push(author);
    }
  };

  authors.sort();

  var cmbDevelopers = $("#cmbDevelopers");
  cmbDevelopers.empty();
  cmbDevelopers.append("<option value='ALL'>ALL</option>");

  for (var i = 0; i < authors.length; i++) {
    author = authors[i];
    cmbDevelopers.append("<option value='" + author + "'>" + author + "</option>");
  };
};

