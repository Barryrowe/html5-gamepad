(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Gamepad = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var mappings = require("./mappings.json");

function getMapping(gamepadId, userAgent) {
	return mappings.filter(function(mapping) {
		return gamepadId.indexOf(mapping.id) !== -1 && userAgent.indexOf(mapping.userAgent) !== -1;
	})[0] || mappings[0];
}

function transformButton(mapping, gp, button, i) {
	var mb = mapping.buttons[i] || { name: "button " + i };
	gp.buttons[mb.name] = button.pressed;
	if (mb.axis) {
		if (button.pressed) {
			gp.axes[mb.axis] = mb.axisValue;
		} else if (gp.axes[mb.axis] === undefined) {
			gp.axes[mb.axis] = 0;
		}
	}
	return gp;
}

function scaleAxis(axis, scale) {
	if (scale === "to positive") {
		return (axis + 1.0) / 2.0;
	}
	if (scale === "to negative") {
		return (axis + 1.0) / -2.0;
	}
	return axis;
}

function transformAxis(mapping, threshold, gp, axis, i) {
	var ma = mapping.axes[i] || { name: "axis " + i };
	gp.axes[ma.name] = scaleAxis(axis, ma.scale);
	if (ma.buttons) {
		if (ma.buttons[0] !== null) {
			gp.buttons[ma.buttons[0]] = axis < -threshold;
		}
		if (ma.buttons[1] !== null) {
			gp.buttons[ma.buttons[1]] = axis > threshold;
		}
	}
	return gp;
}

function transformGamepad(threshold, gamepad) {
	var gp = {
		id: gamepad.id,
		buttons: {},
		axes: {}
	};
	var mapping = getMapping(gamepad.id, navigator.userAgent);
	gp = gamepad.buttons.reduce(transformButton.bind(undefined, mapping), gp),
	gp = gamepad.axes.reduce(transformAxis.bind(undefined, mapping, threshold), gp);
	return gp;
}

function isDefined(val) {
	return val !== undefined;
}

function Gamepad() {
	this.threshold = 0.001;
	this.gamepads = [];
}
Gamepad.prototype.update = function() {
	// navigator.getGamepads() returns an array-like object, not an actual object
	// so convert to an array so we can call map()
	//
	// WTF: webkit always returns 4 gamepads, so remove the undefined ones
	var gamepads = Array.prototype.slice.call(navigator.getGamepads()).filter(isDefined);
	this.gamepads = gamepads.map(transformGamepad.bind(undefined, this.threshold));
};
Gamepad.prototype.axis = function(gamepad, axis) {
	if (gamepad >= this.gamepads.length) {
		return 0;
	}
	return this.gamepads[gamepad].axes[axis];
};
Gamepad.prototype.count = function() {
	return this.gamepads.length;
}
Gamepad.prototype.button = function(gamepad, button) {
	if (gamepad >= this.gamepads.length) {
		return false;
	}
	return this.gamepads[gamepad].buttons[button];
};
Gamepad.prototype.name = function(gamepad) {
	if (gamepad >= this.gamepads.length) {
		return undefined;
	}
	return this.gamepads[gamepad].id;
};

module.exports = Gamepad;

},{"./mappings.json":2}],2:[function(require,module,exports){
module.exports=[
	{
		"id": "Logitech Gamepad F310",
		"userAgent": "Firefox",
		"buttons": [
			{
				"name": "a"
			},
			{
				"name": "b"
			},
			{
				"name": "x"
			},
			{
				"name": "y"
			},
			{
				"name": "left shoulder"
			},
			{
				"name": "right shoulder"
			},
			{
				"name": "back"
			},
			{
				"name": "start"
			},
			{
				"name": "home"
			},
			{
				"name": "left stick"
			},
			{
				"name": "right stick"
			},
		],
		"axes": [
			{
				"name": "left stick x",
				"buttons": [
					"left stick left",
					"left stick right",
				]
			},
			{
				"name": "left stick y",
				"buttons": [
					"left stick up",
					"left stick down",
				]
			},
			{
				"name": "left trigger",
				"scale": "to positive",
				"buttons": [
					null,
					"left trigger",
				]
			},
			{
				"name": "right stick x",
				"buttons": [
					"right stick left",
					"right stick right",
				]
			},
			{
				"name": "right stick y",
				"buttons": [
					"right stick up",
					"right stick down",
				]
			},
			{
				"name": "right trigger",
				"scale": "to positive",
				"buttons": [
					null,
					"right trigger",
				]
			},
			{
				"name": "dpad x",
				"buttons": [
					"dpad left",
					"dpad right",
				]
			},
			{
				"name": "dpad y",
				"buttons": [
					"dpad up",
					"dpad down",
				]
			}
		]
	},
	{
		"id": "Logitech Gamepad F310",
		"userAgent": "WebKit",
		"buttons": [
			{
				"name": "a"
			},
			{
				"name": "b"
			},
			{
				"name": "x"
			},
			{
				"name": "y"
			},
			{
				"name": "left shoulder"
			},
			{
				"name": "right shoulder"
			},
			{
				"name": "left trigger",
				"axis": "left trigger",
				"axisValue": 1
			},
			{
				"name": "right trigger",
				"axis": "right trigger",
				"axisValue": 1
			},
			{
				"name": "back"
			},
			{
				"name": "start"
			},
			{
				"name": "left stick"
			},
			{
				"name": "right stick"
			},
			{
				"name": "dpad up",
				"axis": "dpad y",
				"axisValue": -1
			},
			{
				"name": "dpad down",
				"axis": "dpad y",
				"axisValue": 1
			},
			{
				"name": "dpad left",
				"axis": "dpad x",
				"axisValue": -1
			},
			{
				"name": "dpad right",
				"axis": "dpad x",
				"axisValue": 1
			},
			{
				"name": "home"
			},
		],
		"axes": [
			{
				"name": "left stick x",
				"buttons": [
					"left stick left",
					"left stick right",
				]
			},
			{
				"name": "left stick y",
				"buttons": [
					"left stick up",
					"left stick down",
				]
			},
			{
				"name": "right stick x",
				"buttons": [
					"right stick left",
					"right stick right",
				]
			},
			{
				"name": "right stick y",
				"buttons": [
					"right stick up",
					"right stick down",
				]
			}
		]
	},
	{
		"id": "Sony Computer Entertainment Wireless Controller",
		"userAgent": "Firefox",
		"buttons": [
			{
				"name": "x"
			},
			{
				"name": "a"
			},
			{
				"name": "b"
			},
			{
				"name": "y"
			},
			{
				"name": "left shoulder"
			},
			{
				"name": "right shoulder"
			},
			{
				"name": "left trigger"
			},
			{
				"name": "right trigger"
			},
			{
				"name": "back"
			},
			{
				"name": "start"
			},
			{
				"name": "left stick"
			},
			{
				"name": "right stick"
			},
			{
				"name": "home"
			},
			{
				"name": "touch"
			}
		],
		"axes": [
			{
				"name": "left stick x",
				"buttons": [
					"left stick left",
					"left stick right",
				]
			},
			{
				"name": "left stick y",
				"buttons": [
					"left stick up",
					"left stick down",
				]
			},
			{
				"name": "right stick x",
				"buttons": [
					"right stick left",
					"right stick right",
				]
			},
			{
				"name": "left trigger",
				"scale": "to positive"
			},
			{
				"name": "right trigger",
				"scale": "to positive"
			},
			{
				"name": "right stick y",
				"buttons": [
					"right stick up",
					"right stick down",
				]
			},
			{
				"name": "dpad x",
				"buttons": [
					"dpad left",
					"dpad right",
				]
			},
			{
				"name": "dpad y",
				"buttons": [
					"dpad up",
					"dpad down",
				]
			}
		]
	},
	{
		"id": "Sony Computer Entertainment Wireless Controller",
		"userAgent": "WebKit",
		"buttons": [
			{
				"name": "a"
			},
			{
				"name": "b"
			},
			{
				"name": "x"
			},
			{
				"name": "y"
			},
			{
				"name": "left shoulder"
			},
			{
				"name": "right shoulder"
			},
			{
				"name": "left trigger",
				"axis": "left trigger",
				"axisValue": 1
			},
			{
				"name": "right trigger",
				"axis": "right trigger",
				"axisValue": 1
			},
			{
				"name": "back"
			},
			{
				"name": "start"
			},
			{
				"name": "left stick"
			},
			{
				"name": "right stick"
			},
			{
				"name": "dpad up",
				"axis": "dpad y",
				"axisValue": -1
			},
			{
				"name": "dpad down",
				"axis": "dpad y",
				"axisValue": 1
			},
			{
				"name": "dpad left",
				"axis": "dpad x",
				"axisValue": -1
			},
			{
				"name": "dpad right",
				"axis": "dpad x",
				"axisValue": 1
			},
			{
				"name": "home"
			},
			{
				"name": "touch"
			}
		],
		"axes": [
			{
				"name": "left stick x",
				"buttons": [
					"left stick left",
					"left stick right",
				]
			},
			{
				"name": "left stick y",
				"buttons": [
					"left stick up",
					"left stick down",
				]
			},
			{
				"name": "right stick x",
				"buttons": [
					"right stick left",
					"right stick right",
				]
			},
			{
				"name": "right stick y",
				"buttons": [
					"right stick up",
					"right stick down",
				]
			}
		]
	},
	{
		"id": "Sony PLAYSTATION(R)3 Controller",
		"userAgent": "Firefox",
		"buttons": [
			{
				"name": "back",
			},
			{
				"name": "left stick",
			},
			{
				"name": "right stick",
			},
			{
				"name": "start",
			},
			{
				"name": "dpad up",
				"axis": "dpad y",
				"axisValue": -1
			},
			{
				"name": "dpad right",
				"axis": "dpad x",
				"axisValue": 1
			},
			{
				"name": "dpad down",
				"axis": "dpad y",
				"axisValue": 1
			},
			{
				"name": "dpad left",
				"axis": "dpad x",
				"axisValue": -1
			},
			{
				"name": "left trigger",
			},
			{
				"name": "right trigger",
			},
			{
				"name": "left shoulder",
			},
			{
				"name": "right shoulder",
			},
			{
				"name": "y",
			},
			{
				"name": "b",
			},
			{
				"name": "a",
			},
			{
				"name": "x",
			},
			{
				"name": "home",
			},
		],
		"axes": [
			{
				"name": "left stick x",
				"buttons": [
					"left stick left",
					"left stick right",
				]
			},
			{
				"name": "left stick y",
				"buttons": [
					"left stick up",
					"left stick down",
				]
			},
			{
				"name": "right stick x",
				"buttons": [
					"right stick left",
					"right stick right",
				]
			},
			{
				"name": "right stick y",
				"buttons": [
					"right stick up",
					"right stick down",
				]
			},
			{
				"name": "dunno 1",
			},
			{
				"name": "dunno 2",
			},
			{
				"name": "dunno 3",
			},
			{
				"name": "dunno 4",
			},
			{
				"name": "dpad up",
				"scale": "to positive"
			},
			{
				"name": "dpad right",
				"scale": "to positive"
			},
			{
				"name": "dpad down",
				"scale": "to positive"
			},
			{
				"name": "dunno 8",
			},
			{
				"name": "left trigger",
				"scale": "to positive"
			},
			{
				"name": "right trigger",
				"scale": "to positive"
			},
			{
				"name": "left shoulder",
				"scale": "to positive"
			},
			{
				"name": "right shoulder",
				"scale": "to positive"
			},
			{
				"name": "y",
				"scale": "to positive"
			},
			{
				"name": "b",
				"scale": "to positive"
			},
			{
				"name": "a",
				"scale": "to positive"
			},
			{
				"name": "x",
				"scale": "to positive"
			},
			{
				"name": "dunno 9",
			},
			{
				"name": "dunno 10",
			},
			{
				"name": "dunno 11",
			},
			{
				"name": "accelerometer x",
			},
			{
				"name": "accelerometer y",
			},
			{
				"name": "accelerometer z",
			}
		]
	},
	{
		"id": "Sony PLAYSTATION(R)3 Controller",
		"userAgent": "WebKit",
		"buttons": [
			{
				"name": "a",
			},
			{
				"name": "b",
			},
			{
				"name": "x",
			},
			{
				"name": "y",
			},
			{
				"name": "left shoulder",
			},
			{
				"name": "right shoulder",
			},
			{
				"name": "left trigger",
				"axis": "left trigger",
				"axisValue": 1
			},
			{
				"name": "right trigger",
				"axis": "right trigger",
				"axisValue": 1
			},
			{
				"name": "back",
			},
			{
				"name": "start",
			},
			{
				"name": "left stick",
			},
			{
				"name": "right stick",
			},
			{
				"name": "dpad up",
				"axis": "dpad y",
				"axisValue": -1
			},
			{
				"name": "dpad down",
				"axis": "dpad y",
				"axisValue": 1
			},
			{
				"name": "dpad left",
				"axis": "dpad x",
				"axisValue": -1
			},
			{
				"name": "dpad right",
				"axis": "dpad x",
				"axisValue": 1
			},
			{
				"name": "home",
			},
		],
		"axes": [
			{
				"name": "left stick x",
				"buttons": [
					"left stick left",
					"left stick right",
				]
			},
			{
				"name": "left stick y",
				"buttons": [
					"left stick up",
					"left stick down",
				]
			},
			{
				"name": "right stick x",
				"buttons": [
					"right stick left",
					"right stick right",
				]
			},
			{
				"name": "right stick y",
				"buttons": [
					"right stick up",
					"right stick down",
				]
			}
		]
	}
]

},{}]},{},[1])(1)
});