/*
 * Protractor tool
 */
var INITIAL_X=362;
var INITIAL_Y=234;

function Protractor(){

	this.origin = {x:INITIAL_X, y:INITIAL_Y, visible:true};
	this.tool=$("#protractor-tool");
	this.canvas=$("#protractor-canvas");
	this.context=this.canvas[0].getContext('2d');

	this.setInputRotation();

	this.angleDegrees=0;
	this.angleRadians=0;

}

Protractor.prototype = {
	set: function(){
		if(this.state<3){
			this.state++;
		}else{
			this.v1.visible=false;
			this.v2.visible=false;
			this.state=0;
		}		
	},

	setRotation: function(x, y, z){
		this.tool.css("-webkit-transform", "rotateX(" + x + "deg) rotateY(" + y + "deg) rotateZ(" + z + "deg)");
	},

	updateAngle: function(){
		this.angleDegrees = $("#protractor-angle").val();
		$('#protractor-slider-knob').css('left',  this.angleDegrees + 'px');
		$("#protractor-angle-center").html(this.angleDegrees + '&deg;');
		this.angleRadians=this.angleDegrees*Math.PI/180;
	},

	setInputRotation: function(){
		var xRot = parseInt($("#rot-x").val());
		var yRot = parseInt($("#rot-y").val());
		var zRot = parseInt($("#rot-z").val());
		this.setRotation(xRot, yRot, zRot);
	},

	drawArc: function(){
		var radius = 85;
		var x= this.canvas.width()/2;
		var y= this.canvas.height()/2;
		var startAngle = 0 + 0.5*Math.PI;
		var endAngle = this.angleRadians + 0.5*Math.PI;
		var counterClockwise = false;
		this.context.beginPath();
		this.context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
		this.context.lineWidth = 15;
		this.context.strokeStyle = 'orange';
		this.context.stroke();
	}
}

/*
 * Object for managing the canvas
 */
function CanvasController($scope){
	var canv=$("#main-canvas");
	this.canvas=canv;
	this.context=this.canvas[0].getContext('2d');

	var cc=this;
	$(document).ready( function(){
		cc.protractor = new Protractor(cc);
		cc.mouseX=0;
		cc.mouseY=0;
		cc.updateCanvas();
		$scope.protractor=this.protractor;
		$scope.$apply();
		cc.setEvents();
	});
}

CanvasController.prototype={

	updateCanvas: function(){
		console.log(this.protractor.angleDegrees);
		console.log(this.protractor.angleRadians);
		this.context.clearRect(0, 0, 700, 500);
		this.protractor.context.clearRect(0, 0, 300, 300);
		this.protractor.drawArc();
	},

	setEvents: function(){
		var cc=this;
		var prot=this.protractor;
		$("input").keydown(function(){
			prot.setInputRotation();
		});
		$("input").keyup(function(){
			prot.setInputRotation();
		});
		$("input").blur(function(){
			prot.setInputRotation();
		});
		$("#protractor-angle").keyup(function(){
			prot.updateAngle();
		});
		$("#protractor-angle").keydown(function(){
			prot.updateAngle();
		});
		$('#protractor-slider-knob').draggable({ 
			axis: 'x', 
			containment: "parent",
			drag: function(){
				var degrees = parseInt($(this).css('left').replace('px',''));
				$("#protractor-angle").val(degrees);
				prot.updateAngle();
				cc.updateCanvas();
			}
		});
	},

	drawPoint: function(color, x, y, radius){
		this.context.beginPath();
		this.context.arc(x, y, radius, 0, 2*Math.PI, false);
		this.context.fillStyle = color;
		this.context.strokeStyle = 'transparent';
		this.context.fill();
		this.context.stroke();
	},

	drawDashedLine: function(x0, y0, x1, y1, dashLen){
		if (dashLen == undefined) dashLen = 2;
		this.context.beginPath();
		this.context.setLineDash([dashLen,dashLen*2]);
		this.context.moveTo(x0,y0);
        this.context.lineTo(x1,y1);
        this.context.strokeStyle = '#333';
		this.context.stroke();
	}
}

