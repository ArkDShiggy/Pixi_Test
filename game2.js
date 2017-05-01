
function Default() { //Dimensions
	throw new Error('This is a static class');
}
Default._width = 150
Default._height = 150
Default._cellSize = 8
Default._cellBorder = 1
Default._xOffset = 24
Default._yOffset = 8
Default._uiOffset = 32

function Colors() {
	throw new Error('This is a static class');
}

Colors._backgroundColor = 0xF0F0F0
Colors._borderColor = 0x000000
Colors._livingColor = 0x009900
Colors._deadColor = 0xffff99

function SceneManager() {
	throw new Error('This is a static class');
}

SceneManager._stage = null
SceneManager._renderer = null
SceneManager._scene = null

SceneManager.start = function(){
	SceneManager._stage = new PIXI.Container();
	SceneManager._renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
	document.body.appendChild(SceneManager._renderer.view);
	SceneManager._scene = new Scene_Game();
	SceneManager.load_images()
}

SceneManager.end = function() {
	SceneManager._scene.end_scene();
	document.body.removeChild(SceneManager._renderer.view);
	SceneManager._renderer.plugins.interaction.destroy();
	SceneManager._renderer = null;
	SceneManager._stage.destroy(true);
	SceneManager._stage = null;
			
}

SceneManager.basic_update = function()
{
	if (SceneManager.scene_changing() == false) {
		requestAnimationFrame(SceneManager.basic_update);
		SceneManager._scene.update();
		SceneManager._renderer.render(SceneManager._stage)
		Mouse.update()
	} else {
		SceneManager.end();
	}
}

SceneManager.scene_changing = function() {
		return false;
}

SceneManager.load_images = function() {
	var list = SceneManager._scene.image_list()
	if (list.length > 0) {
		for (var i = 0; i < list.length; i++) {
			if (!(PIXI.loader.resources[list[i]])) {
				PIXI.loader.add(list[i])
			}
		}
		PIXI.loader.load(SceneManager.run)
	} else {
		SceneManager.run()
	}
}

SceneManager.run = function() {
	SceneManager._scene.start_scene()
	SceneManager.basic_update()
}

SceneManager.addChild = function(element) {
	if (SceneManager._scene._container) {
		SceneManager._scene._container.addChild(element)
	} else {
		SceneManager._stage.addChild(element)
	}
}

function Scene_Base() {
	this.initialize.apply(this, arguments);
}

Scene_Base.prototype = Object.create(Object)
Scene_Base.prototype.constructor = Scene_Base;

Scene_Base.prototype.image_list = function() {return []};
Scene_Base.prototype.start_scene = function() {};
Scene_Base.prototype.update = function() {};
Scene_Base.prototype.end_scene = function() {};
Scene_Base.prototype.scene_changing = function() {return false};

Scene_Base.prototype.initialize = function() {
}

Scene_Base.prototype.scene_main = function() {
	console.log(this);
	this.start_scene()
	this.basic_update()
};

function Scene_Game() {
	this.initialize.apply(this, arguments);
	console.log("test");
}

Scene_Game.prototype = Object.create(Scene_Base.prototype);
Scene_Game.prototype.constructor = Scene_Game;

Scene_Game.prototype.image_list = function() {
	var list = [
//		"Images/shy_guy.png",
//		"Images/cat.png"
	];
	return list
};

Scene_Game.prototype.start_scene = function() {
	var s = window.innerWidth/Default._width;
	if (s > window.innerHeight/Default._height) {
		s = window.innerHeight/Default._height;
	}
	this._scale = s;
	this.create_background();
	this.create_container();
	this.create_UI();
	SceneManager._stage.addChild(this._container);

};

Scene_Game.prototype.create_UI = function() {
	this._UI = new PIXI.Container
	this._UI.x = Math.round((window.innerWidth - Default._width * this._scale)/2)
	this._UI.y = 0
	this._buttons = []
	var y = (Default._height - Default._uiOffset) * this._scale;
	var rect = new PIXI.Rectangle(32 * this._scale, y, 16 * this._scale, 8 * this._scale);
	this._buttons.push(new Game_Button(rect, 0xFF0000, this.play_once));
	SceneManager._stage.addChild(this._UI);
}

Scene_Game.prototype.create_container = function() {
	this._container = new PIXI.Container;
	this._container.x = Math.round((window.innerWidth - Default._width * this._scale)/2)
	this._container.x += Default._xOffset * this._scale
	this._container.y = Default._yOffset * this._scale
	this._rect = new PIXI.Rectangle(this._container.x,
		this._container.y, Default._width * this._scale, Default._height * this._scale)
	this.create_cells();
}

Scene_Game.prototype.create_cells = function() {
	this._cells = [];
	var size = (Default._cellSize - Default._cellBorder) * this._scale
	for (i = 0; i < 15; i++) {
		for (j = 0; j < 15; j++) {
			this._cells.push(new Game_Cell(i * size,j * size, this._scale));
		}
	}
}

Scene_Game.prototype.create_background = function() {
	this._background = new PIXI.Graphics;
	this._background.beginFill(Colors._backgroundColor);
	this._background.drawRect(0, 0, window.innerWidth, window.innerHeight)
	this._background.endFill();
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
	if (Mouse._mouseDown ) {
		if (this._rect.contains(Mouse._downX, Mouse._downY)) {
			var i = Math.floor((Mouse._downX - this._rect.x) / size);
			var j = Math.floor((Mouse._downY - this._rect.y) / size);
			if ((i >= 0 && i <= 14) && (j >= 0 && j <= 14)) {
				this._cells[i * 15 + j].change_state();
			}
		}
		for (var i = 0; i < this._buttons.length; i++) {
			var x = Mouse._downX - Math.round((window.innerWidth - Default._width * this._scale) / 2)
			if (this._buttons[i]._rect.contains(x, Mouse._downY)) {
				this._buttons[i]._callback.apply(this);
			}
		}
	}
};
