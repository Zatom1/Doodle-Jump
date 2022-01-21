const screenWidth = 650;
const screenHeight = 600;

const gravity = 9.81;

let aIsDown = false;
let dIsDown = false;

let scroll = 0;

new p5();

class box {
  constructor(x, y, mass, width, height, bounce){
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.height = height;
    this.width = width;
    this.Xdrag = this.height/500;
    this.Ydrag = this.width/500;
    this.Xvelo = 0;
    this.Yvelo = 0;
    this.bounce = bounce;
    this.onGround = false;
  }
   

  velocity() {
    this.x+=this.Xvelo;
    this.y+=this.Yvelo;
  }
  appXForce(Xforce){
    this.Xvelo += Xforce;
    this.x+=this.Xvelo;
  }
  appYForce(Yforce){
    this.Yvelo += Yforce;
    this.y+=this.Yvelo;
  }
  appXDrag(d1){
    if(this.Xvelo>d1){
      this.Xvelo -= d1;
    }
    
    else if(this.Xvelo>0){
      this.Xvelo -= 0.05;
    }
    
    if(this.Xvelo<-d1){
      this.Xvelo += d1;
    }
    
    else if(this.Xvelo<0){
      this.Xvelo += 0.05;
    }
    if(abs(this.Xvelo)<0.25){
      this.Xvelo = 0;
    }
  }
  appXDragGround(d2){
     if(this.y+this.height>=screenHeight-4){
    if(this.Xvelo>d2){
      this.Xvelo -= d2;
    }
    
    else if(this.Xvelo>0){
      this.Xvelo -= 0.05;
    }
    
    if(this.Xvelo<-d2){
      this.Xvelo += d2;
    }
    
    else if(this.Xvelo<0){
      this.Xvelo += 0.05;
    }
    if(abs(this.Xvelo)<0.25){
      this.Xvelo = 0;
    }
     }
  }
  appYDrag(d3){
    if(this.Yvelo>d3){
      this.Yvelo -= d3;
    }
    
    else if(this.Yvelo>0){
      this.Yvelo -= 0.05;
    }
    
    if(this.Yvelo<-d3){
      this.Yvelo += d3;
    }
    
    else if(this.Yvelo<0){
      this.Yvelo += 0.05;
    }
    if(abs(this.Yvelo)<0.25){
      this.Yvelo = 0;
    }
  }
  appGrav(grav){
    if(this.y<screenHeight-this.height)this.Yvelo-=grav;
  }
  ground(bounce){
    if(this.y+this.height>=screenHeight-1){
      this.Yvelo = 0;
    }
    if(this.y+this.height>=screenHeight+1){
      this.Yvelo -= 1;
    }
    
    if(this.x<0){ 
      this.Xvelo *= (-0.4+(this.bounce/8));
    }
    if(this.x<=-1){
      this.Xvelo += 1;
    }
    
    if(this.x+this.width+3>screenWidth){
      this.Xvelo *= (-0.4+(this.bounce/8));
    }
    if(this.x+this.width+3>=screenWidth+1){
      this.Xvelo -= 1;
    }
    
  }
  drawThis(){
      rect(this.x, this.y, this.width, this.height);
  }
  moveBox(mouseX, mouseY){

  if(keyIsPressed&&keyCode === 32&&this.onGround===true){
      this.appYForce(-25);
    }
      if(aIsDown === true &&this.Xvelo>-10){
        this.appXForce(-1);
      }
      if(dIsDown === true &&this.Xvelo<10){
        this.appXForce(1);
      }
    
  if(this.y+this.height>=screenHeight-1){
    this.onGround = true;
  }
  else {
    this.onGround = false;
  }
  
  }

  terminalVelo(){
    if(this.Xvelo>1){
      this.appXForce(-2);
    }
    if(this.Xvelo<-1){
      this.appXForce(2);
    }
  }

  simulate(){
  this.velocity();
  this.appXDrag(this.height/600);
  this.appXDragGround(this.width/200);
  this.appYDrag(this.width/200);
  this.appGrav(this.mass/-5);
  this.moveBox(mouseX, mouseY);
  this.drawThis();
  this.ground(this.bounce/2);
  }

}

let box1 = new box(50, 550, 5, 40, 40, 0.4);

class platform {
  constructor(x, y, width, height, breakable){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.breakable = breakable;
    this.carrying = false;
    this.carryTime = 0;
    this.broken = false;
  }

  simulate(){
    this.y += scroll;
    if(this.y>screenHeight){
      this.x = random(20, screenWidth-70);
      this.y = -15;
    }
    this.y+=2;
    this.show();
    this.hitbox();
    this.breaking();
  }

  show(){
    rect(this.x, this.y, this.width, this.height);
  }

  hitbox(){
    if(box1.x+box1.width>this.x&&box1.x<this.x+this.width&&box1.y+box1.height>=this.y&&box1.y<this.y+this.height&&this.broken === false){
      box1.appYForce(-1);
      box1.Yvelo = 0;
      box1.onGround = true;
      this.carrying = true;

      if(box1.y+box1.height>this.y&&box1.y<this.y+this.height){
        box1.y = this.y-box1.height;
      }

    }

    else{
      this.carrying = false;
    }
  }

  breaking(){
    if(this.breakable === true && this.carrying === true){
      this.carryTime++;
      if(this.carryTime>500){
        this.broken = true;
      }
    }
    else{
      this.carryTime--;
    }

  
  
  }
  
    


  }

let platform1 = new platform(random(20, screenWidth-70), random(50, screenHeight)+scroll, 80, 10, false);
let platform2 = new platform(random(20, screenWidth-70), random(50, screenHeight)+scroll, 80, 10, false);
let platform3 = new platform(random(20, screenWidth-70), random(50, screenHeight)+scroll, 80, 10, false);
let platform4 = new platform(random(20, screenWidth-70), random(50, screenHeight)+scroll, 80, 10, false);
let platform5 = new platform(random(20, screenWidth-70), random(50, screenHeight)+scroll, 80, 10, false);


function setup() {
  createCanvas(screenWidth, screenHeight);
  frameRate(500);
}
function draw() {
  background(220);
  
  box1.simulate();
  platform1.simulate();
  platform2.simulate();
  platform3.simulate();
  platform4.simulate();
  platform5.simulate();

  scroll+=0.001;

text(keyCode, 20, 20);
text(aIsDown, 20, 40);


}

function keyPressed(){
     
    if (keyCode == 65){
        aIsDown = true
      }

    if (keyCode == 68){
        dIsDown = true
      }
}
function keyReleased(){
    
    if (keyCode == 65){
        aIsDown = false
      }
    if (keyCode == 68){
        dIsDown = false
      }
    }