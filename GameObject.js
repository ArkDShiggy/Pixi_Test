function Game_Object (name, rect) {
	this._texture = PIXI.loader.resources["Images/" + name].texture;
	if (rect) {
		this._frame = rect
		this._texture.frame = this._frame;
	}
	this._sprites = []
	this._sprites.push(new PIXI.Sprite(this._texture));
	SceneManager._stage.addChild(this._sprites[0]);
}

Game_Object.prototype.changeFrame = function(rect) {
	this._texture.frame = rect
}

Game_Object.prototype.translate = function(x, y) {
	for (var i = 0; i < this._sprites.length; i++) {
		this._sprites[i].x += x;
		this._sprites[i].y += y;
	}
}

Game_Object.prototype.setPos = function(x, y) {
	for (var i = 0; i < this._sprites.length; i++) {
		this._sprites[i].x = x;
		this._sprites[i].y = y;
	}
}

Game_Object.prototype.x = function() {
	return this._sprites[0].x
}

Game_Object.prototype.y = function() {
	return this._sprites[0].y
}

function Game_Cell (x, y, scale) {
	this._scale = scale;
	this.create_dead_sprite();
	this._x = x;
	this._y = y;
	this._sprite.x = x;
	this._sprite.y = y;
	this._scale = scale
	SceneManager.addChild(this._sprite);
	this._state = 0;
}

Game_Cell.prototype.create_dead_sprite = function() {
	this._sprite = new PIXI.Graphics;
	var size = Default._cellSize * this._scale;
	var border = Default._cellBorder * this._scale;
	this._sprite.beginFill(Colors._borderColor);
	this._sprite.drawRect(0, 0, size, size)
	this._sprite.endFill();
	this._sprite.beginFill(Colors._deadColor);
	this._sprite.drawRect(border, border, size - (border * 2), size - (border * 2))
	this._sprite.endFill();
}

Game_Cell.prototype.create_living_sprite = function() {
	this._sprite = new PIXI.Graphics;
	var size = Default._cellSize * this._scale;
	var border = Default._cellBorder * this._scale
	this._sprite.beginFill(Colors._borderColor);
	this._sprite.drawRect(0, 0, size, size)
	this._sprite.endFill();
	this._sprite.beginFill(Colors._livingColor);
	this._sprite.drawRect(border, border, size - (border * 2), size - (border * 2))
	this._sprite.endFill();
}

Game_Cell.prototype.change_state = function() {
	SceneManager._stage.removeChild(this._sprite);
	this._sprite.destroy(true);
	if (this._state == 0) {
		this._state = 1
		this.create_living_sprite()
	}
	else {
		this._state = 0
		this.create_dead_sprite()
	}
	this._sprite.x = this._x;
	this._sprite.y = this._y;
	SceneManager.addChild(this._sprite);
}

function Game_Button(rect, color, callback) {
	this._rect = rect;
	this._callback = callback;
	this._sprite = new PIXI.Graphics
	this._sprite.beginFill(color);
	this._sprite.drawRect(0, 0, rect.width, rect.height);
	this._sprite.endFill();
	this._sprite.x = rect.x;
	this._sprite.y = rect.y;
	SceneManager._scene._UI.addChild(this._sprite);
}

//Game_Button.prototype
