var exp = require('express');


//setting middleware

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
class bullet
{
	constructor(id,x,z)
	{
		this.id=id;
		this.x=x;
		this.z=z;
		this.spx=10;
		this.spz=0
		
	}
	move()
	{
		this.x=this.x+this.spx;
		this.z=this.z+this.spz;
	}
	
}
class player{
constructor(x,z,id)
{
	this.id=id;
this.x=x;

this.z=z;
this.spz=10;
this.spx=10;
this.healt=100;
}

move(key)
{
if(key=="ArrowUp")
this.z=this.z+this.spz;
if(key=="ArrowDown")
this.z=this.z-this.spz;
if(key=="ArrowLeft")
this.x=this.x+this.spx;
if(key=="ArrowRight")
this.x=this.x-this.spx;
}
}
players=[]
bullets=[]
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.use(exp.static('public'))
io.on('connection', function(socket){
  var id =socket.id;
  console.log(id);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on("hit",function(sh){
	 var pl=new player(0,0,0);
	  for(var i=0;i<players.length;i++)
	{
		if(sh.id==players[i].id)
		{
			pl=players[i];
			pl.healt=pl.healt-10
		}
	} 
	  
  })
   socket.on('disconnect', function(){
    for(var i=0;i<players.length;i++)
	{
		if(socket.id==players[i].id)
		{
			players.splice(i,1);
		}
	}
	 for(var i=0;i<bullets.length;i++)
	{
		if(socket.id==bullets[i].id)
		{
			bullets.splice(i,1);
		}
	}
  });
  
  socket.on("shot",function(sh){
	  var pl=new player(0,0,0);
	  for(var i=0;i<players.length;i++)
	{
		if(sh.id==players[i].id)
		{
			pl=players[i];
		}
	}
	  var bu=new bullet(sh.id,pl.x,pl.z)
	  var vec={x:sh.x-bu.x,z:sh.y-bu.z}
bu.spx=vec.x/50;
bu.spz=vec.z/50;
	  
	  bullets.push(bu);
  })
   socket.on('player', function(p){
	   var pl=new player(p.x,p.z,id)
   players.push(pl);
  });
  socket.on("move",function(m){
	  
	for(var i=0;i<players.length;i++)
	{
		if(m.id==players[i].id)
		{
			players[i].move(m.ev);
		}
	}  
  })
});
function update()
{
	
	
	io.emit("drow",players)
	for(var i=0;i<bullets.length;i++)
	{
		bullets[i].move();
	} 
	io.emit("drowb",bullets)
	
}	
setInterval(update,100)
http.listen( port , function(){
  console.log('listening on *:3000');
});