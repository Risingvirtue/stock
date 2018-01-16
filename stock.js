
var apiKey = 'WDY9UDH99K9I5MMI';

var output = 'compact';
var i;
var smallInfo;
var index = 0;
var min = 10000;
var max = 0;
var stockApp = angular.module('stockApp', []);
stockApp.controller('stockController', function($scope, $http, $interval){
	$scope.symbols = ['AMD', 'ATHX', 'MGM', 'XNET']
	$scope.intervals = [1, 2, 3, 5]

	
	$scope.types = ['TIME_SERIES_INTRADAY', 'TIME_SERIES_DAILY'];
	$scope.l = 'https://www.alphavantage.co/query?function=' + $scope.type + '&symbol=' + $scope.symbol + '&interval=1min&outputsize=' + output + '&apikey=' + apiKey;
	$scope.total = 10000;
	$scope.original = 10000;
	$scope.shareTotal = 0;
	$scope.bought = {symbol: 'AMD', price: 0, quantity: 0};
	
	
	$scope.infoPressed = false;
	
	$scope.info = function() {
		$scope.infoPressed = true;
		if (typeof $scope.symbol !== 'undefined' || 
			typeof $scope.chartInterval !== 'undefined' ||
			typeof $scope.tickInterval !== 'undefined') {
				console.log($scope.symbol, $scope.chartInterval, $scope.tickInterval);
				$(".modal").css('display', 'none');
				//daily
				if (Math.floor($scope.chartInterval / 2) == 1) {
					$scope.type = $scope.types[1];
					$scope.l = 'https://www.alphavantage.co/query?function=' + $scope.type + '&symbol=' + $scope.symbol + '&outputsize=' + output + '&apikey=' + apiKey;
				//intraday
				} else {
					$scope.type = $scope.types[0];
					$scope.l = 'https://www.alphavantage.co/query?function=' + $scope.type + '&symbol=' + $scope.symbol + '&interval=' + $scope.chartInterval + '&outputsize=' + output + '&apikey=' + apiKey;
				}
			}	
	}
	
	
	$scope.buyShares = function() {
		$scope.buy = +$scope.buy;
		if ($scope.buy >= 0 && $scope.buy * $scope.price < $scope.total) {
			$scope.total -= $scope.buy * $scope.price;
			$scope.shareTotal += $scope.buy * $scope.price;
			$scope.bought.price = changeFill($scope.bought.price, $scope.bought.quantity, 
											$scope.price, $scope.buy);
			$scope.bought.quantity += $scope.buy;
			$scope.buy = "";
		}
	}
	
	$scope.sellShares = function() {
		$scope.sell = +$scope.sell;
		if ($scope.sell >= 0 && $scope.sell <= $scope.bought.quantity) {
			$scope.total += $scope.sell * $scope.price;
			$scope.shareTotal -= $scope.sell * $scope.bought.price;
			$scope.bought.quantity -= +$scope.sell;
			if ($scope.bought.quantity == 0) {
				$scope.bought.price = 0;
			}
			$scope.sell = "";
		}
	}
	
	function changeFill(f0, q0, f1, q1) {
		return (f0 * q0 + f1 * q1) / (q1 + q0);
	}
	
	/*
	$http.get($scope.l).then(function(response) {
		$scope.response = response['data']['Time Series (1min)'];
		i = convertInfo($scope.response);
		interval = $interval(update, 1000 * $scope.tickInterval);
		
	});
	
	*/
	
	
	
	function update() {
		smallInfo = i.slice(index, index + 20);
		$scope.price = smallInfo[smallInfo.length - 1][2];
		console.log($scope.price);
		if (index + 20 < 100) {
			index++;
		} else {
			$interval.cancel(interval);
		}
	
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawChart);
	}

});

$(document).ready(function(){
	fitToContainer();
});

$(window).resize(function() {
	fitToContainer();
});

function fitToContainer() {
	$('#chartDiv').css('height', Math.floor($(window).height()* 3 / 6));
};

//from google charts api
function drawChart() {
	var data = google.visualization.arrayToDataTable(smallInfo, true);

    var options = {
        legend: 'none',
        candlestick: {
			fallingColor: { strokeWidth: 0, fill: '#a52714', stroke: '#a52714' }, // red
			risingColor: { strokeWidth: 0, fill: '#0f9d58', stroke: '#0f9d58' }   // green
			},
		series: {
			0:{color: 'green'},
			1:{color: 'red'}
		},
		vAxis : {viewWindow: {min: min, max: max}, gridlines: {count: Math.floor(100* (max - min))}},
		chartArea:{width:'85%',height:'75%'},		
    };

    var chart = new google.visualization.CandlestickChart(document.getElementById('chartDiv'));

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
		var info = dict[key];
		var o = info['1. open'];
		var high = info['2. high'];
		var low = info['3. low'];
		var c = info['4. close'];
		var tempArr = [hour, +low, +o, +c, +high];
		arr.push(tempArr);
		changeMinMax(+low, +high);
	}
	return arr;
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

function changeMinMax(minimum, maximum) {
	if (minimum < min) {
		min = minimum;
	}
	if (maximum > max) {
		max = maximum;
	}
}
