
Background = "Images/background.jpeg"
function Default() { //Dimensions
	throw new Error('This is a static class');
}
Default._width = 150
Default._height = 150
Default._cellSize = 8
Default._cellBorder = 1
Default._xOffset = 24
Default._yOffset = 8
Default._uiOffset = 24

function Colors() {
	throw new Error('This is a static class');
}

Colors._backgroundColor = 0xF0F0F0
Colors._borderColor = 0x000000
Colors._livingColor = 0x009900
Colors._deadColor = 0xffff99


function Scene_Game() {
	this.initialize.apply(this, arguments);
	console.log("test");
}

Scene_Game.prototype = Object.create(Scene_Base.prototype);
Scene_Game.prototype.constructor = Scene_Game;

Scene_Game.prototype.image_list = function() {
	var list = [

		Background

	];
	return list
};

Scene_Game.prototype.start_scene = function() {
	this.get_scale();
	this._timer = -1;
	this.create_background();
	this.create_container();
	this.create_UI();
	SceneManager._stage.addChild(this._container);

};

Scene_Game.prototype.create_UI = function() {
	this._UI = new PIXI.Container
	this._UI.x = Math.round((window.innerWidth - Default._width * this._scale)/2)
	this._buttons = []
	var y = (Default._height - Default._uiOffset) * this._scale;

	var rect = new PIXI.Rectangle(24 * this._scale, y, 16 * this._scale, 8 * this._scale);
	this._buttons.push(new Game_Button(rect, 0xFF0000, this.autoplay));
	SceneManager._stage.addChild(this._UI);
}

Scene_Game.prototype.create_container = function() {
	this._container = new PIXI.Container;
	this._container.x = Math.round((window.innerWidth - Default._width * this._scale)/2)
	this._container.x += Default._xOffset * this._scale
	this._container.y = Default._yOffset * this._scale
	this._rect = new PIXI.Rectangle(this._container.x,
		this._container.y, Default._width * this._scale, Default._height * this._scale)
	console.log(this._scale)
	this._container.scale = new PIXI.Point(this._scale, this._scale)
	this.create_cells();
}

Scene_Game.prototype.create_cells = function() {
	this._cells = [];
	var size = (Default._cellSize - Default._cellBorder) //* this._scale
	for (i = 0; i < 15; i++) {
		for (j = 0; j < 15; j++) {
			this._cells.push(new Game_Cell(i * size,j * size, 1/*this._scale*/));
		}
	}
}

Scene_Game.prototype.autoplay = function() {
	if (this._timer < 0) {
		this._timer = 0;
	} else {
		this._timer = -1;
	}

}

Scene_Game.prototype.create_background = function() {
	/*
	this._background = new PIXI.Graphics;
	this._background.beginFill(Colors._backgroundColor);
	this._background.drawRect(0, 0, window.innerWidth, window.innerHeight)
	this._background.endFill();
	*/
	var texture = PIXI.loader.resources[Background].texture
	this._background = new PIXI.Sprite(texture);
	this._background.x = window.innerWidth / 2 - texture.width / 2
	this._background.y = window.innerHeight / 2 - texture.height / 2
	SceneManager._stage.addChild(this._background)
}

Scene_Game.prototype.play_once = function() {
	console.log("play")
	var changes = [];
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {

			living_neighbors = 0;
			if (this.cell_state(i - 1, j - 1)) {living_neighbors += 1;};
			if (this.cell_state(i, j - 1)) {living_neighbors += 1;};
			if (this.cell_state(i - 1, j)) {living_neighbors += 1;};
			if (this.cell_state(i + 1, j)) {living_neighbors += 1;};
			if (this.cell_state(i, j + 1)) {living_neighbors += 1;};
			if (this.cell_state(i + 1, j - 1)) {living_neighbors += 1;};
			if (this.cell_state(i - 1, j + 1)) {living_neighbors += 1;};
			if (this.cell_state(i + 1, j + 1)) {living_neighbors += 1;};
			if (living_neighbors > 0) {
				string = String(i)
				string += " " + String(j)
				string += " " + String(living_neighbors)
			//	console.log(string)
			}
			if (this.cell_state(i, j)) {
				if (living_neighbors < 2 || living_neighbors > 3) {
					changes.push(i * 15 + j);
				}
			} else {
				if (living_neighbors == 3) {
					changes.push(i * 15 + j);
				}
			}
		}
	}
	for (var i = 0; i < changes.length; i++) {
		this._cells[changes[i]].change_state()
	}
}

Scene_Game.prototype.cell_state = function(i, j) {

	if (i >= 0 && i <= 14 && j >= 0 && j <= 14) {
		if (this._cells[i * 15 + j]._state == 1) {
			string = String(i)
			string += " " + String(j)
			//console.log(string)
			return true;
		}
	}
	return false;
}

Scene_Game.prototype.update = function() {
	var size = (Default._cellSize - Default._cellBorder) * this._scale
	if (this._timer == 20) {
		this._timer = 0;
		this.play_once();
	} else if (this._timer >= 0) {
		this._timer += 1;
	} else {
		if (Mouse._mouseDown ) {
			if (this._rect.contains(Mouse._downX, Mouse._downY)) {
				var i = Math.floor((Mouse._downX - this._rect.x) / size);
				var j = Math.floor((Mouse._downY - this._rect.y) / size);
				if ((i >= 0 && i <= 14) && (j >= 0 && j <= 14)) {
					this._cells[i * 15 + j].change_state();
					console.log(this._rect)
					console.log(this._cells[i * 15 + j]._sprite.click_zone())
					console.log(Mouse._downX)
				}
			}
		}
	}
	if (Mouse._mouseDown ) {
		for (var i = 0; i < this._buttons.length; i++) {
			var x = Mouse._downX - Math.round((window.innerWidth - Default._width * this._scale) / 2)
			if (this._buttons[i]._rect.contains(x, Mouse._downY)) {
				this._buttons[i]._callback.apply(this);
			}
		}
	}
};
