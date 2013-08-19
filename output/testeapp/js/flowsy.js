function Flowsy(options) {
	this.states = options;
	this.currentState = this.states[0];
}

Flowsy.prototype.goTo = function(state) {
	this.currentState = this.states[state];
	this.currentState.action();
};

Function.prototype.bind = function(scope) {
  var _function = this;
  
  return function() {
    return _function.apply(scope, arguments);
  }
};