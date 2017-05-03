Background = " Images/background2.jpg"

function Default() { //Dimensions
	throw new Error('This is a static class');
}

Default._width = 320
Default._height = 426

SceneManager.resize = function() {
	var new_renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
	document.body.removeChild(SceneManager._renderer.view);
	SceneManager._renderer.destroy();
	SceneManager._renderer = new_renderer
	document.body.appendChild(SceneManager._renderer.view);
	SceneManager._scene.resize();
}

window.addEventListener(
  "resize", SceneManager.resize, false
);



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
	this._activePiece = null;
	this._check_flag = false;
	this._squares = new Array(9);
	this.create_background();
	this.create_container();
	SceneManager._stage.addChild(this._container);
};

Scene_Game.prototype.create_background = function() {
	var texture = PIXI.loader.resources[Background].texture
	this._background = new PIXI.Sprite(texture);
	if (window.innerWidth < texture.width) {
		this._background.x = window.innerWidth / 2 - texture.width / 2
	} else {
		this._background.scale.x = window.innerWidth / texture.width
	}
	if (window.innerHeight < texture.height) {
		this._background.y = window.innerHeight / 2 - texture.height / 2
	} else {
		this._background.scale.y = window.innerHeight / texture.height
	}
	SceneManager._stage.addChild(this._background)
}

Scene_Game.prototype.resize = function() {
	SceneManager._stage.removeChild(this._background)
	this._background.destroy({children: true, texture: false, baseTexture: false});
	this.create_background();
	this.get_scale();
	this._container.x = window.innerWidth / 2 - Default._width * this._scale / 2
	this._container.y = window.innerHeight / 2 - Default._height * this._scale / 2
	this._container.scale = new PIXI.Point(this._scale, this._scale);
	SceneManager._stage.addChild(this._container)
}

Scene_Game.prototype.create_container = function() {
	this._container = new PIXI.Container;
	this._container.x = window.innerWidth / 2 - Default._width * this._scale / 2
	this._container.y = window.innerHeight / 2 - Default._height * this._scale / 2
	this._container.scale = new PIXI.Point(this._scale, this._scale)
	this.create_square_area();
	this.create_pieces()
}

Scene_Game.prototype.create_square_area = function() {
	this._squareArea = new PIXI.Graphics;
	console.log(this._squareArea)
	this._squareArea.beginFill(0x696969);
	this._squareArea.drawRect(0, 0, 170, 170)
	this._squareArea.endFill();
	this._squareArea.beginFill(0xd3d3d3);
	for (var i = 0; i < 9; i++) {
		this._squareArea.drawRect(5 + (i % 3) * 55, 5 + Math.floor(i / 3) * 55, 50, 50)
	}
	this._squareArea.x = 85;
	this._squareArea.y = 50;
	this._container.addChild(this._squareArea);
}

Scene_Game.prototype.create_pieces = function() {
	this._pieces = []
	this._default_area = new PIXI.Container;
	this._default_area.x = 85
	this._default_area.y = 250
	for (var i = 0; i < 9; i++) {
		piece = new Game_Piece(i, this._default_area) // i + 1 ?
		this._pieces.push(piece)
	}
	this._container.addChild(this._default_area)
}

Scene_Game.prototype.update_mouseDown = function() {
	for (var i = 0; i < 9; i++) {
		if (this._pieces[i]._sprite.get_clicked()) {
			this._activePiece = this._pieces[i];
			for (var j = 0; j < 9; j++) {
				if (this._squares[j] == i) {
					this._squares[j] = null;
				}
			}
			this._activePiece._sprite.parent.removeChild(this._activePiece._sprite);
			SceneManager._stage.addChild(this._activePiece._sprite);
			this._activePiece._sprite.scale = new PIXI.Point(this._scale, this._scale);
		}
	}
}

Scene_Game.prototype.update_mouseUp = function() {
	SceneManager._stage.removeChild(this._activePiece._sprite);
	if (this._squareArea.click_zone().contains(Mouse._upX, Mouse._upY)) {
		var x = (Mouse._upX - this._squareArea.click_zone().x) / this._scale;
		var y = (Mouse._upY - this._squareArea.click_zone().y) / this._scale;
		var index = Math.max(Math.floor((x - 5) / 55), 0);
		index += 3 * Math.max(Math.floor((y - 5) / 55), 0);
		var tmp = this._squares[index];
		if (tmp != null) {
			this._pieces[tmp].set_position(tmp, this._default_area)
		}
		this._activePiece.set_position(index, this._squareArea);
		this._squares[index] = this._activePiece._index;
		console.log(this._squares)
		this._check_flag = true;
	}
	else {
		this._activePiece.set_position(this._activePiece._index, this._default_area);
	}
	this._activePiece._sprite.scale = new PIXI.Point(1, 1);
	this._activePiece = null;
}

Scene_Game.prototype.update = function() {
	if (this._check_flag) {
		this.check_square();
		this._check_flag = false;
	}
	if (Mouse._mouseDown) {
		this.update_mouseDown();
	}
	if (Mouse._mouseUp && this._activePiece) {
		this.update_mouseUp();
	}
	if (this._activePiece) {
		this._activePiece._sprite.x = Mouse._x;
		this._activePiece._sprite.y = Mouse._y;
	}
}

Scene_Game.prototype.check_square = function() {
	for (var i = 0; i < 9; i++) {
		if (this._squares[i] == null) {
			return false
		}
	}
	var a = this._squares[2] + this._squares[4] + this._squares[6]
	if (a != (this._squares[0] + this._squares[4] + this._squares[8])) {
		return false
	}
	for (var i = 0; i < 3; i++) {
		var b = 0
		var c = 0;
		for (var j = 0; j < 3; j++) {
			b += this._squares[i * 3 + j];
			c += this._squares[j * 3 + i];
		}
		if (b != a || c != a)
			return false
	}
	alert("Well Done")
	return true
}

function Game_Piece(index, parent) {
	this._sprite = new PIXI.Graphics;
	this._sprite.beginFill(0x00cc00);
	this._sprite.drawRect(0, 0, 50, 50)
	this._sprite.endFill();
	this._index = index
	this._sprite.pivot = new PIXI.Point(25, 25)
	var text = new PIXI.Text(String(index + 1))
	text.pivot = new PIXI.Point(text.width / 2, text.height / 2)
	text.x = 25
	text.y = 25
	this._sprite.addChild(text);
	this.set_position(this._index, parent);
}

Game_Piece.prototype.set_position = function(index, parent)
{
	this._sprite.x = 30 + (index % 3) * 55;
	this._sprite.y = 30 + Math.floor(index / 3) * 55;
	if (this._sprite.parent != parent) {
		if (this._sprite.parent) {
			this._sprite.parent.removeChild(this._sprite)
		}
		parent.addChild(this._sprite);
	}
}
