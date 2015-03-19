//var http = require('http');

var sameHandCost = 2;
var sameFingerCost = 4;
var sameKeyCost = 1;

var keyCost = {
	a: 0,
	b: 2,
	c: 1,
	d: 0,
	e: 1,
	f: 0,
	g: 1,
	h: 1,
	i: 1,
	j: 0,
	k: 0,
	l: 0,
	m: 1,
	n: 1,
	o: 1,
	p: 1,
	q: 2,
	r: 1,
	s: 0,
	t: 2,
	u: 1,
	v: 1,
	w: 1,
	x: 1,
	y: 2,
	z: 1,
	'-': 3
};

var hand = {
	a: 1,
	b: 1,
	c: 1,
	d: 1,
	e: 1,
	f: 1,
	g: 1,
	h: 2,
	i: 2,
	j: 2,
	k: 2,
	l: 2,
	m: 2,
	n: 2,
	o: 2,
	p: 2,
	q: 1,
	r: 1,
	s: 1,
	t: 1,
	u: 2,
	v: 1,
	w: 1,
	x: 1,
	y: 2,
	z: 1,
	'-': 2
};

var finger = {
	a: 1,
	b: 6,
	c: 3,
	d: 3,
	e: 3,
	f: 4,
	g: 4,
	h: 5,
	i: 6,
	j: 5,
	k: 5,
	l: 7,
	m: 5,
	n: 5,
	o: 7,
	p: 7,
	q: 2,
	r: 4,
	s: 2,
	t: 4,
	u: 5,
	v: 4,
	w: 2,
	x: 3,
	y: 5,
	z: 2,
	'-': 7
};

function calculateScore (word) {
	var letters = word.toLowerCase().split('');

	var letterCost = letters.reduce(function (score, letter) {
		return score + keyCost[letter];
	}, 0);

	var handCost = letters.reduce(function (score, letter, i) {
		if (hand[letter] === hand[letters[i+1]]) {
			return score + sameHandCost;
		} else {
			return score;
		}
	}, 0);

	var fingerCost = letters.reduce(function (score, letter, i) {
		if (letter === letters[i+1]) {
			return score + sameKeyCost;
		} else if (finger[letter] === finger[letters[i+1]]) {
			return score + sameFingerCost;
		} else {
			return score;
		}
	}, 0);

	var total = letterCost + handCost + fingerCost + Math.floor(word.length);

	return total;
}

// http.get('http://words.bighugelabs.com/api/2/3adad4676426edc5a0b3c7860bb4866c/service/json', function (res) {
// 	res.on('data', function (data) {
// 		data = JSON.parse(data.toString());

// 		var types = Object.keys(data);

// 		var results = [];

// 		types.forEach(function (type) {
// 			data[type].syn.filter(function (word) {
// 				return word.indexOf(' ') === -1;
// 			}).forEach(function (word) {
// 				var score = calculateScore(word);
// 				results.push({
// 					word: word,
// 					score: score
// 				});
// 			});
// 		});

// 		results.sort(function (a, b) {
// 			return a.score - b.score;
// 		});

// 		results.forEach(function (result) {
// 			console.log( result.score +' '+ result.word );
// 		});
// 	});
// });



var $input = $('#mr_input');
var $output = $('#mr_output');

var cache = {};

var latest;
function makeProcessData (word) {
	latest = word;
	return function (data) {
		console.log(data);

		if (word !== latest) {
			return;
		}

		var types = Object.keys(data);

		var results = [];

		types.forEach(function (type) {
			data[type].syn.filter(function (word) {
				return word.indexOf(' ') === -1;
			}).forEach(function (word) {
				var score = calculateScore(word);
				results.push({
					word: word,
					score: score
				});
			});
		});

		results.sort(function (a, b) {
			return a.score - b.score;
		});

		var strArray = results.map(function (result) {
			return '<li><a class="word" href="#'+result.word+'">'+result.word +'</a> <span class="score">'+ result.score +'</span></li>';
		});

		$output.html(strArray.join(''));
	};
}

function makeShowError(word) {
	latest = word;
	return function () {
		$output.html('<li>"'+word+'" not found</li>');
	};
}
function lookUp (word) {
	if (word.indexOf(' ') !== -1) {
		alert('no spaces!');
		return;
	}
	if (!cache[word]) {
		cache[word] = $.getJSON('http://words.bighugelabs.com/api/2/3adad4676426edc5a0b3c7860bb4866c/'+word+'/json');
	}
	cache[word].then(makeProcessData(word), makeShowError(word));
}

$input.on('keyup', function (event) {
	$output.html('');
	if (event.keyCode === 13) {
		var word = $input.val().trim();
		lookUp(word);
	}
});
$output.on('click', 'a', function (event) {
	var word = event.target.innerHTML;
	$input.val(word);
	lookUp(word);
	event.preventDefault();
});















