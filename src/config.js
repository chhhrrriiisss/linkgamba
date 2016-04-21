// [px]  Maximum dimensions of emotes on wheel 
var maxImageWidth = 100;
var maxImageHeight = 100;

// [Hex] Primary wheel colour
var primaryWheelColour = '#000000';

// [Hex] Primary wheel colour
var secondaryWheelColour = '#fe0000';

// [Hex] Selection/highlight colour
var highlightWheelColour = '#00a00d';

// [Seconds] Min / maximum spin duration
var minSpinTime = 6;
var maxSpinTime = 12;

// [Seconds] Min / maximum spin duration increase (when spin button is pressed again) 
var minSpinTimeOnPress = 6;
var maxSpinTimeOnPress = 12;

// How fast the wheel should rotate on initial press
var wheelRotateSpeed = 30;

// [Ms] Selected tile flicker intensity (lower = faster)
var flickerIntensity = 40;

// [Seconds] How long to wait after selection before redirecting (somewhat influenced by device performance) 
var timeoutBeforeRedirect = 3.5;

// Default emote directory (changing this will require updating index.html references)
var emoteDirectory = 'assets/img/emotes/';

// 
// 			Do not edit below this line 
// 

var spinTimeDif = maxSpinTime - minSpinTime;
var spinTimeDifOnPress = maxSpinTimeOnPress - minSpinTimeOnPress;
var timeoutBeforeRedirectInMs = timeoutBeforeRedirect * 1000;
