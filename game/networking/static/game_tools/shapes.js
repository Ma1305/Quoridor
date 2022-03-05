// making it easier to draw square
class Square{ 
    constructor(ctx, x, y, w, h, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.real = true;
    }
    draw(){
        this.ctx.fillStyle = this.color;
        if (!this.real){
            var point = this.camera.vr_to_real([this.x, this.y]);
            var width = this.camera.zoom*this.w;
            var height = this.camera.zoom*this.h;
            this.ctx.fillRect(point[0], point[1], width, height);
            return null;
        }
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    move(move){
        this.x += move[0];
        this.y += move[1];
    }
    make_virtual(camera){
        this.camera = camera;
        this.real = false;
    }
}

// making it easier to draw line
class Line{
    constructor(ctx, startPoint, endPoint, color){
        this.ctx = ctx;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.color = color;
        this.real = true;
    }
    draw(){
        this.ctx.strokeStyle = this.color;
        if (!this.real){
            var startPoint = this.camera.vr_to_real(this.startPoint);
            var endPoint = this.camera.vr_to_real(this.endPoint);
            this.ctx.beginPath();
            this.ctx.moveTo(startPoint[0], startPoint[1]);
            this.ctx.lineTo(endPoint[0], endPoint[1]);
            this.ctx.stroke();
            return null;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.startPoint[0], this.startPoint[1]);
        this.ctx.lineTo(this.endPoint[0], this.endPoint[1]);
        this.ctx.stroke();
    }
    move(move){
        this.startPoint[0] += move[0];
        this.startPoint[1] += move[1];
        this.endPoint[0] += move[0];
        this.endPoint[1] += move[1];
    }
    make_virtual(camera){
        this.camera = camera;
        this.real = false;
    }
}

// making it easier to draw circle
class Circle{
    constructor(ctx, x, y, radius, color){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.real = true;
    }
    draw(){
        this.ctx.fillStyle = this.color;
        if (!this.real){
            var center = this.camera.vr_to_real([this.x, this.y]);
            var radius = this.camera.zoom * this.radius;
            this.ctx.beginPath();
            this.ctx.moveTo(center[0], center[1]);
            this.ctx.arc(center[0], center[1], radius, 0, 360, false);
            this.ctx.fill();
            return null;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.arc(this.x, this.y, this.radius, 0, 360, false);
        this.ctx.fill();
    }
    move(move){
        this.x += move[0];
        this.y += move[1];
    }
    make_virtual(camera){
        this.camera = camera;
        this.real = false;
    }
}

// turning rgb list colors to string color
function rgbToColor(color){
    return 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
}

// making it easier to draw circle outline
class CircleOutline{
    constructor(ctx, x, y, radius, color){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.real = true;
    }
    draw(){
        this.ctx.strokeStyle = this.color;
        if (!this.real){
            var center = this.camera.vr_to_real([this.x, this.y]);
            var radius = this.camera.zoom * this.radius;
            this.ctx.beginPath();
            //this.ctx.moveTo(this.x, this.y);
            this.ctx.arc(center[0], center[1], radius, 0, 360, false);
            this.ctx.stroke();
            return null;
        }
        this.ctx.beginPath();
        //this.ctx.moveTo(this.x, this.y);
        this.ctx.arc(this.x, this.y, this.radius, 0, 360, false);
        this.ctx.stroke();
    }
    move(move){
        this.x += move[0];
        this.y += move[1];
    }
    make_virtual(camera){
        this.camera = camera;
        this.real = false;
    }
}


// clear


// camera used for drawing shapes in virtual positiions
class Camera{
    constructor(canvas, ctx, x, y, zoom){
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.zoom = zoom;
    }
    vr_to_real(point){
        var origin = this.get_origin()
        var point = [this.zoom*point[0], this.zoom*point[1]]
        return [origin[0]+point[0], origin[1]-point[1]];
    }
    get_origin(){
        var center = [this.canvas.width/2,this.canvas.height/2];
        var point = [-this.x, -this.y];
        var point = [this.zoom*point[0], this.zoom*point[1]];
        return [center[0]+point[0], center[1]-point[1]];
    }
    move(move){
        this.x += move[0];
        this.y += move[1];
    }
}
