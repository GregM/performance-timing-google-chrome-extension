(function() {

  /* Key for total loading time of page */
  var PAGE_LOAD_KEY = "totalTime";

  /* Global mutable variables used throughout */
  var precedingTime = pageLoadTotalTime = counter = 0;

  /* The data that will be displayed to the end user */
  /* At some point, share orderOfEvents and eval() on orderOfEvents.calculation */
  var orderOfEvents = [{
      'key': 'prerequestTime',
      'label': 'Pre-request',
      'calculation': 'performance.timing.requestStart - performance.timing.navigationStart'
    }, {
      'key': 'latencyTime',
      'label': 'Latency',
      'calculation': 'performance.timing.responseStart - performance.timing.requestStart'
    }, {
      'key': 'serverTime',
      'label': 'Server',
      'calculation': 'performance.timing.responseEnd - performance.timing.responseStart'
    }, {
      'key': 'domLoadingTime',
      'label': 'DOM Loading',
      'calculation': 'performance.timing.domInteractive - performance.timing.responseEnd'
    }, {
      'key': 'domCompleteTime',
      'label': 'DOM Complete',
      'calculation': 'performance.timing.domComplete - performance.timing.domInteractive'
    }, {
      'key': 'loadTime',
      'label': 'Load',
      'calculation': 'performance.timing.loadEventEnd - performance.timing.domComplete'
    }];


  chromeExtension = {

    /**
     * Generate everything.
     *
     * @private
     */
     generate: function () {

      chrome.tabs.executeScript(
        {
          file: 'performance.js'
        },
        function(result, isException) {
          if (isException) {
            //console.log("There was an error with counting elements on this page.");
          } else {
            pageLoadTotalTime = result[0][PAGE_LOAD_KEY];
            var dataParent = document.getElementsByClassName('data')[0];

            var node = chromeExtension.createRow(PAGE_LOAD_KEY, pageLoadTotalTime, 0, pageLoadTotalTime);
            dataParent.appendChild(node);

            chromeExtension.incrementCounter();

            for (var i in orderOfEvents) {
              var key = orderOfEvents[i].key;
              var time = result[0][key];
              var displayName = orderOfEvents[i].label;
              var dataRow = chromeExtension.createRow(displayName, time);

              dataParent.appendChild(dataRow);

              precedingTime = precedingTime + time;
              chromeExtension.incrementCounter();
            }
            chromeExtension.createRowMouseOverEvent();
          }
        }
      );
     },

    /**
     * Increments global counter
     *
     * @private
     */
     incrementCounter: function() {
      counter = counter + 1;
     },

    /**
     * Create a new row with the data passed through
     *
     * @param {String} key for performance api metric
     * @param {Number} value for performance api metric
     * @private
     */
     createRow: function (key, value) {
      var bar, clearfix, barCopy;

      var d = document.createElement('div');
      d.className = 'performance-row performance-row-' + counter + ' key-' + counter;

      var label = document.createElement('span');
      label.className = 'performance-label';
      label.textContent = key;

      var time = document.createElement('span');
      time.className = 'performance-time';
      time.textContent = value + " ms";

      bar = (key === PAGE_LOAD_KEY)  ? this.createGraphTotal() : this.createGraph(key, value, counter);
      if (document.getElementsByClassName('performance-graph-total')[0]) {
        barCopy = this.createChartData(value, counter);
        document.getElementsByClassName('performance-graph-total')[0].appendChild(barCopy);
      }

      d.appendChild(label);
      d.appendChild(bar);
      d.appendChild(time);

      clearfix = this.createClearfixDOMElement();
      d.appendChild(clearfix);
      return d;
     },

    /**
     * Create a new graph wrapper so that the totals can be passed through
     *
     * @private
     */
     createGraphTotal: function() {
      var g = document.createElement('div');
      g.className = 'performance-graph-total';
      return g;
     },

    /**
     * Create a new graph with the data passed through
     *
     * @param {String} DOM element name
     * @param {Number} current tally of milliseconds passed
     * @private
     */
     createGraph: function(key, value) {
      var g = document.createElement('span');
      g.className = 'performance-graph ' + key;

      var preTime = this.createPreChartSpacing(counter);
      var thisKeyTime = this.createChartData(value, counter);
      var clearfix = this.createClearfixDOMElement();

      g.appendChild(preTime);
      g.appendChild(thisKeyTime);
      g.appendChild(clearfix);

      return g;
     },

    /**
     * Create an the bar which is a percentage of its parent.
     *
     * @param {Number} value of the data point
     *
     * @private
     */
     createChartData: function(value) {
      var d = document.createElement('span');
      d.className = 'performance-graph-key key-' + counter;
      d.style.width = (value / pageLoadTotalTime * 100) + '%';
      return d;
     },

    /**
     * Create a pre DOM element and assign it to be a percentage
     * equal to everything that has been allocated so far.
     *
     * @private
     */
     createPreChartSpacing: function() {
      var d = document.createElement('span');
      d.className = 'performance-graph-pre key-' + counter;
      d.style.width = (precedingTime / pageLoadTotalTime * 100) + '%';
      return d;
     },

    /**
     * Create a clearfix DOM element
     *
     * @private
     */
     createClearfixDOMElement: function() {
      var c = document.createElement('span');
      c.className = 'clearfix';
      return c;
     },

    /**
     * Create an onmouseover event on each row
     *
     * @private
     */
     createRowMouseOverEvent: function() {
        var explanation = document.getElementsByClassName('explanation')[0];
        var preText = "Calc: ";
        for (var i = 1; i < (orderOfEvents.length + 1); i++) {
          document.getElementsByClassName('performance-row-' + i)[0].onmouseout= function() {
            explanation.innerHTML = ' ';
          };
        }
        document.getElementsByClassName('performance-row-1')[0].onmouseover = function() {
          explanation.innerHTML = preText + orderOfEvents[0].calculation;
        };
        document.getElementsByClassName('performance-row-2')[0].onmouseover = function() {
          explanation.innerHTML = preText + orderOfEvents[1].calculation;
        };
        document.getElementsByClassName('performance-row-3')[0].onmouseover = function() {
          explanation.innerHTML = preText + orderOfEvents[2].calculation;
        };
        document.getElementsByClassName('performance-row-4')[0].onmouseover = function() {
          explanation.innerHTML = preText + orderOfEvents[3].calculation;
        };
        document.getElementsByClassName('performance-row-5')[0].onmouseover = function() {
          explanation.innerHTML = preText + orderOfEvents[4].calculation;
        };
        document.getElementsByClassName('performance-row-6')[0].onmouseover = function() {
          explanation.innerHTML = preText + orderOfEvents[5].calculation;
        };
     },

     /**
      * Execute
      *
      */
     init: function () {
      chrome.tabs.executeScript(
        {
          file: 'onload-execute.js'
        },
        function(result, isException) {
          if (result) {
            chromeExtension.generate();
          } else {
            //console.log("There was an error retrieving Web Performing API Timing information");
          }
        });
     }

  }

  window.addEventListener("load", function load(event){
      window.removeEventListener("load", load, false);
      chromeExtension.init();
  },false);

})();