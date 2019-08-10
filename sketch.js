var ready = true;
var angle = 0;

function dimension(type = 'global')
{
  //switch(type) {
    //case 'global' :
      if (Math.min(2/3*width,height) == height) {
        return 0.95*height;
      }
    	else {
        return 2/3*0.95*width;
      }
    	//break;
    /*case 'circle' :
  		return Math.min(width,height);
    case 'violin' :
      if (Math.min(9*width,5*height) == 5*height)
        return height/9;
    	else
        return width/5;
    	break;
    case 'harp' :
      if (Math.min(width,2*height) == height)
        return height;
      else
        return width/2;*/
  //}
}

function lineWeight() {
  return 0.0032*dimension();
}

function deg(d)
{
	return ((d-1) % 7 + 7) % 7 + 1;
}

function ndt(n)
{
	return (n % 12 + 12) % 12;
}

function alt(a)
{
  return ((a+5) % 12 + 12) % 12 - 5;
}

function degToNdt(d)
{
  d = deg(d);
  switch(d) {
    case 1:
      return 0;
    case 2:
			return 2;
    case 3:
			return 4;
    case 4:
			return 5;
    case 5:
			return 7;
    case 6:
			return 9;
		case 7:
			return 11;
  }
}

//-----------------------------------------------------------------
//																					 Note
//-----------------------------------------------------------------

class Note {
  constructor(d,a) {
    this.d = deg(d);
    this.n = ndt(degToNdt(d)+a);
  }

  alt() {
    return alt(this.n-degToNdt(this.d));
  }

  alter(a) {
    this.n = ndt(this.n+a);
  }

  enharm(up) {
    if(up) {
      this.d = deg(this.d+1);
    }
    else {
      this.d = deg(this.d-1);
    }
  }

  altInt(note) {
    let d = deg(note.d-this.d+1);
    let n = ndt(note.n-this.n);
    return n-degToNdt(d);
  }

  newNote(d,a) {
    var nD = deg(this.d+d-1);
    let n = ndt(degToNdt(d)+degToNdt(this.d)+this.alt())+a;
    return new Note(nD,alt(n-degToNdt(nD)));
  }

  name() {
    var s;
    switch(this.d) {
      case 1:
        s = "C";
        break;
      case 2:
        s = "D";
        break;
      case 3:
        s = "E";
        break;
      case 4:
        s = "F";
      	break;
      case 5:
        s = "G";
        break;
      case 6:
        s = "A";
        break;
      case 7:
        s = "B";
        break;
      default:
        s = "X";
    }

    switch(this.alt()) {
      case -2:
        return concat(s, "bb");
      case -1:
        return concat(s, "b");
      case 0:
        return s;
      case 1:
        return concat(s,  "#");
      case 2:
        return concat(s,"##");
      default:
        return concat(s, "?");
    }

    return s;
  }

  guitar(corde) {
    var n0;
    switch(corde) {
      case 1 :
        n0 = 4;
        break;
      case 2 :
        n0 = 9;
        break;
      case 3 :
        n0 = 2;
        break;
      case 4 :
        n0 = 7;
        break;
      case 5 :
        n0 = 11;
        break;
      case 6 :
        n0 = 4;
        break;
      default :
        return -1;
    }

    return ndt(this.n-n0);
  }

  violin(corde) {
    var n0;
    switch(corde) {
      case 1 :
        n0 = 7;
        break;
      case 2 :
        n0 = 2;
        break;
      case 3 :
        n0 = 9;
        break;
      case 4 :
        n0 = 4;
        break;
      default :
        return -1;
    }

    return ndt(this.n-n0);
  }

  draw(type,posX,posY,fact,d,ch=false,fret=0) {
		var n = ndt(this.n);
    var couleur;
		if(d == 1)
			couleur = [109,158,235];
		else if(d == 3)
			couleur = [146,196,125];
		else if(d == 5)
			couleur = [224,102,101];
		else if(d == 7)
			couleur = [254,217,102];
		else
			couleur = [217,217,217];
    var x, y;
    var fCh = 1.13;
    var fSc = 0.92;
    noStroke();
    switch(type) {
      case 'circle' :
    		var r = fact*0.36*dimension();
				var a = PI/2 - n*PI/6;
    		x = width/2 +posX+r*cos(a);
    		y = height/2+posY-r*sin(a);
        fill(couleur[0],couleur[1],couleur[2]);
        circle(x,y,fact*(ch?fCh:fSc)*0.08*dimension());
    		fill(87);
    		textAlign(CENTER,CENTER);
    		textSize(fact*(ch?fCh:fSc)*0.075*dimension());
    		text(this.name(),x,y+fact*0.0065*dimension());
        break;
      case 'guitar' :
        for(let c = 1; c <= 6; c++)  {
          var g = ndt(this.guitar(c)-fret);
          if(g < 8) {
            x = width/2 +posX+fact*(c-3.5)*dimension();
            y = height/2+posY+fact*1.5*(g-3.5)*dimension();
            fill(couleur[0],couleur[1],couleur[2]);
            circle(x,y,fact*(ch?fCh:fSc)*0.425*dimension());
            fill(87);
    				textAlign(CENTER,CENTER);
    				textSize(fact*(ch?fCh:fSc)*0.4*dimension());
    				text(this.name(),x,y+fact*0.04*dimension());
          }
        }
        break;
      case 'violin' :
        for(let c = 1; c <= 4; c++) {
          var v = ndt(this.violin(c)-fret);
          if(v < 8) {
            x = width/2 +posX+fact*(c-2.5)*dimension();
            y = height/2+posY+fact*(v-3.5)*dimension();
            fill(couleur[0],couleur[1],couleur[2]);
            circle(x,y,fact*(ch?fCh:fSc)*0.425*dimension());
            fill(87);
    				textAlign(CENTER,CENTER);
    				textSize(fact*(ch?fCh:fSc)*0.4*dimension());
    				text(this.name(),x,y+fact*0.04*dimension());
          }
        }
        break;
      case 'harp' :
        switch(this.d) {
          case 1:
            a = PI+2*PI/8;
            break;
          case 2:
            a = PI+PI/8;
            break;
          case 3:
            a = 3/2*PI+PI/9;
            break;
          case 4:
            a = 3/2*PI+2*PI/9;
            break;
          case 5:
            a = 3/2*PI+3*PI/9;
            break;
          case 6:
            a = 3/2*PI+4*PI/9;
            break;
          case 7:
            a = PI+3*PI/8;
            break;
        }
        r = fact*0.3*dimension();
        x = width/2+posX+(r+fact*0.1*dimension())*cos(a);
        y = height/2+posY-fact*0.2*dimension()-(r+fact*0.1*dimension())*sin(a);
        fill(couleur[0],couleur[1],couleur[2]);
        circle(x,y,fact*(ch?fCh:fSc)*0.06*dimension());
    		fill(87);
    		textAlign(CENTER,CENTER);
    		textSize(fact*(ch?fCh:fSc)*0.06*dimension());
    		text(this.name(),x,y+fact*0.005*dimension());
    }
	}
}

//-----------------------------------------------------------------
//																					Scale
//-----------------------------------------------------------------

class Scale {
	constructor(note,s) {
    this.name = s;
    var a = [0,0,0,0,0,0,0];
    switch(s) {
      case 'majeur':
      case 'ionien':
      case 'major':
      case 'maj7' :
        break;
      case 'dorien':
      case 'dorian':
        a[2]--;
        a[6]--;
      	break;
      case 'phrygien':
      case 'phrygian':
        a[1]--;
        a[2]--;
        a[5]--;
        a[6]--;
      	break;
      case 'lydien':
      case 'lydian':
        a[3]++;
        break;
      case 'mixolydien':
      case 'mixolydian':
        a[6]--;
        break;
      case 'mineur':
      case 'mineur naturel':
      case 'aeolien':
      case 'minor':
      case 'natural minor' :
        a[2]--;
        a[5]--;
        a[6]--;
        break;
      case 'locrien':
      case 'locrian':
        a[1]--;
        a[2]--;
        a[4]--;
        a[5]--;
        a[6]--;
        break;
      case 'mineur melodique' :
      case 'melodic minor' :
        a[2]--;
      	break;
      case 'dorien b9' :
      case 'dorian b9' :
        a[1]--;
        a[2]--;
        a[6]--;
        break;
      case 'lydien augmente' :
      case 'aug. lydian' :
        a[3]++;
        a[4]++;
        break;
      case 'lydien b7' :
      case 'lydian b7' :
        a[3]++;
        a[6]--;
        break;
      case 'mixolydien b13' :
      case 'mixolydian b13' :
        a[5]--;
        a[6]--;
        break;
      case 'locrien #9' :
      case 'locrian #9' :
        a[2]--;
        a[4]--;
        a[5]--;
        a[6]--;
        break;
      case 'super locrien' :
      case 'altere' :
      case 'super locrian' :
      case 'altered' :
        a[1]--;
        a[2]--;
        a[3]--;
        a[4]--;
        a[5]--;
        a[6]--;
        break;
      case 'mineur harmonique' :
      case 'harmonic minor' :
        a[2]--;
        a[5]--;
        break;
      case 'locrien #13' :
      case 'locrian #13' :
        a[1]--;
        a[2]--;
        a[4]--;
        a[6]--;
        break;
      case 'ionien augmente' :
      case 'aug. ionian' :
        a[4]++;
        break;
      case 'dorien #11' :
      case 'dorian #11' :
        a[2]--;
        a[3]++;
        a[6]--;
        break;
      case 'mixo. b9 b13' :
        a[1]--;
        a[5]--;
        a[6]--;
        break;
      case 'lydien #9' :
      case 'lydian #9' :
        a[1]++;
        a[3]++;
        break;
      case 'diminue' :
      case 'diminished' :
        a[1]--;
        a[2]--;
        a[3]--;
        a[4]--;
        a[5]--;
        a[6]-=2;
        break;
    }
    this.notes = [];
    var d;
    var n;
    for (var i = 0; i < a.length; i++) {
      d = note.d+i;
      n = ndt(degToNdt(i+1)+degToNdt(note.d)+note.alt()+a[i]);
      this.notes.push(new Note(d,n-degToNdt(d)));
    }
    if(s == 'super locrian') {
      this.notes[2].enharm(false);
      this.notes[3].enharm(false);
      this.notes[4].enharm(false);
    }
  }

  alt(d1,d2) {
    return this.notes[deg(d1)-1].altInt(
      		 this.notes[deg(d1+d2-1)-1]);
  }

  drawChord(type,chord,posX=0,posY=0,fact=1,fret=0,freVio=0) {
    var ch;
    switch(type) {
      case 'circle':
        stroke(87);
        noFill();
        strokeWeight(lineWeight());
		circle(width/2+posX,height/2+posY,fact*0.36*dimension());
    	for(var i = 0; i < this.notes.length; i++) {
          ch = false;
          for(var j = 0; j < chord.notes.length; j++) {
            if(this.notes[i].d == chord.notes[j].d &&
               this.notes[i].n == chord.notes[j].n) {
              ch = true;
            }
          }
    	  this.notes[i].draw(type,posX,posY,fact,deg(this.notes[i].d-this.notes[0].d+1),ch);
    	}
        fill(87);
    		textAlign(CENTER,CENTER);
    		textSize(fact*0.11*dimension());
    		text(chord.name,width/2+posX,height/2+posY-fact*0.045*dimension());
        textSize(fact*0.067*dimension());
    		text(this.name,width/2+posX,height/2+posY+fact*0.065*dimension());
        break;
      case 'guitar' :
        posX -= 0.132*dimension();
        stroke(87);
        noFill();
        strokeWeight(0.8*lineWeight());
        for(i = 0; i < 6; i++) {
          line(width/2 +posX+fact*(i-2.5)*dimension(),
               height/2+posY-fact*1.5*3.5*dimension(),
               width/2 +posX+fact*(i-2.5)*dimension(),
          	   height/2+posY+fact*1.5*3.5*dimension());
        }
        for(i = 0; i < 7; i++) {
          if(i == 0 && fret== 0) {
            strokeWeight(1.2*lineWeight());
          }
          else {
            strokeWeight(0.8*lineWeight());
          }
          line(width/2 +posX-fact*3*dimension(),
               height/2+posY+fact*1.5*(i-3.165)*dimension(),
               width/2 +posX+fact*3*dimension(),
               height/2+posY+fact*1.5*(i-3.165)*dimension());
        }
        for(i = 0; i < this.notes.length; i++) {
          ch = false;
          for(let j = 0; j < chord.notes.length; j++) {
            if(this.notes[i].d == chord.notes[j].d &&
               this.notes[i].n == chord.notes[j].n) {
              ch = true;
            }
          }
    		  this.notes[i].draw(type,posX,posY,fact,deg(this.notes[i].d-this.notes[0].d+1),ch,fret);
    		}
        posX = -0.07*dimension();
        fill(87);
    	textAlign(CENTER,CENTER);
    	textSize(0.0843375*dimension());
    	text(chord.name,width/2+posX,height/2+posY-0.033735*dimension());
        textSize(0.04875*dimension());
    	text(this.name,width/2+posX,height/2+posY+0.04875*dimension());
        break;
      case 'violin' :
        posX -= 0.132*dimension();
        stroke(87);
        noFill();
        strokeWeight(lineWeight());
        for(i = 0; i < 4; i++) {
        	line(width/2 +posX+fact*(i-1.5)*dimension(),
             	 height/2+posY-fact*3.5    *dimension(),
             	 width/2 +posX+fact*(i-1.5)*dimension(),
          	 	 height/2+posY+fact*3.5    *dimension());
        }
        if(freVio == 0) {
          strokeWeight(1.3*lineWeight());
          line(width/2 +posX-fact*2*dimension(),
               height/2+posY-fact*3*dimension(),
               width/2 +posX+fact*2*dimension(),
               height/2+posY-fact*3*dimension());
        }
        for(i = 0; i < this.notes.length; i++) {
          ch = false;
          for(let j = 0; j < chord.notes.length; j++) {
            if(this.notes[i].d == chord.notes[j].d &&
               this.notes[i].n == chord.notes[j].n) {
              ch = true;
            }
          }
    		  this.notes[i].draw(type,posX,posY,fact,deg(this.notes[i].d-this.notes[0].d+1),ch,freVio);
    		}
        posX = -0.07*dimension();
        fill(87);
    	textAlign(CENTER,CENTER);
    	textSize(0.0843375*dimension());
    	text(chord.name,width/2+posX,height/2+posY-0.033735*dimension());
        textSize(0.04875*dimension());
    	text(this.name,width/2+posX,height/2+posY+0.04875*dimension());
        break;
      case 'harp' :
        posY = -0.26*dimension();
        stroke(87);
    		noFill();
        strokeWeight(lineWeight());
        var x = width/2+posX;
        var y = height/2+posY-fact*0.2*dimension();
        var r = fact*0.3*dimension();
        arc(x,y,2*r,2*r,0,PI);
        var a;
        for(i = 0; i < 3; i++) {
          a = PI+(i+1)*PI/8;
        	line(x+r*cos(a),y-r*sin(a),
             	 x+(r+fact*0.1*dimension())*cos(a),y-(r+fact*0.1*dimension())*sin(a));
        }
        for(i = 0; i < 4; i++) {
          a = 3/2*PI+(i+1)*PI/9;
        	line(x+r*cos(a),y-r*sin(a),
             	 x+(r+fact*0.1*dimension())*cos(a),y-(r+fact*0.1*dimension())*sin(a));
        }
        for(i = 0; i < this.notes.length; i++) {
          ch = false;
          for(let j = 0; j < chord.notes.length; j++) {
            if(this.notes[i].d == chord.notes[j].d &&
               this.notes[i].n == chord.notes[j].n) {
              ch = true;
            }
          }
    		  this.notes[i].draw(type,posX,posY,fact,deg(this.notes[i].d-this.notes[0].d+1),ch);
    		}
        posY = 0.16*dimension();
      	fill(87);
    		textAlign(CENTER,CENTER);
    		textSize(fact*0.12*dimension());
    		text(chord.name,width/2+posX,height/2+posY-fact*0.045*dimension());
        textSize(fact*0.078*dimension());
    		text(this.name,width/2+posX,height/2+posY+fact*0.065*dimension());
    }
  }
}

//-----------------------------------------------------------------
//																					Chord
//-----------------------------------------------------------------

class Chord {
  constructor(s) {
    this.name = s;
    var d;
    switch(s.slice(0,1)) {
      case 'C' : d = 1; break;
      case 'D' : d = 2; break;
      case 'E' : d = 3; break;
      case 'F' : d = 4; break;
      case 'G' : d = 5; break;
      case 'A' : d = 6; break;
      case 'B' : d = 7; break;
      default  : d = 1;
    }
    var a;
  	var isAlt = false;
    switch(s.slice(1,2)) {
      case 'b' : a = -1; break;
      case '#' : a = 1;  break;
      default  : a = 0;
    }
    this.notes = [];
    this.notes.push(new Note(d,a));
    this.scales = [];
    switch(s.slice(a!=0?2:1)) {
      case ''     : this.newNote(3);
        						this.newNote(5);
        						this.newScale('major');
        						this.newScale('lydian');
        						this.newScale('lydian b7');
        						this.newScale('lydian #9');
        						this.newScale('mixolydian');
        						this.newScale('mixolydian b13');
        						this.newScale('mixo. b9 b13');
        						break;
      case '6'    : this.newNote(3);
        						this.newNote(5);
        						this.newNote(6);
        						this.newScale('major');
        						this.newScale('lydian');
        						this.newScale('lydian b7');
        						this.newScale('lydian #9');
        						this.newScale('mixolydian');
        						break;
      case '69'   : this.newNote(3);
        						this.newNote(5);
        						this.newNote(6);
        						this.newNote(9);
        						this.newScale('major');
        						this.newScale('lydian');
        						this.newScale('lydian b7');
        						this.newScale('mixolydian');
        						break;
      case 'maj7' : this.newNote(3);
        						this.newNote(5);
        						this.newNote(7);
        						this.newScale('major');
        						this.newScale('lydian');
        						this.newScale('lydian #9');
        						break;
      case 'maj9' : this.newNote(3);
        						this.newNote(5);
        						this.newNote(7);
        						this.newNote(9);
        						this.newScale('major');
        						this.newScale('lydian');
        						break;
      case '7'    : this.newNote(3);
        						this.newNote(5);
        						this.newNote(7,-1);
        						this.newScale('mixolydian');
        						this.newScale('mixolydian b13');
        						this.newScale('mixo. b9 b13');
        						this.newScale('lydian b7');
                                this.newScale('super locrian');
        						break;
      case '9'    : this.newNote(3);
        						this.newNote(5);
        						this.newNote(7,-1);
        						this.newNote(9);
        						this.newScale('mixolydian');
        						this.newScale('mixolydian b13');
        						this.newScale('lydian b7');
        						break;
      case '7b9'  : this.newNote(3);
        						this.newNote(5);
        						this.newNote(7,-1);
        						this.newNote(9,-1);
        						this.newScale('mixo. b9 b13');
        						break;
      case '7b5'  : this.newNote(3);
        						this.newNote(5,-1);
        						this.newNote(7,-1);
        						this.newNote(9,-1);
        						this.newScale('super locrian');
        						this.newScale('lydian b7');
        						break;
      case 'm'    : this.newNote(3,-1);
        						this.newNote(5);
        						this.newScale('natural minor');
        						this.newScale('melodic minor');
        						this.newScale('harmonic minor');
        						this.newScale('dorian');
        						this.newScale('dorian b9');
        						this.newScale('dorian #11');
        						this.newScale('phrygian');
        						break;
      case 'm6'   : this.newNote(3,-1);
        						this.newNote(5);
        						this.newNote(6);
        						this.newScale('melodic minor');
        						this.newScale('dorian');
        						this.newScale('dorian b9');
        						this.newScale('dorian #11');
        						break;
      case 'm7'   : this.newNote(3,-1);
        						this.newNote(5);
        						this.newNote(7,-1);
        						this.newScale('natural minor');
        						this.newScale('dorian');
        						this.newScale('dorian b9');
        						this.newScale('dorian #11');
        						this.newScale('phrygian');
        						break;
      case 'm9'		: this.newNote(3,-1);
        						this.newNote(5);
        						this.newNote(7,-1);
        						this.newNote(9);
        						this.newScale('natural minor');
        						this.newScale('dorian');
        						this.newScale('dorian #11');
        						break;
      case 'mmaj7': this.newNote(3,-1);
        						this.newNote(5);
        						this.newNote(7);
        						this.newScale('melodic minor');
        						this.newScale('harmonic minor');
        						break;
    	case '+'		: this.newNote(3);
        						this.newNote(5,1);
        						this.newScale('aug. ionian');
        						this.newScale('aug. lydian');
        						break;
      case '°'		: this.newNote(3,-1);
        						this.newNote(5,-1);
        						this.newScale('locrian');
        						this.newScale('locrian #9');
        						this.newScale('locrian #13');
        						this.newScale('super locrian');
        						this.newScale('diminished');
        						break;
      case 'm7b5' : this.newNote(3,-1);
        						this.newNote(5,-1);
        						this.newNote(7,-1);
        						this.newScale('locrian');
        						this.newScale('locrian #9');
        						this.newScale('locrian #13');
        						this.newScale('super locrian');
        						break;
      case '°7'   : this.newNote(3,-1);
        						this.newNote(5,-1);
        						this.newNote(7,-2);
        						this.newScale('diminished');
    }
  }

  newNote(d,a=0) {
    this.notes.push(this.notes[0].newNote(d,a));
  }

  newScale(s) {
    this.scales.push(new Scale(this.notes[0],s));
  }

  drawScale(type,sc,posX=0,posY=0,fact=1,fret=0) {
    var ch;
    switch(type) {
      case 'circle':
        stroke(87);
        noFill();
        strokeWeight(lineWeight());
				circle(width/2+posX,height/2+posY,fact*0.36*dimension());
    		for(var i = 0; i < this.scales[sc].notes.length; i++) {
          ch = false;
          for(var j = 0; j < this.notes.length; j++) {
            if(this.scales[sc].notes[i].d == this.notes[j].d &&
               this.scales[sc].notes[i].n == this.notes[j].n) {
              ch = true;
            }
          }
    		  this.scales[sc].notes[i].draw(type,posX,posY,fact,deg(this.scales[sc].notes[i].d-this.scales[sc].notes[0].d+1),ch);
    		}
        fill(87);
    		textAlign(CENTER,CENTER);
    		textSize(fact*0.11*dimension());
    		text(this.name,width/2+posX,height/2+posY-fact*0.045*dimension());
        textSize(fact*0.067*dimension());
    		text(this.scales[sc].name,width/2+posX,height/2+posY+fact*0.065*dimension());
        break;
      case 'guitar' :
        posX -= 0.132*dimension();
        stroke(87);
        noFill();
        strokeWeight(0.8*lineWeight());
        for(i = 0; i < 6; i++) {
          line(width/2 +posX+fact*(i-2.5)*dimension(),
               height/2+posY-fact*1.5*3.5*dimension(),
               width/2 +posX+fact*(i-2.5)*dimension(),
          	   height/2+posY+fact*1.5*3.5*dimension());
        }
        for(i = 0; i < 7; i++) {
          if(i == 0 && fret== 0) {
            strokeWeight(1.2*lineWeight());
          }
          else {
            strokeWeight(0.8*lineWeight());
          }
          line(width/2 +posX-fact*3*dimension(),
               height/2+posY+fact*1.5*(i-3.165)*dimension(),
               width/2 +posX+fact*3*dimension(),
               height/2+posY+fact*1.5*(i-3.165)*dimension());
        }
        for(i = 0; i < this.scales[sc].notes.length; i++) {
          ch = false;
          for(let j = 0; j < this.notes.length; j++) {
            if(this.scales[sc].notes[i].d == this.notes[j].d &&
               this.scales[sc].notes[i].n == this.notes[j].n) {
              ch = true;
            }
          }
    		  this.scales[sc].notes[i].draw(type,posX,posY,fact,deg(this.scales[sc].notes[i].d-this.scales[sc].notes[0].d+1),ch,fret);
    		}
        posX = -0.07*dimension();
        fill(87);
    	textAlign(CENTER,CENTER);
    	textSize(0.0843375*dimension());
    	text(this.name,width/2+posX,height/2+posY-0.033735*dimension());
        textSize(0.04875*dimension());
    	text(this.scales[sc].name,width/2+posX,height/2+posY+0.04875*dimension());
        break;
      case 'violin' :
        posX -= 0.132*dimension();
        stroke(87);
        noFill();
        strokeWeight(lineWeight());
        for(i = 0; i < 4; i++) {
          line(width/2 +posX+fact*(i-1.5)*dimension(),
               height/2+posY-fact*3.5    *dimension(),
               width/2 +posX+fact*(i-1.5)*dimension(),
          	   height/2+posY+fact*3.5    *dimension());
        }
        line(width/2 +posX-fact*2*dimension(),
             height/2+posY-fact*3*dimension(),
             width/2 +posX+fact*2*dimension(),
             height/2+posY-fact*3*dimension());
        for(i = 0; i < this.scales[sc].notes.length; i++) {
          ch = false;
          for(let j = 0; j < this.notes.length; j++) {
            if(this.scales[sc].notes[i].d == this.notes[j].d &&
               this.scales[sc].notes[i].n == this.notes[j].n) {
              ch = true;
            }
          }
    		  this.scales[sc].notes[i].draw(type,posX,posY,fact,deg(this.scales[sc].notes[i].d-this.scales[sc].notes[0].d+1),ch);
    		}
        posX = -0.07*dimension();
        fill(87);
    	textAlign(CENTER,CENTER);
    	textSize(0.0843375*dimension());
    	text(this.name,width/2+posX,height/2+posY-0.033735*dimension());
        textSize(0.04875*dimension());
    	text(this.scales[sc].name,width/2+posX,height/2+posY+0.04875*dimension());
        break;
      case 'harp' :
        posY = -0.26*dimension();
        stroke(87);
    	noFill();
        strokeWeight(lineWeight());
        var x = width/2+posX;
        var y = height/2+posY-fact*0.2*dimension();
        var r = fact*0.3*dimension();
        arc(x,y,2*r,2*r,0,PI);
        var a;
        for(i = 0; i < 3; i++) {
          a = PI+(i+1)*PI/8;
        	line(x+r*cos(a),y-r*sin(a),
             	 x+(r+fact*0.1*dimension())*cos(a),y-(r+fact*0.1*dimension())*sin(a));
        }
        for(i = 0; i < 4; i++) {
          a = 3/2*PI+(i+1)*PI/9;
        	line(x+r*cos(a),y-r*sin(a),
             	 x+(r+fact*0.1*dimension())*cos(a),y-(r+fact*0.1*dimension())*sin(a));
        }
        for(i = 0; i < this.scales[sc].notes.length; i++) {
          ch = false;
          for(let j = 0; j < this.notes.length; j++) {
            if(this.scales[sc].notes[i].d == this.notes[j].d &&
               this.scales[sc].notes[i].n == this.notes[j].n) {
              ch = true;
            }
          }
    		  this.scales[sc].notes[i].draw(type,posX,posY,fact,deg(this.scales[sc].notes[i].d-this.scales[sc].notes[0].d+1),ch);
    		}
        posY = 0.16*dimension();
      	fill(87);
    		textAlign(CENTER,CENTER);
    		textSize(fact*0.12*dimension());
    		text(this.name,width/2+posX,height/2+posY-fact*0.045*dimension());
        textSize(fact*0.078*dimension());
    		text(this.scales[sc].name,width/2+posX,height/2+posY+fact*0.065*dimension());
    }
  }
}

//-----------------------------------------------------------------
//																				 Selector
//-----------------------------------------------------------------

class Selector {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.f = 1;

    this.notes =       ['C','D','E','F','G','A','B'];
    this.n = 0;

    this.alterations = ['b','','#'];
    this.a = 1;

    this.chordsM = [''];
    this.mc = 0; // 0, 1, 2, 3, 4, 5, 6
    this.cm = 0;

    this.chords =      ['',
                        '6',
                        '69',
                        'maj7',
                        'maj9',
                        '7',
                        '9',
                        '7b9',
                        '7b5',
                        'm',
                        'm6',
                        'm7',
                        'm9',
                        'mmaj7',
                        '+',
                        '°',
                       	'm7b5',
                       	'°7'];
    this.c = 0;
    this.chord = new Chord('C');
    this.chordSelect = false;

    this.scales =			 [['major',
                         'dorian',
                         'phrygian',
                         'lydian',
                         'mixolydian',
                         'natural minor',
                         'locrian'],
                        ['melodic minor',
                         'dorian b9',
                         'aug. lydian',
                         'lydian b7',
                         'mixolydian b13',
                         'locrian #9',
                         'super locrian'],
                        ['harmonic minor',
                         'locrian #13',
                         'aug. ionian',
                         'dorian #11',
                         'mixo. b9 b13',
                         'lydian #9',
                         'diminished']];
    this.sca = 0; // 0, 1, 2
    this.ms = 0; // 0, 1, 2, 3, 4, 5, 6
    this.scale = new Scale(new Note(1,0),'major');

    this.s = 0;
    this.scaleSelect = false;

    this.modes =			 ['I',
                        'II',
                        'III',
                        'IV',
                        'V',
                        'VI',
                        'VII']

    this.switch = false; // ^

    this.repr = ['circle',
                 'guitar',
            		 'violin',
                 'harp'];
	this.fR = [0.56,0.043,0.065,0.585];
	this.r = 0;

    this.fret = 0;
    this.freVio = 0;
  }

  position(x,y,fact) {
    this.x = x;
    this.y = y;
    this.f = fact;
  }

  clicked(mX,mY) {
    setTimeout(function(){
    	ready = true;
		}, 400);

    var r = this.f*0.2*dimension();
    var a,x,y;

    var found = false;

    var xg = -0.32*dimension();
    var yg = 0.425*dimension();

    // representation selection
    if(!found) {
      y = height/2+yg;
      var nbrr = this.repr.length;
      for(let r = 0; r < nbrr; r++) {
        x = xg+width/2+0.18*(r-0.5*(nbrr-1))*dimension();
        if(mX >  x-this.f*0.3*dimension()/2 &&
           mX <= x+this.f*0.3*dimension()/2 &&
           mY >  y-this.f*0.13*dimension()/2 &&
           mY <= y+this.f*0.13*dimension()/2) {
          this.r = r;
          found = true;
        }
      }
  	}

    // fret selection
    if(this.r == 1) {
      x = width/2-0.02*dimension();
      y = height/2-0.329*dimension();
      if(dist(x,y,mX,mY) <= this.f*0.065*dimension()) {
          this.fret++;
          found = true;
        }
      y -= 0.08*dimension();
      if(dist(x,y,mX,mY) <= this.f*0.065*dimension() && this.fret > 0) {
          this.fret--;
          found = true;
        }
    }

    // degree
    if(!found) {
      for(let n = 0; n < 7; n++) {
        a = PI/2 - n*2*PI/7;
        x = this.x+width/2+r*cos(a)-1.43*r;
        y = height/2+this.y-r*sin(a);
        if(dist(x,y,mX,mY) <= this.f*0.065*dimension()) {
          this.n = n;
          found = true;
        }
      }
    }

    // alteration
    if(!found) {
      x = this.x+width/2+0.64*r;
      r *= 0.85;
      for(let a = 0; a < 3; a++) {
        y = height/2+this.y+(a-1)*r;
        if(dist(x,y,mX,mY) <= this.f*0.065*dimension()) {
          this.a = a;
          found = true;
        }
      }
    }

    // switch
  	if(!found) {
      x = this.x+width/2+2.48*r;
      y = height/2+this.y;
      if(dist(x,y,mX,mY) <= this.f*0.065*dimension()) {
        this.switch = (this.switch?false:true);
        if(this.switch) { // v
          let nbrc = this.chords.length;
          //this.chordsM = [];
          /*for(let c = 0; c < nbrc; c++) {
            var ch = new Chord(concat(new Note(this.n+1,this.a1).name(),
                                      this.chords[c]));
            var inTheScale = true;
            for(let nc = 0; nc < ch.notes.length; nc++) {
              for(let ns = 0; ns < this.scale.notes.length; ns++) {
                if(ch.notes[nc].d == this.scale.notes[ns].d &&
                   ch.notes[nc].n != this.scale.notes[ns].n) {
                  inTheScale = false;
                }
              }
            }
            if(inTheScale) {
              this.chordsM.push(this.chords[c]);
            }
          }*/
          for(let c = 0; c < this.chords.length; c++) {
            if(this.chords[c] == this.chordsM[this.cm]) {
              this.c = c;
            }
          }
          let cho = new Chord(concat(new Note(ndt(this.n+1),
                                              this.a-1).name(),
                                    this.chordsM[this.cm]));
          for(let s = 0; s < cho.scales.length; s++) {
            if(cho.scales[s].name == this.scale.name) {
              this.s = s;
            }
          }
        }
        else { // ^
          this.mc = 0;
          this.scale = this.chord.scales[this.s];
          for(let sca = 0; sca < this.scales.length; sca++) {
            for(let m = 0; m < this.scales[sca].length; m++) {
              if(this.scales[sca][m] == this.chord.scales[this.s].name) {
                this.sca = sca;
                this.ms = m;
              }
            }
          }
          let nbrc = this.chords.length;
          this.chordsM = [];
          this.cm = 0;
          for(let c = 0; c < nbrc; c++) {
            let ch = new Chord(concat(new Note(this.n+1,this.a-1).name(),this.chords[c]));
            let inTheScale = true;
            for(let nc = 0; nc < ch.notes.length; nc++) {
              for(let ns = 0; ns < this.scale.notes.length; ns++) {
                if(ch.notes[nc].d == this.scale.notes[ns].d &&
                   ch.notes[nc].n != this.scale.notes[ns].n) {
                  inTheScale = false;
                }
              }
            }
            if(inTheScale) {
              this.chordsM.push(this.chords[c]);
              if(c == this.c) {
                this.cm = this.chordsM.length-1;
              }
            }
          }
        }
        found = true;
      }
    }

    // chord
    if(!found) {
      x = this.x+width/2+2.48*r;
      y = height/2+this.y-r;
      if(mX >  x-this.f*0.25*dimension()/2 &&
         mX <= x+this.f*0.25*dimension()/2 &&
         mY >  y-this.f*0.13*dimension()/2 &&
         mY <= y+this.f*0.13*dimension()/2) {
        if(this.chordSelect) {
          this.chordSelect = false;
        }
        else {
          this.chordSelect = true;
          this.scaleSelect = false;
        }
        found = true;
      }
    }

    if(this.chordSelect && !found) {
      if(this.switch) { // v
        var posY = -0.15*dimension();
        var nbrc = this.chords.length;
        for(let c = 0; c < this.chords.length; c++) {
          x = this.x+width/2+0.19*(c%3-0.5*(3-1))*dimension();
          y = height/2+posY+0.1*(floor(c/3)-0.5*floor((nbrc-1)/3))*dimension();
          if(mX >  x-this.f*0.3*dimension()/2 &&
             mX <= x+this.f*0.3*dimension()/2 &&
             mY >  y-this.f*0.13*dimension()/2 &&
             mY <= y+this.f*0.13*dimension()/2) {
            this.c = c;
            //this.chordSelect = false;
            this.s = 0;
            let ch = new Chord(concat(new Note(ndt(this.n+1),this.a-1).name(),
                                      this.chords[this.c]));
            let nbrs = ch.scales.length;
            for(let s = 0; s < nbrs; s++) {
              if(ch.scales[s].name == this.scale.name) {
                this.s = s;
              }
            }
            //this.scaleSelect = true;
            found = true;
          }
        }
      }
      else { // ^
        let r = this.f*0.26*dimension();
        let posX = 0;
        let posY = -0.28*dimension();
        let a;
        for(var m = 0; m < 7; m++) {
          a = PI/2 - m*2*PI/7;
          x = this.x+width/2+posX+r*cos(a);
          y = height/2+posY-r*sin(a);
        	if(dist(x,y,mX,mY) <= this.f*0.09*dimension()) {
            var n = this.scale.notes[deg(m-this.mc+1)-1].d-1;
            if(this.n != n) {
            	this.n = n;
              this.a = this.scale.notes[deg(m-this.mc+1)-1].alt()+1;
              this.mc = m;
              this.cm = 0;
          	}
          	found = true;
          }
        }
				if(!found) {
          posY = 0.05*dimension();
          let nbrc = this.chordsM.length;
          for(let c = 0; c < nbrc; c++) {
            switch(nbrc) {
              case 1 :
                x = this.x+width/2;
                break;
              case 2 :
                x = this.x+width/2+0.19*(c-0.5)*dimension();
                break;
              default :
                x = this.x+width/2+0.19*(c%3-0.5*(3-1))*dimension();
        		}
            y = height/2+posY+0.1*(floor(c/3)-0.5*floor((nbrc-1)/3))*dimension();
            if(mX >  x-this.f*0.3*dimension()/2 &&
               mX <= x+this.f*0.3*dimension()/2 &&
               mY >  y-this.f*0.13*dimension()/2 &&
               mY <= y+this.f*0.13*dimension()/2) {
              this.cm = c;
              //this.chordSelect = false;
              found = true;
            }
          }
      	}
      }
    }

    // scale
    if(!found) {
      x = this.x+width/2+2.48*r;
      y = height/2+this.y+r;
      if(mX >  x-this.f*0.25*dimension()/2 &&
         mX <= x+this.f*0.25*dimension()/2 &&
         mY >  y-this.f*0.13*dimension()/2 &&
         mY <= y+this.f*0.13*dimension()/2) {
        if(this.scaleSelect) {
          this.scaleSelect = false;
        }
        else {
          this.scaleSelect = true;
          this.chordSelect = false;
        }
        found = true;
      }
    }

    if(this.scaleSelect && !found) {
      if(this.switch) { // v
        var Y = -0.15*dimension();
        var nbrs = this.chord.scales.length;
        x = this.x+width/2;
        for(let s = 0; s < this.chord.scales.length; s++) {
          y = height/2+Y+0.08*(s-0.5*(nbrs-1))*dimension();
          if(mX >  x-this.f*0.6*dimension()/2 &&
             mX <= x+this.f*0.6*dimension()/2 &&
             mY >  y-this.f*0.13*dimension()/2 &&
             mY <= y+this.f*0.13*dimension()/2) {
            this.s = s;
            //this.scaleSelect = false;
            found = true;
          }
        }
      }
      else { // ^
        let posY = -0.3*dimension();
        x = this.x+width/2;
        let nbrsca = this.scales.length;
        for(let sca = 0; sca < nbrsca; sca++) {
          y = height/2+posY+0.1*(sca-0.5*(nbrsca-1))*dimension();
          if(mX >  x-this.f*0.6*dimension()/2 &&
             mX <= x+this.f*0.6*dimension()/2 &&
             mY >  y-this.f*0.13*dimension()/2 &&
             mY <= y+this.f*0.13*dimension()/2) {
          	this.sca = sca;
            found = true;
          }
        }
        let r = this.f*0.23*dimension();
        let posX = 0;
        posY = 0.04*dimension();
        let a;
        for(let i = 0; i < 7; i++) {
          a = PI/2 - i*2*PI/7;
          x = this.x+width/2+posX+r*cos(a);
          y = height/2+posY-r*sin(a);
          if(dist(x,y,mX,mY) <= this.f*0.075*dimension()) {
            if(i != this.ms) {
            	this.ms = i;
              found = true;
            }
          }
        }
        let nbrc = this.chords.length;
        this.chordsM = [];
        this.cm = 0;
        var scale = new Scale(new Note(this.n+1,this.a-1),this.scales[this.sca][(this.ms+this.mc)%7]);
        for(let c = 0; c < nbrc; c++) {
          let ch = new Chord(concat(new Note(this.n+1,this.a-1).name(),this.chords[c]));
          let inTheScale = true;
          for(let nc = 0; nc < ch.notes.length; nc++) {
            for(let ns = 0; ns < scale.notes.length; ns++) {
            	if(ch.notes[nc].d == scale.notes[ns].d &&
               	 ch.notes[nc].n != scale.notes[ns].n) {
              	inTheScale = false;
              }
            }
          }
          if(inTheScale) {
            this.chordsM.push(this.chords[c]);
          }
        }
      }
    }

    if(found) {
      if(this.switch) { // v
      	this.chord = new Chord(concat(new Note(ndt(this.n+1),
                                               this.a-1).name(),
                                      this.chords[this.c]));
      }
      else { // ^
        this.scale = new Scale(new Note(this.n+1,this.a-1),
                               this.scales[this.sca][(this.ms+this.mc)%7]);
      }
      this.draw();
  	}
  }

  draw() {
    noStroke();
    fill(255);
    rectMode(CENTER);
  	rect(width/2,
         height/2,
         3/2*dimension(),
      	 dimension());

    let posX = 0;
    let posY = this.y;
    let fact = this.f;

    var xg = -0.32*dimension();
    var yg = 0.425*dimension();

    // representation selection
    var nbrr = this.repr.length;
    var x;
    var y = height/2+yg;
    textAlign(CENTER,CENTER);
    textSize(fact*0.065*dimension());
    stroke(87);
    strokeWeight(lineWeight());
    line(xg+width/2-0.2*(0.5*(nbrr-1))*dimension(),
         y,
         xg+width/2+0.2*(nbrr-1-0.5*(nbrr-1))*dimension(),
         y);
    rectMode(CENTER);
    for(let r = 0; r < nbrr; r++) {
      x = xg+width/2+0.18*(r-0.5*(nbrr-1))*dimension();
      if(r == this.r) {
        noStroke();
        fill(87);
        rect(x,y,fact*0.3*dimension(),fact*0.13*dimension());
        fill(217);
        text(this.repr[r],x,y+fact*0.003*dimension());
      }
      else {
        noStroke();
        fill(217);
        rect(x,y,fact*0.3*dimension(),fact*0.13*dimension());
        fill(87);
        text(this.repr[r],x,y+fact*0.003*dimension());
      }
    }

    // text
    if(!this.chordSelect && !this.scaleSelect) {
      x = width/2+this.x;
      y = height/2-0.4*dimension();
      noStroke();
      fill(87);
      textSize(fact*0.2*dimension());
      text('Diatonic Lab',x,y);
      x = width/2+this.x-0.26*dimension();
      y = height/2-0.08*dimension();
      textAlign(LEFT,CENTER);
      textSize(fact*0.06*dimension());
      text('This app works in two modes. The switch\nfrom one to the other is done by clicking\nthe arrow below. The modes are:\n\n      Scale to chord (up)\n\n            Choose a scale, and explore\n            the chords within this scale\n\n      Chord to scale (down)\n\n            Pick a chord, and choose\n            a scale matching that chord',x,y);
      textAlign(CENTER,CENTER);
    }

    // degree
    var r = fact*0.2*dimension();
    stroke(87);
    strokeWeight(lineWeight());
    noFill();
  	circle(this.x+width/2+posX-1.43*r,height/2+posY,r);
    var a;
    noStroke();
    textSize(fact*0.065*dimension());
    for(let i = 0; i < 7; i++) {
			a = PI/2 - i*2*PI/7;
    	x = this.x+width/2+posX+r*cos(a)-1.43*r;
    	y = height/2+posY-r*sin(a);
      if(i == this.n) {
        fill(87);
        circle(x,y,fact*0.065*dimension());
    	fill(217);
    	text(this.notes[i],x,y+fact*0.0065*dimension());
      }
      else {
        fill(217);
        circle(x,y,fact*0.065*dimension());
    	fill(87);
    	text(this.notes[i],x,y+fact*0.0065*dimension());
      }
    }

    // alteration
    x = this.x+width/2+posX+0.64*r;
    r *= 0.85;
    stroke(87);
    line(x,height/2+posY-r,x,height/2+posY+r);
    for(let i = 0; i < 3; i++) {
    	y = height/2+posY+(i-1)*r;
      if(i == this.a) {
        noStroke();
        fill(87);
        circle(x,y,fact*0.065*dimension());
        fill(217);
    		text(this.alterations[i],x,y+fact*0.0065*dimension());
      }
      else {
        noStroke();
        fill(217);
        circle(x,y,fact*0.065*dimension());
        fill(87);
    		text(this.alterations[i],x,y+fact*0.0065*dimension());
      }
    }

    // switch
    x = this.x+width/2+posX+2.48*r;
    stroke(87);
    line(x,height/2+posY-r,x,height/2+posY+r);
    y = height/2+posY;
    if(this.switch) {	// v
      noStroke();
      fill(217);
      circle(x,y,fact*0.065*dimension());
      stroke(87);
      line(x,y+0.018*dimension(),
           x,y-0.018*dimension());
      line(x-0.01*dimension(),y,
           x,y+0.018*dimension());
      line(x+0.01*dimension(),y,
           x,y+0.018*dimension());
    }
    else {
      noStroke();
      fill(217);
      circle(x,y,fact*0.065*dimension());
      stroke(87);
      line(x,y+0.018*dimension(),
           x,y-0.018*dimension());
      line(x-0.01*dimension(),y,
           x,y-0.018*dimension());
      line(x+0.01*dimension(),y,
           x,y-0.018*dimension());
    }

    // chord
    x = this.x+width/2+posX+2.48*r;
    y = height/2+posY-r;
    if(this.chordSelect) {
      noStroke();
      fill(87);
      rect(x,y,fact*0.25*dimension(),fact*0.13*dimension());
      fill(217);
      text('chord',x,y+fact*0.003*dimension());
      if(this.switch) { // v
        posY = -0.15*dimension();
        fill(255);
        rectMode(CENTER);
        rect(width/2+this.x,height/2+posY,dimension(),0.55*dimension());
        var nbrc = this.chords.length;
        for(let c = 0; c < nbrc; c++) {
          x = this.x+width/2+0.19*(c%3-0.5*(3-1))*dimension();
          y = height/2+posY+0.1*(floor(c/3)-0.5*floor((nbrc-1)/3))*dimension();
          noStroke()
          if(c == this.c) {
            fill(87);
            rect(x,y,fact*0.3*dimension(),fact*0.13*dimension());
            fill(217);
            text(this.notes[this.n].concat(
                 this.alterations[this.a],
                 this.chords[c]),
                 x,y+fact*0.003*dimension());
          }
          else {
            fill(217);
            rect(x,y,fact*0.3*dimension(),fact*0.13*dimension());
            fill(87);
            text(this.notes[this.n].concat(
                 this.alterations[this.a],
                 this.chords[c]),
                 x,y+fact*0.003*dimension());
          }
        }
    	}
      else { // ^
        let r = fact*0.26*dimension();
        let posX = 0;
        let posY = -0.28*dimension();
        stroke(87);
        strokeWeight(lineWeight());
        noFill();
        circle(this.x+width/2+posX,height/2+posY,r);
        let a;
        noStroke();
        for(var i = 0; i < 7; i++) {
          a = PI/2 - i*2*PI/7;
          x = this.x+width/2 +posX+r*cos(a);
          y = height/2+posY-r*sin(a);
          var s = this.scale.notes[deg(i-this.mc+1)-1].name();
          var t = this.scale.alt(i-this.mc+1,3);
          var q = this.scale.alt(i-this.mc+1,5);
          if(t == -1 && q == -1) {
            s = concat(s,'°');
          }
          else if(t == -1 && q == 0) {
            s = concat(s,'m');
          }
          else if(t == 0 && q == 1) {
          	s = concat(s,'+');
          }
          fill(i==this.mc?87:217);
          circle(x,y,fact*0.09*dimension());
          fill(i==this.mc?217:87);
          text(s,x,y+fact*0.0065*dimension());
        }

        let nbrc = this.chords.length;
        posY = 0.05*dimension();
        this.chordsM = [];
        for(let c = 0; c < nbrc; c++) {
          var ch = new Chord(concat(new Note(this.n+1,this.a-1).name(),this.chords[c]));
          var inTheScale = true;
          for(let nc = 0; nc < ch.notes.length; nc++) {
            for(let ns = 0; ns < this.scale.notes.length; ns++) {
            	if(ch.notes[nc].d == this.scale.notes[ns].d &&
               	 ch.notes[nc].n != this.scale.notes[ns].n) {
              	inTheScale = false;
              }
            }
          }
          if(inTheScale) {
            this.chordsM.push(this.chords[c]);
          }
        }
        nbrc = this.chordsM.length;
        for(let c = 0; c < nbrc; c++) {
          switch(nbrc) {
            case 1 :
              x = this.x+width/2;
              break;
            case 2 :
              x = this.x+width/2+0.19*(c-0.5)*dimension();
              break;
            default :
          		x = this.x+width/2+0.19*(c%3-0.5*(3-1))*dimension();
        	}
          y = height/2+posY+0.1*(floor(c/3)-0.5*floor((nbrc-1)/3))*dimension();
          noStroke()
          if(c == this.cm) {
            fill(87);
            rect(x,y,fact*0.3*dimension(),fact*0.13*dimension());
            fill(217);
            text(this.notes[this.n].concat(
                 this.alterations[this.a],
                 this.chordsM[c]),
                 x,y+fact*0.003*dimension());
          }
          else {
            fill(217);
            rect(x,y,fact*0.3*dimension(),fact*0.13*dimension());
            fill(87);
            text(this.notes[this.n].concat(
                 this.alterations[this.a],
                 this.chordsM[c]),
                 x,y+fact*0.003*dimension());
          }
        }
      }
    }
    else {
      noStroke();
    	fill(217);
    	rect(x,y,fact*0.25*dimension(),fact*0.13*dimension());
    	fill(87);
    	text('chord',x,y+fact*0.003*dimension());
    }

    // scale
    x = this.x+width/2+2.48*r;
    y = height/2+this.y+r;
    if(this.scaleSelect) {
      noStroke();
      fill(87);
      rect(x,y,fact*0.25*dimension(),fact*0.13*dimension());
      fill(217);
      text('scale',x,y+fact*0.003*dimension());
      if(this.switch) { // v
        posY = -0.15*dimension();
        var nbrs = this.chord.scales.length;
        x = this.x+width/2+posX;
        for(let s = 0; s < nbrs; s++) {
          y = height/2+posY+0.08*(s-0.5*(nbrs-1))*dimension();
          noStroke()
          if(s == this.s) {
            fill(87);
            rect(x,y,fact*0.6*dimension(),fact*0.13*dimension());
            fill(217);
            text(this.chord.scales[s].name.slice(0,20),
                 x,y+fact*0.003*dimension());
          }
          else {
            fill(217);
            rect(x,y,fact*0.6*dimension(),fact*0.13*dimension());
            fill(87);
            text(this.chord.scales[s].name.slice(0,20),
                 x,y+fact*0.003*dimension());
          }
        }
    	}
    	else { // ^
        posY = -0.3*dimension();
        x = this.x+width/2;
        let nbrsca = this.scales.length;
        for(let sca = 0; sca < nbrsca; sca++) {
          y = height/2+posY+0.1*(sca-0.5*(nbrsca-1))*dimension();
          noStroke()
          if(sca == this.sca) {
            fill(87);
            rect(x,y,fact*0.6*dimension(),fact*0.13*dimension());
            fill(217);
            text(this.scales[sca][this.ms],
                 x,y+fact*0.003*dimension());
          }
          else {
            fill(217);
            rect(x,y,fact*0.6*dimension(),fact*0.13*dimension());
            fill(87);
            text(this.scales[sca][this.ms],
                 x,y+fact*0.003*dimension());
          }
        }
        let r = fact*0.23*dimension();
        let posX = 0;
        posY = 0.04*dimension();
        stroke(87);
        strokeWeight(lineWeight());
        noFill();
        circle(this.x+width/2+posX,height/2+posY,r);
        let a;
        noStroke();
        for(let i = 0; i < 7; i++) {
          a = PI/2 - i*2*PI/7;
          x = this.x+width/2 +posX+r*cos(a);
          y = height/2+posY-r*sin(a);
          fill(i==this.ms?87:217);
          circle(x,y,fact*0.075*dimension());
          fill(i==this.ms?217:87);
          text(this.modes[i],x,y+fact*0.0065*dimension());
        }
      }
    }
    else {
      noStroke();
    	fill(217);
    	rect(x,y,fact*0.25*dimension(),fact*0.13*dimension());
    	fill(87);
    	text('scale',x,y+fact*0.003*dimension());
    }

    // fret selection
    if(this.r == 1) {
      x = width/2-0.02*dimension();
      y = height/2-0.329*dimension();
      noStroke();
      fill(87);
      textSize(fact*0.15*dimension());
      text(this.fret,x-0.09*dimension(),y-0.04*dimension());
      stroke(87);
      line(x,y,x,y-0.08*dimension());
      noStroke();
      fill(217);
      circle(x,y,fact*0.065*dimension());
      stroke(87);
      line(x,y+0.018*dimension(),
           x,y-0.018*dimension());
      line(x-0.01*dimension(),y,
           x,y+0.018*dimension());
      line(x+0.01*dimension(),y,
           x,y+0.018*dimension());
      y -= 0.08*dimension();
      noStroke();
      fill(217);
      circle(x,y,fact*0.065*dimension());
      stroke(87);
      line(x,y+0.018*dimension(),
           x,y-0.018*dimension());
      line(x-0.01*dimension(),y,
           x,y-0.018*dimension());
      line(x+0.01*dimension(),y,
           x,y-0.018*dimension());
    }

  	this.redraw();
  }

  redraw() {
    var posX = -0.32*dimension();
    var posY = -0.07*dimension();
    noStroke();
    fill(255);
    circle(width/2+posX,height/2+posY,2*this.fR[this.r]*0.36*dimension());

    if(audioSwitch && this.r == 0) {
      var pitchClass = 12*log(freq/16.3515)/log(2);
      while(pitchClass >= 12) {
        pitchClass -= 12;
      }
      var fact = 1.5*this.fR[this.r];
      var r = fact*0.36*dimension();
      var a = PI/2 - pitchClass*PI/6;
      if(Math.abs(angle - a) > PI) {
        if(a < angle) {
          angle -= 2*PI;
        }
        else {
          angle += 2*PI;
        }
      }
      if(Math.abs(angle - a) > 2*PI/3) {
        angle = a;
      }
      else {
        angle = lerp(angle, a, 0.1);
      }
      //angle = a;
      let x = width/2 +posX+r*cos(angle);
      let y = height/2+posY-r*sin(angle);
      fill(87);
      circle(x,y,fact*1.3*0.08*dimension());
    }

    // representated scale
    if(this.switch) { // v
      this.chord.drawScale(this.repr[this.r],
                           this.s,
                           posX,posY,
                           1.5*this.fR[this.r],this.fret,this.freVio);
    }
    else { // ^
      this.scale.drawChord(this.repr[this.r],
                           new Chord(concat(new Note(this.n+1,
                                                     this.a-1).name(),
                                            this.chordsM[this.cm])),
                           posX,posY,
                           1.5*this.fR[this.r],this.fret,this.freVio);
    }
    textSize(this.f*0.065*dimension());
  }
}

function pitchToFreq(pitCla) {
  return 27.5 * pow(2,(pitCla-21)/12); // A0 = 27.5 Hz = 21 (MIDI number)
}

function pitchToFreqs(pitCla) {
  var fpc = pitchToFreq(pitCla);
  var freqs = new Array();

  freqs[0] = fpc / pow(2,1/24);
  freqs[1] = fpc * pow(2,1/24);

  return freqs;
}

var selector = new Selector();

var audioContext;
var mic, freq;
var audioSwitch = false;
var micLevel;

function setup()
{
  createCanvas(windowWidth,windowHeight);
	background(255);

  selector.position(0.4*dimension(),0.35*dimension(),0.48);
  selector.draw();

  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  micLevel = mic.getLevel();
  mic.start(startPitch);

  // Start the audio context on a click/touch event
  userStartAudio().then(function() {
     console.log('Oooooooooook !!!');
   });
}

function draw() {
}

function windowResized()
{
  resizeCanvas(windowWidth,windowHeight);
  background(255);

  selector.position(0.4*dimension(),0.35*dimension(),0.48);
  selector.draw();
}

function mousePressed() {
  if(ready) {
    ready = false;
  	ready = selector.clicked(mouseX,mouseY);
  }
}

function startPitch() {
  pitch = ml5.pitchDetection('./model/', audioContext , mic.stream, modelLoaded);
}

function modelLoaded() {
  console.log('Model loaded');
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    //micLevel = mic.getLevel();
    micLevel = lerp(micLevel,mic.getLevel(),0.1);
    if (frequency && micLevel > 0.05) {
      audioSwitch = true;
      freq = frequency;
      selector.redraw();
    } else if(audioSwitch == true) {
      audioSwitch = false;
      selector.redraw();
      console.log('No pitch detected');
    }
    getPitch();
  })
}
