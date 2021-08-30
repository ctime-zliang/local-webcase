;(function() {
    function __resetFontSizeClac(){
		const _fontSize = document.documentElement.clientWidth / 3.75
		return _fontSize > 200 ? 200 : _fontSize
	}
	document.documentElement.style.fontSize = __resetFontSizeClac() + 'px'
	window.onresize = function() {
		document.documentElement.style.fontSize = __resetFontSizeClac() + 'px'
	}
})();