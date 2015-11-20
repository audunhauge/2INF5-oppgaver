    /*
     *  Spillet er basert på breakout
     *
    */

    var brett = { width:470, height:300 };
       // dimensjonene på brettet
    var b;                 // ballen
    var bat;               // den som slår ballen
    var mou = {x:0, y:0};  // mouse position
    var soundeffect;       // lyder brukt i spillet
    var timer;             // slik at vi kan slå den av/på
    var playing = false;   // settes true når spillet er i gang
    var poeng = 0;         // poeng er Number
    var username = "";
    var alder = 0;
    var antall = 8;
    var speed = 2;
    var brikker = [];      // skal inneholde alle brikkene
    var speedValues = [100,80,60,35,22];



    /**
     *   Bruker har klikket på knappen
     *   for å lagre info
     */
    function lagreInfo() {
      username = document.getElementById("username").value;
      // antall rader med brikker
      antall = +document.querySelector("#antall").value;
      if (antall < 2 || antall > 12) {
         antall = 8;
      } 
      

      // styrer hastigheten på spillet, max fart for speed==5
      speed = +document.querySelector("#speed").value;
      if (speed < 1 || speed > 5) {
        speed = 2;
      }

      alder = +document.getElementById("alder").value;
      if (alder > 17 || true) {
        startSpill();
        var personalia = document.getElementById("personalia");
        personalia.style.display = "none";
      } else {
        alert("du er for ung!!");
      }
    }
    
    /**
      * Fanger opp musbevegelser
      * får tak i mouse position og lagrer i m
      * dersom bat finnes da plasseres den
      * etter m.x
      * @param  {Object} e mouseevent
     */
    document.onmousemove = function(e) {
      mou.x = e.pageX;
      mou.y = e.pageY;
      if (bat != undefined) {
        var oldpos = bat.xpos;
        bat.xpos = Math.max(0,Math.min(400,mou.x-64));
        bat.xfart = (bat.xfart + bat.xpos - oldpos)/2;
        // dette er beregna xfart ut fra endring i posisjon
        // gjennomsnitt av siste endring og denne
        bat.style.left = bat.xpos + "px";
      }
    }

    /**
     *   lag intro animasjonen
     *   når den er ferdig da startes spillet
     */
    function startSpill() {
      var animasjon = new TimelineMax();
      var animering = true;
      var intro = document.getElementById("intro");
      intro.style.display = "block";
      soundeffect = new Howl({
          urls: ['sounds.mp3'],
          sprite: { bounce: [0, 500], miss: [500, 400], car:[1000,8000]
          }
      });

      animasjon.from("#bil", 9, 
        { left:400,
          width:30,
          height:30,
          rotation:5
        }   // start spillet når intro ferdig
      ).to("#box1",2,{rotation:45,x:180,y:150},"-=3")
       .to("#box2",3,{rotation:15},"-=4")
       .to("#box3",3,{rotation:10},"-=4")
       .to("#box2",1.5,{rotation:15,x:80,y:150},"-=2.5")
       .to("#box3",1,{x:30,y:150},"-=1.5")
       .from("#logo",5,{opacity:0,onComplete:startGame},"-=3"); 

      animasjon.play();

      soundeffect.play("car");
      Mousetrap.bind('q', function() {
          if (animering) {
            animasjon.kill();
            soundeffect.stop();
            startGame();
            animering = false;
          }
        }, 'keyup');

    }

    /**
     *  dytt introen utforbi skjermen
     *  <br>legg spillebrettet på riktig plass
     *  <br>lag en div for ball
     *  <br>lag en div for bat
     *  <br>plasser spill-objekter p? brett
     *  <br>start timeren
     *  <br>last inn fil med lyd-effekter
     */
    function startGame() {
      var brett = document.getElementById("brett");
      var intro = document.getElementById("intro");
      var brick;  // brukes til å lage brikker
      var i,j;    // løkke-variable
      var brikkeFarge;  // farge på en rad med brikker

      brett.style.left = "30px";
      intro.style.left = "-530px";
      

      bat = document.createElement('div');
      bat.className = "batty";
      bat.id = "bat";
      brett.appendChild(bat);
      bat.xpos = 250;
      bat.ypos = 280;
      bat.width = 50;
      bat.height = 16;
      bat.xfart = 0;   // beregnes ut fra siste endring
      bat.style.top = bat.ypos + "px";
      bat.style.left = bat.xpos +"px";
      for (j = 0; j < antall; j += 1) {
        brikkeFarge = wildColor();
        for (i = 0; i < 15; i += 1) { 
          brick = document.createElement('div');
          brick.className = "brick";
          brett.appendChild(brick);
          brick.xpos = 8 + (j % 2) * 14 + i*29;
          brick.ypos = 5  + j*16;
          brick.width = 25;
          brick.height = 12;
          brick.alive = true;   // this brick still alive
          brick.style.top = brick.ypos + "px";
          brick.style.left = brick.xpos +"px";
          brick.style.background = brikkeFarge;
          brikker.push(brick);
        }
      }

      b = document.createElement('div');
      b.className = "ball";
      b.id = "ball";
      brett.appendChild(b);
      b.xfart = 3;
      b.yfart = 5;
      b.width = 10;
      b.height = 10;
      b.xpos = 120;
      b.ypos = 200;
      b.belowbat = false;
        // true dersom bunn av ball
        // kommer under top av bat
      b.style.top = b.ypos + "px";
      b.style.left = b.xpos +"px";
      b.bounce = 0;  // telles ned for å fjerne bounce animation

      

      timer = setInterval(animerBall,speedValues[speed-1]);
      playing = true;


      Mousetrap.bind('p', function() {
           if (playing && timer) {
              clearInterval(timer);
              playing = false;
           } else {
              timer = setInterval(animerBall,50);
              playing = true;
           }
        }, 'keyup');
    }

    /**
      * For hver frame skal ballen flyttes
      * sjekk kollisjon mot kanter
      * sjekk om ball treffer bat
      */
    function animerBall() {
      var goodPos = true;  // anta at vi er ok
      var animasjon = new TimelineMax();

      // sjekk om vi treffer bunn eller bat
      if (b.ypos + b.height > bat.ypos) {
         if (collision(b,bat)) {
            // ballen traff bat - vi snur y-farten
            poeng += 1;
            //poeng = poeng + 4;
            b.yfart = - Math.abs(b.yfart);
            soundeffect.play("bounce");
            b.className = "ball bonk"; // turn on bounce
            b.bounce = 5;
            if (b.belowbat) {
              // vi traff fra en av sidene
              b.xfart = -b.xfart;
              b.belowbat = false;
            }
            // juster ballfarten med 50% av bat sin fart
            b.xfart += bat.xfart * 0.5;
            b.ypos = bat.ypos-b.height;
            // plasserer ballen paa bat
            b.style.top = b.ypos + "px";
            goodPos = false;
         } else if (b.ypos + b.yfart + b.height > brett.height) {
            // ballen vil komme nedenfor bunn av brett
            // taper poeng når jeg mister en ball
            poeng -= 10;
            soundeffect.play("miss");
            b.style.background = wildColor();
            b.xpos = bat.xpos+(bat.width-b.width)/2;
            b.ypos = bat.ypos-ball.height;
            b.yfart = -Math.random()*5-2;
            b.xfart = Math.random()*4+2;
            b.belowbat = false;
         } else {
            // naar vi kommer hit er bunn av ballen
            // under top av bat, men over bunn av brett
            // sjekk om vi kolliderer neste gang.
            // dersom vi gjør det - da har vi truffet
            // ballen med siden av bat
            b.belowbat = true;
         }
      } 
      b.bounce = Math.max(0,b.bounce-1)
      if (b.bounce == 1) {
        b.className="ball";
      }

      if (b.ypos + b.yfart < 0) {
          // treffer toppen av brett
          b.ypos = 0;
          b.yfart = Math.abs(b.yfart);
          soundeffect.play("bounce");
          goodPos = false;
          b.className = "ball bonk"; // turn on bounce
          b.bounce = 5;
      }
      if (b.xpos + b.xfart > brett.width - 16 ) {
          // treffer høyre kant
          b.xpos = brett.width - 16;
          b.xfart = -Math.abs(b.xfart);
          soundeffect.play("bounce");
          goodPos = false;
          b.className = "ball bank"; // turn on bounce
          b.bounce = 5;
      }
      if (b.xpos + b.xfart < 0) {
          // treffer venstre kant
          b.xpos = 0;
          b.xfart = Math.abs(b.xfart);
          soundeffect.play("bounce");
          goodPos = false;
          b.className = "ball bank"; // turn on bounce
          b.bounce = 5;
      }
      if (goodPos) {
        b.xpos = b.xpos + b.xfart;
        b.ypos = b.ypos + b.yfart;       
      }
      b.style.top = b.ypos + "px";
      b.style.left = b.xpos + "px";

      var intro = document.getElementById("poeng");
      intro.innerHTML = ""+poeng;


      if (poeng > 1600) {
        clearInterval(timer);
        playing = false;
        animasjon.to("#victory", 1, { left:30} );
        var score = document.getElementById("score");
        score.innerHTML = "Hei " + username + "<p>Du fikk " + poeng + " poeng";

      }
      if (sjekkKollisjonMotBrikker(b)) {
        poeng += 1000;
        // det er ingen brikker igjen
      }
    }


    /**
     * sjekker kollisjon mellom ball og brikker
     * dersom det er kollisjon fjernes denne brikken fra
     * spillet og poeng øker med 10
     * @param  {object} ball 
     * @return {boolean} true dersom ingen brikker aktive
     */
    function sjekkKollisjonMotBrikker(ball) {
      var brick;
      var i;
      var ghost = { width:ball.width, height:ball.height };
      var noneLeft = true;  // anta at ingen brikker finnes lenger
    
      for (i=0; i< brikker.length;i++) {
        brick = brikker[i];
        if (brick.alive) {
          noneLeft = false;
          if (brick.alive && collision(ball,brick)) {
            // vi traff en brikke
            // sjekk om ghost treffer når vi fjerner xfart
            ghost.xpos = ball.xpos - ball.xfart;
            ghost.ypos = ball.ypos;
            if (collision(ghost,brick)) {
              // treff hovedsakelig i y-retning
              ball.yfart = -ball.yfart;
            } else {
              // sjekk kollisjon uten yfart
              ghost.xpos = ball.xpos;
              ghost.ypos = ball.ypos - ball.yfart;
              if (collision(ghost,brick)) {
                // treff hovedsakelig i x-retning
                ball.xfart = -ball.xfart;
              } else {
                // begge fartskomponenter viktig for kollisjon
                ball.xfart = -ball.xfart;
                ball.yfart = -ball.yfart;
              }
            }
            brick.style.display = "none";
            soundeffect.play("bounce");
            brick.alive = false;
            poeng += 10
            return false;  // hopp ut av kollisjonstesten
          }
        }
      }
      return noneLeft;
       
    }

    /**
     * Generer tilfeldig heltall 1..m
     * @param  {int} m maks verdi
     * @return {int} 1..m
     */
    function randint(m) {      
      return Math.round(Math.random()*m+1);
    }

    /**
     * Generer tilfeldig rgb(0..255,0..255,0..255)
     * @return {String} "rgb(..)"
     */
    function wildColor() {
      var tall = [1,1,1].map(function(e) { return randint(255);}).join(",");
      return "rgb("+tall+")";
    }

    /**
      * sjekker om to objekter a og b overlapper
      * Begge obj må ha egenskapene width,height,xpos,ypos
      * @param {obj} a 
      * @param {obj} b
      * @return {Bool} true if overlap
      */
    function collision(a,b) {
      return (    a.xpos >= b.xpos - a.width
               && a.xpos <= b.xpos + b.width
               && a.ypos >= b.ypos - a.height
               && a.ypos <= b.ypos + b.height);
    }
