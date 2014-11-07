(function() {
  var p = {};

  p.prerequestTime = performance.timing.requestStart - performance.timing.navigationStart;
  p.latencyTime = performance.timing.responseStart - performance.timing.requestStart;
  p.serverTime = performance.timing.responseEnd - performance.timing.responseStart;
  p.domLoadingTime = performance.timing.domInteractive - performance.timing.responseEnd;
  p.domCompleteTime = performance.timing.domComplete - performance.timing.domInteractive;
  p.loadTime = performance.timing.loadEventEnd - performance.timing.domComplete;

  // Test to make sure these two variables match.
  // p.onloadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  p.totalTime = p.prerequestTime + p.latencyTime + p.serverTime + p.domLoadingTime + p.domCompleteTime + p.loadTime;

  return p;
})();