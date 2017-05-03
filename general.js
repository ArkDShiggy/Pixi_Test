PIXI.Container.prototype.real_scale_x = function() {
	if (this.parent) {
		return this.parent.real_scale_x() * this.scale.x
	}
	else {
		return this.scale.x
	}
}

PIXI.Container.prototype.real_scale_y = function() {
	if (this.parent) {
		return this.parent.real_scale_y() * this.scale.y
	}
	else {
		return this.scale.y
	}
}

PIXI.Container.prototype.refresh = function () {
	for (var i = 0; i < this.children.length; i++) {
        this.children[i].refresh;
    }
}

PIXI.Container.prototype.click_zone = function() {
	var point = this.toGlobal(new PIXI.Point(0, 0))
	return (new PIXI.Rectangle(point.x, point.y,
	 	this.width * this.real_scale_x(), this.height * this.real_scale_y()));
}

PIXI.Container.prototype.get_clicked = function() {
	if (this.click_zone().contains(Mouse._downX, Mouse._downY)) {
		return true
	} else {
		return false
	}
}

function SceneManager() {
	throw new Error('This is a static class');
}

SceneManager._stage = null
SceneManager._renderer = null
SceneManager._scene = null

SceneManager.start = function(){
	SceneManager._stage = new PIXI.Container();
	console.log(SceneManager._stage.x, SceneManager._stage.y)
	SceneManager._renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
	console.log(window.innerWidth, window.innerHeight)
	document.body.appendChild(SceneManager._renderer.view);
	SceneManager._scene = new Scene_Game();
	SceneManager.load_images()
}

SceneManager.end = function() {
	SceneManager._scene.end_scene();
	SceneManager._stage.destroy(true);
	SceneManager._renderer.plugins.interaction.destroy();
	SceneManager._renderer = null;

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
	if (list.length == 0) {
		console.log("empty_list")
		SceneManager.run()
	}
	for (var i = 0; i < list.length; i++) {
		if (!(PIXI.loader.resources[list[i]])) {
			PIXI.loader.add(list[i])
		}
	}
	PIXI.loader.load(SceneManager.run)
}

SceneManager.run = function() {
	console.log("run")
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

Scene_Base.prototype.get_scale = function() {
	console.log(window.innerWidth, window.innerHeight)
	var s = window.innerWidth/Default._width;
	if (s > window.innerHeight/Default._height) {
		s = window.innerHeight/Default._height;
	}
	console.log(s)
	this._scale = s;
}

Scene_Base.prototype.scene_main = function() {
	console.log(this);
	this.start_scene()
	this.basic_update()
};
