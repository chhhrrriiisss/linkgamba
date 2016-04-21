// Check for stored mute state
var settings = JSON.parse(localStorage.getItem('linkgamba-settings'));

// Set default settings if none exist currently
if (settings == null) {
    var settings = {};
    settings.mute = false;
    localStorage.setItem('linkgamba-settings', JSON.stringify(settings));
}

 // console.log('Mute state is: ' + settings.mute);

// Placeholder for imgurlink array
var imgurLinks = [];
var selectedImgurLink = '';

function selectRandomImage(array) {

    var rand = array[Math.floor(Math.random() * array.length)];
    // console.log('Selected URL:' + rand);
    return rand;
}

// Roulette Wheel config
var options = ['default'];
var angles = [0];
var startAngle = 0;
var arc = Math.PI / (options.length / 2);

var spinTimeout = null;
var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
var spinComplete = false;
var selectedTile = -1;

var ctx;

function drawRouletteWheel(images) {    

    options = images;

    // console.log(images.length);

    arc = Math.PI / (images.length / 2);
    maxImageWidth = 100 - ((images.length - 6) * 5);
    maxImageHeight = maxImageWidth;

    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {

        var outsideRadius = 225;
        var insideRadius = 80;
        var borderRadius = 235;
        var textRadius = 160;

        var cx = canvas.width / 2;
        var cy = canvas.height / 2;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 1000, 1000);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.font = 'bold 12px Helvetica, Arial';

        for (var i = 0; i < images.length; i++) {

            var angle = startAngle + i * arc;

            angles[i] = angle;

            //ctx.fillStyle = colors[i];
            var color = primaryWheelColour;
            if (i % 2 == 0) {
                color = secondaryWheelColour;
            } else {
                color = primaryWheelColour;
            }

            var d = new Date;
            var t = d.getTime();

            if (i == selectedTile && t % 2 == 0) {
            	color = highlightWheelColour;
            }

            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.arc(cx, cy, outsideRadius, angle, angle + arc, false);
            ctx.arc(cx, cy, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.shadowOffsetX = -1;
            ctx.shadowOffsetY = -1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = "rgb(220,220,220)";
            ctx.fillStyle = "black";
            ctx.translate(cx + Math.cos(angle + arc / 2) * textRadius,
                cy + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            var image = images[i];

            ctx.drawImage(image, -maxImageHeight / 2, -maxImageWidth / 2, maxImageWidth, maxImageHeight);

            // ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }

    }

}

function spin() {
    // console.log('triggered');
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    if (spinTimeTotal == 0) { 
        spinTimeTotal = Math.random() * minSpinTime + spinTimeDif * 1000; 
    } else {
        spinTimeTotal += Math.random() * minSpinTimeOnPress + spinTimeDifOnPress * 1000;
    }

    rotateWheel();

    // console.log(spinTimeTotal + ' / ' + spinTime);
}

function rotateWheel() {
    spinTime += wheelRotateSpeed;
    
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel(options);
    spinTimeout = setTimeout('rotateWheel()', 30);
}

function highlightTile() {

	// console.log('running...');

	if (selectedTile == -1) {
		return
	}

	drawRouletteWheel(options);
	setTimeout('highlightTile()', flickerIntensity);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.restore();

    selectedTile = index;
    highlightTile();

    setTimeout(function() {
    	window.location.href = selectedImgurLink;
    	selectedTile = -1;
    }, timeoutBeforeRedirectInMs);

    $('#spin').removeAttr("disabled");

    spinTimeTotal = 0;

}

function easeOut(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}


// function getImageID(href) {

//     var imgurRegex = \/w+http://(?:i\.imgur\.com/(?<id>.*?)\.(?:jpg|png|gif)|imgur\.com/(?:gallery/)?(?<id>.*))$/;
//     return imgurRegex.test(href);
// }

$(function() {  

    function validateImageLink(link) {

        var id = getImageID(link);

        // Test check image
        $.ajax({
            url: "https://api.imgur.com/3/image/" + id,
            type: "GET",
            dataType: 'json',
            headers: { 
                'Authorization': 'Client-ID 28c485e97f1db13'
            },
            success: function(data, link) {
                selectedImgurLink = id;
            },
            error: function(err) {
                validateImageLink( selectRandomImage(imgurLinks) );
            }
        });

    }



	// Load all imgur links
    $.ajax({
        url: "links.txt",
        dataType: "text",
        async: true,
        success: function(data) {
            imgurLinks = data.split("\n");
        }
    });

    var emotes = [];    

    // Load all wheel emotes from img/emotes
    $.ajax({

        url: emoteDirectory,
        success: function(data) {

            var regexp = /\d+(\.png|\.jpg|\.gif)/;

            // console.log(data);

            // List all pngs found in this dir
            $(data).find("a:contains(.png)").filter(function() {
                return $(this);
            }).each(function() {

                // Strip http
                var filename = this.href.replace(window.location.href.replace(/#.*$/, ''), "").replace("http://", "");
                imageList.push(emoteDirectory + filename + '?v=3');

            });

            preloadImages(imageList);
        }
    });

   
    function preloadImages(list) {

        var loadCounter = 0;
        var len = list.length;
        var expectedImages = len;
        var loadCounter = 0;

        for (var i = 0; i < len; i++) {

            var img = new Image();
            img.id = i;
            img.onError = function() {
                expectedImages--;
            };
            img.onload = function() {

                var w = this.width;
                var h = this.height;
                emotes.push(this);
                loadCounter++;
                if (loadCounter >= expectedImages) {

                    // All images loaded - initialize roulette wheel!
                    drawRouletteWheel(emotes);

                    $('#preloader').fadeOut();

                }
            }

            img.src = list[i];

        }

    }

    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'assets/audio/gamba.mp3');

    var $muteButton = $('#mute-button');
    var $spinButton = $('#spin');

    var mutex = true;

    setTimeout(function() {
        mutex = false;
    }, 500);

    var imageList = [];
   

    $spinButton.click(function(e) {

    	// Prevent wheel spin until all links are loaded
    	if (imgurLinks.length == 0) { return };

        $(this).attr("disabled", "disabled");

        if (settings.mute) {} else {
            audioElement.play();
        }

        // spinTimeTotal += 1000;

        spin();

    });

    // Set mute button to correct state
    if (settings.mute) {  $muteButton.addClass('muted'); } else {
        $muteButton.removeClass('muted');
    }

    // Mute button click toggle
    $muteButton.click(function() {

        settings = JSON.parse(localStorage.getItem('linkgamba-settings', settings));
        settings.mute = !(settings.mute);
        localStorage.setItem('linkgamba-settings', JSON.stringify(settings));

        if (settings.mute) {
            $(this).addClass('muted');
        } else {
            $(this).removeClass('muted');
        }

    });
    
});