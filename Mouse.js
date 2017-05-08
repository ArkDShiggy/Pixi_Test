function Mouse() {
	throw new Error('This is a static class');
}

Mouse._mouseDown = false;
Mouse._mouseUp = true;
Mouse._mouseClick = false;
Mouse._downX = null;
Mouse._downY = null;
Mouse._upX = null;
Mouse._upY = null;
Mouse._x = null;
Mouse._y = null;

Mouse.touch_event = function(event) {
	if (event instanceof TouchEvent) {

		event = event.changedTouches[0]
	}
	return event
}

Mouse.downHandler = function(true_event) {
	event = Mouse.touch_event(true_event)
	Mouse._mouseDown = true;
	Mouse._downX = event.clientX
	Mouse._downY = event.clientY
	console.log(Mouse._downX, Mouse._downY)
  	true_event.preventDefault();
};

Mouse.update = function() {
	Mouse._mouseDown = false;
	Mouse._mouseUp = false;
	Mouse._mouseClick = false;
}

Mouse.upHandler = function(true_event) {
	event = Mouse.touch_event(true_event)
	Mouse._mouseUp = true;
	Mouse._upX = event.clientX
	Mouse._upY = event.clientY
	true_event.preventDefault();
};

Mouse.moveHandler = function(true_event) {
	event = Mouse.touch_event(true_event)
	Mouse._x = event.clientX
	Mouse._y = event.clientY
	true_event.preventDefault();
}

window.addEventListener(
  "mousedown", Mouse.downHandler, false
);

window.addEventListener(
  "touchstart", Mouse.downHandler, false
);

window.addEventListener(
  "touchend", Mouse.upHandler, false
);

document.addEventListener(
  "touchmove", Mouse.moveHandler, false
);

window.addEventListener(
  "mouseup", Mouse.upHandler, false
);

document.addEventListener(
  "mousemove", Mouse.moveHandler, false
);
