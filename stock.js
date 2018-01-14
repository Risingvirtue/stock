
var apiKey = 'WDY9UDH99K9I5MMI';
var output = 'compact';
var stockApp = angular.module('stockApp', []);
stockApp.controller('stockController', function($scope, $http){
	$scope.symbol = 'AMD'
	$scope.type = 'TIME_SERIES_INTRADAY';
	$scope.l = 'https://www.alphavantage.co/query?function=' + $scope.type + '&symbol=' + $scope.symbol + '&interval=1min&outputsize=' + output + '&apikey=' + apiKey;
	
	$scope.times = [];
	
	$http.get($scope.l).then(function(response) {
		$scope.response = response['data']['Time Series (1min)'];
		$scope.arr = convertInfo($scope.response);
		
	});
});
	//from google charts api
	google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Mon', 20, 28, 38, 45],
      ['Tue', 31, 38, 55, 66],
      ['Wed', 50, 55, 77, 80],
      ['Thu', 77, 77, 66, 50],
      ['Fri', 68, 66, 22, 15]
      // Treat first row as data as well.
    ], true);

    var options = {
        legend: 'none',
        candlestick: {
			fallingColor: { strokeWidth: 0, fill: '#a52714', stroke: '#a52714' }, // red
			risingColor: { strokeWidth: 0, fill: '#0f9d58', stroke: '#0f9d58' }   // green
			},
		series: {
			0:{color: 'green'},
			1:{color: 'red'}
		}
    };

    var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));

    chart.draw(data, options);
  }
  
function convertInfo(dict) {
	var keys = [];
	for (key in dict) {
		keys.push(key);
	}
	var arr = [];
	
	for (key of keys) {
		var tempDate = new Date(key);
		var hour = tempDate.getHours() + ':' + convertMin(tempDate.getMinutes());
		var o = key['1. open'];
		var high = key['2. high'];
		var low = key['3. low'];
		var c = key['4. close'];
		var info = [];
	}
}

function convertMin(min) {
	if (min == 0) {
		return '00';
	} else if (min < 10) {
		return '0' + min;
	} else {
		return '' + min;
	}
}