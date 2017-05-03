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

Mouse.downHandler = function(event) {
	Mouse._mouseDown = true;
	Mouse._downX = event.clientX
	Mouse._downY = event.clientY
	console.log(Mouse._downX, Mouse._downY)
  	event.preventDefault();
};

Mouse.update = function() {
	Mouse._mouseDown = false;
	Mouse._mouseUp = false;
	Mouse._mouseClick = false;
}

Mouse.upHandler = function(event) {
	Mouse._mouseUp = true;
	Mouse._upX = event.clientX
	Mouse._upY = event.clientY
	event.preventDefault();
};

Mouse.moveHandler = function(event) {
	Mouse._x = event.clientX
	Mouse._y = event.clientY
	event.preventDefault();
}

window.addEventListener(
  "mousedown", Mouse.downHandler, false
);

window.addEventListener(
  "mouseup", Mouse.upHandler, false
);

document.addEventListener(
  "mousemove", Mouse.moveHandler, false
);
