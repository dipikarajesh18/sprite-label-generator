const spriteId = document.getElementById("spriteId");
const spriteImage = document.getElementById("sprite-image");
const annotationInput = document.getElementById("annotation");
const submitButton = document.getElementById("submitButton");

let spriteData;

let PICO_PALETTE = ['#000000','#1D2B53','#7E2553','#008751','#AB5236','#5F574F','#C2C3C7','#FFF1E8','#FF004D','#FFA300','#FFEC27','#00E436','#29ADFF','#83769C','#FF77A8','#FFCCAA']

const canvas = document.createElement('canvas');
canvas.width = 8;
canvas.height = 8;
const context = canvas.getContext('2d');

// Convert sprite hex to image
function convertSpriteHexToImage(spriteHex) {
  //clear the canvas
  context.fillStyle = "#000";
  context.fillRect(0,0,8,8);

  //draw each color pixel by pixel - row by row
  var index = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const colorIndex = parseInt(spriteHex[index], 16);
      context.fillStyle = PICO_PALETTE[colorIndex]
      context.fillRect(j,i,1,1)
      index++;
    }
  }
  return canvas.toDataURL();  ///return the sprite image as a data url
}

// Function to get a random sprite from the server and display it
function getRandomSprite() {
  fetch('/get-random-sprite')
    .then(response => response.json())
    .then(data => {
      // disable submit button if this is a refresh
      submitButton.disabled = false;
      spriteData = data;
      console.log("Random sprite data:", data);
      console.log("SPRITE_HEX:", data.SPRITE_HEX);
      console.log("SPRITE_DB_ID:", data.SPRITE_DB_ID);
      spriteData.textContent = `${data.SPRITE_DB_ID}`;
      convertSpriteHexToImage(data.SPRITE_HEX.replace(/\n/g, '')).then(function(dataUrl) {
        spriteImage.src = dataUrl;
      }).catch(function(error) {
        console.error(error);
      });
    });
}

// Function to submit annotation to the server
function submitAnnotation() {
  var annotation = annotationInput.value.trim();
  var sprite_db_id = spriteData.SPRITE_DB_ID;
  var sprite_hex = spriteData.SPRITE_HEX;
  if (annotation === '') {
    alert('Please enter an annotation.');
    return;
  }

  var data = {
    sprite_db_id: sprite_db_id,
    sprite_hex: sprite_hex,
    annotation: annotation,
  }
  console.log(data);
  fetch("/insert-annotation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      getRandomSprite();
      document.getElementById("annotation").value = "";
    })
    .catch(error => console.error(error));
  
}

// Handle submit button click event
submitButton.addEventListener('click', function() {
  submitAnnotation();
});

// Disable submit button on load
submitButton.disabled = true;

function init(){
  getRandomSprite();
}