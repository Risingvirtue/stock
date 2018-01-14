
var apiKey = 'WDY9UDH99K9I5MMI';

var output = 'compact';
var i;
var smallInfo;
var index = 0;
var min = 10000;
var max = 0;
var stockApp = angular.module('stockApp', []);
stockApp.controller('stockController', function($scope, $http, $interval){
	$scope.symbol = 'AMD'
	$scope.type = 'TIME_SERIES_INTRADAY';
	$scope.l = 'https://www.alphavantage.co/query?function=' + $scope.type + '&symbol=' + $scope.symbol + '&interval=1min&outputsize=' + output + '&apikey=' + apiKey;
	$scope.price = 0;
	$scope.profits = 10000;
	$scope.original = 10000;
	$scope.bought = {symbol: 'AMD', price: 10, quantity: 1000};
	
	$scope.buyShares = function() {
		console.log('hello');
	}
	/*
	$http.get($scope.l).then(function(response) {
		$scope.response = response['data']['Time Series (1min)'];
		i = convertInfo($scope.response);
		interval = $interval(update, 1000);
		
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
