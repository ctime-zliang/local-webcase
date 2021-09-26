
(function( win ){
	var btn = document.querySelectorAll( '.ripple-effect' );
	for( var i = 0; i < btn.length; i++ ){
		btn[i].addEventListener('click', function( e ){
			ripple(e, this);
		}, null);
	}


	function ripple(event, $this){
		event = event || window.event;
	    // 获取鼠标位置
		var x = event.pageX || document.documentElement.scrollLeft + document.body.scrollLeft + event.clientX;
		var y = event.pageY || document.documentElement.scrollTop + document.body.scrollTop + event.clientY;
		var wx = $this.offsetWidth;

		x = x - $this.offsetLeft - wx / 2;
		y = y - $this.offsetTop - wx / 2;
		// 添加.ripple元素
		var ripple = document.createElement( 'span' );
		ripple.className = 'ripple';
		var firstChild = $this.firstChild;
		if( firstChild ){
			$this.insertBefore(ripple, firstChild);
		} else {
			$this.appendChild( ripple );
		};
		ripple.style.cssText = 'width: ' + wx + 'px;height: ' + wx + 'px;top: ' + y + 'px;left: ' + x + 'px';
		ripple.classList.add( 'rippleEffect' );
		//  监听动画结束，删除波纹元素
		// animationEnd(ripple, function(){
		// 	this.parentNode.removeChild(ripple);
		// });
	};
})( window );

