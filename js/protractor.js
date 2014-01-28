/*
 * Protractor tool
 */
function Protractor(){
	/*
	 * 0 = not initialized, 
	 * 1 = center drawed
	 * 2 = center + v1
	 * 3 = center + v1 + v2
	 */
	this.state = 0;
	this.origin = {x:'-', y:'-', visible:true};
	this.v1 = {x:'-', y:'-', visible:false};
	this.v2 = {x:'-', y:'-', visible:false};
	this.angleDegrees='-';
	this.angleRadians='-';
}

Protractor.prototype = {
	update: function(mx, my){
		switch(this.state){
			case 0:
				this.origin.x=mx;
				this.origin.y=my;
				break;
			case 1:
				this.v1.visible=true;
				this.v1.x=mx;
				this.v1.y=my;
				break;
			case 2:
				this.v2.visible=true;
				this.v2.x=mx;
				this.v2.y=my;
				break;
			case 3:
				break;
		}
	},
	set: function(){
		if(this.state<3){
			this.state++;
		}else{
			this.v1.visible=false;
			this.v2.visible=false;
			this.state=0;
		}		
	}
}

/*
 * Object for managing the canvas
 */
function CanvasController($scope){
	var canv=$("#main-canvas");
	this.canvas=canv;
	this.context=this.canvas[0].getContext('2d');
	this.protractor = new Protractor(cc);
	this.mouseX=0;
	this.mouseY=0;
	$scope.protractor=this.protractor;

	//As it is the only tool available, every click will trigger protractor
	var cc=this;
	this.canvas.click(function(e){
		cc.updateMouse(e);
		cc.protractor.set();
		cc.protractor.update(cc.mouseX, cc.mouseY);
	});
	this.canvas.mousemove(function(e){
		cc.updateMouse(e);
		cc.protractor.update(cc.mouseX, cc.mouseY);
		cc.updateCanvas();
		$scope.$apply();
	});
}

CanvasController.prototype={

	updateMouse: function(e){
		this.mouseX=e.clientX - this.canvas[0].offsetLeft;;
		this.mouseY=e.clientY - this.canvas[0].offsetTop;;
	},

	updateCanvas: function(){
		this.context.clearRect(0, 0, 700, 400);
		//draw elements
		this.drawProtractor();
	},

	drawProtractor: function(){
		if(this.protractor.origin.visible){
			//Draw center
			this.drawPoint('#00f72d', this.protractor.origin.x, this.protractor.origin.y, 5);
		}
		if(this.protractor.v1.visible){
			//Draw v1
			this.drawPoint('#00f72d', this.protractor.v1.x, this.protractor.v1.y, 5);
		}
		if(this.protractor.v2.visible){
			//Draw v2
			this.drawPoint('#00f72d', this.protractor.v2.x, this.protractor.v2.y, 5);
		}
		if(this.protractor.v1.visible){
			//Draw line1
			this.drawDashedLine(this.protractor.origin.x, this.protractor.origin.y, 
				this.protractor.v1.x, this.protractor.v1.y, 2);
		}
		if(this.protractor.v2.visible){
			//Draw line2
			this.drawDashedLine(this.protractor.origin.x, this.protractor.origin.y, 
				this.protractor.v2.x, this.protractor.v2.y, 2);
		}
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

function distanceBetween(x0, y0, x1, y1){
	
}