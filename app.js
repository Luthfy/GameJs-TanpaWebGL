var kotak;
var balok = [];
var skor;

// fungsi memulai game
function startGame()
{
    kotak = new component(20, 20, "blue", 30, 120); // kotak dibuat
    skor = new component("30px", "Consolas", "black", 280, 40, "text"); // papan skor dibuat

    kotak.gravity = 0.05; // set efek gravitasi
    
    AreaGame.start(); // Area Game dijalankan
}

// variabel Area Game
var AreaGame = {
    // node area canvas di ciptakan
    canvas : document.createElement("canvas"),

    // memulai area game
    start : function() {
        this.canvas.width  = 480; // Panjang area canvas
        this.canvas.height = 270; // Lebar area canvas
        this.context       = this.canvas.getContext("2d"); // menandakan bahwa object canvas 2D
                             document.body.insertBefore(this.canvas, document.body.childNodes[0]); // membuat canvas di html
        
        this.skorSementara = 0,
        this.interval      = setInterval(perbaruiAreaGame, 20); // ini akan memperbarui area game dalam waktu 0.002 detik
    }, clear : function() {
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height); // method clear, akan mereset posisi dan besaran canvas
    }
}

function component(width, height, color, x, y, type) 
{
    this.type = type;       // untuk membedakan objek game dan objek teks
    this.score = 0;         // set nilai dipapan skor awal
    this.width = width;     // set panjang objek
    this.height = height;   // set lebar objek
    this.speedX = 0;        // set kecepatan awal maju
    this.speedY = 0;        // set kecepatan awal naik
    this.x = x;             // set posisi objek koordinat x
    this.y = y;             // set posisi objek koordinat y
    this.gravity = 0;       // set gravitasi awal
    this.gravitySpeed = 0;  // set kecepatan gravitasi awal

    // method pembaruan / update, method ini akan membuat objek baru didalam canvas
    this.update = function () {
        ctx = AreaGame.context;
        if (this.type == "text") {
            ctx.font      = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    // method newPos, method ini akan memindahkan objek  setiap waktunya dan akan memeriksa apakah objek menabrak atau tidak
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }

    // method hitBottom, method ini akan menahan/menghentikan kotak tetap pada atas objek
    this.hitBottom = function () {
        var rockbottom = AreaGame.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }

    // method crashWith, method ini akan melakukan pengecekan apakah objek menabrak
    this.crashWith = function (objekmusuh) {
        var kirikotak   = this.x;
        var kanankotak  = this.x + (this.width);
        var ataskotak   = this.y;
        var bawahkotak  = this.y + (this.height);
        var bataskiri   = objekmusuh.x;
        var bataskanan  = objekmusuh.x + (objekmusuh.width);
        var batasatas   = objekmusuh.y;
        var batasbawah  = objekmusuh.y + (objekmusuh.height);
        var tabrakan    = true;

        // pengecekan dilakukan disini
        if ((bawahkotak < batasatas) || (ataskotak > batasbawah) || (kanankotak < bataskiri) || (kirikotak > bataskanan)) {
            tabrakan = false;
        }
        return tabrakan;
    }
}

// method perbaruiAreaGame, method ini akan memperbarui area game
function perbaruiAreaGame () {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    // jika kotak menabrak balok
    for (i = 0; i < balok.length; i += 1) {
        if (kotak.crashWith(balok[i])) {
            return;
        }
    }

    AreaGame.clear(); // area game yang lama dihapus
    AreaGame.skorSementara += 1;

    // penambahan objek musuh baru
    if (AreaGame.skorSementara == 1 || everyinterval(150)) {
        x           = AreaGame.canvas.width;
        minHeight   = 20;
        maxHeight   = 200;
        height      = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap      = 50;
        maxGap      = 200;
        gap         = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

        // mendaftarkan objek musuh baru
        balok.push(new component(10, height, "yellow", x, 0));
        balok.push(new component(10, x - height - gap, "green", x, height + gap));
    }


    for (i = 0; i < balok.length; i += 1) {
        balok[i].x += -1;
        balok[i].update();
    }

    skor.text = "SCORE: " + AreaGame.skorSementara;
    skor.update();

    kotak.newPos();
    kotak.update();
}

function everyinterval(n) {
    if ((AreaGame.skorSementara / n) % 1 == 0) { return true; }
    return false;
}

function accelerate(n) {
    kotak.gravity = n;
}
