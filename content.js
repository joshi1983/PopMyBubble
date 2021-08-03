function getElements(cssSelector, text) {
	var result = [];
	var nodes = document.querySelectorAll(cssSelector);
	nodes.forEach(function(n) {
		if (typeof n.innerText === 'string' && n.innerText.indexOf(text) !== -1) {
			result.push(n);
		}
	});
	
	return result;
}

function getBubbleMatchScore(e) {
	var result = 0;
	var href = e.getAttribute('href');
	if (typeof href === 'string' && href.indexOf('/bubblebuilder') !== -1)
		result += 3;
	if (e.closest('[role="article"]') !== null)
		result += 0.5;
	if (e.closest('[data-visualcompletion]') !== null) {
		result++;
		if (e.closest('[data-visualcompletion="ignore-late-mutation"]') !== null)
			result++;
	}
	return result;
}

function getBubbleAdElements() {
	var bubbleElements = getElements("a[href]", "Bubble").map(function(e) {
		return {
			'e': e,
			'score': getBubbleMatchScore(e)
		};
	});
	var maxScore = Math.max(...bubbleElements.map(function(be) {
		return be.score;
	}));
	if (maxScore > 0 && bubbleElements.length > 1) {
		bubbleElements = bubbleElements.filter(function(be) {
			return be.score > 0;
		});
	}

	// sort elements by similarity to current ad.
	bubbleElements.sort(function(be1, be2) {
		return be2.score - be1.score;
	});

	if (bubbleElements.length > 0)
		return bubbleElements.map((be)=>be.e);
	else
		return [];
}

function getPostRootElement(e) {
	var result = e.closest('[data-visualcompletion]');
	if (result !== null) {
		var result2 = e.closest('[data-visualcompletion="ignore-late-mutation"]');
		if (result2 !== null)
			return result2;
		else
			return result;
	}
	else {
		result = e.closest('[role="article"]');
		if (result !== null)
			return result;
		return e;
	}
}

function hideBubbleAds() {
	var bubbleAds = getBubbleAdElements();
	bubbleAds.forEach(function(e) {
		e = getPostRootElement(e);
		e.remove();
	});
}

console.log('content.js running.');
hideBubbleAds();
setInterval(hideBubbleAds, 3000);
