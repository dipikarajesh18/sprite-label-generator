const levelId = document.getElementById("levelId");
const userLevelImage = document.getElementById("user-level");
const annotationInput = document.getElementById("annotation");
const submitButton = document.getElementById("submitButton");
const usernameInput = document.getElementById("username");

let levelData;

// Function to convert base-16 character to base-10 number
function charToNum(char) {
  return parseInt(char, 16);
}

// Function to replace each character in the ASCII map with corresponding tile from sprite sheet
function convertAsciiMapToImage(asciiMap, size) {
  const tileSize = 8; // each tile is 4 pixels by 4 pixels
  const spriteSize = 32; // sprite sheet is 32 pixels by 32 pixels
  const spriteUrl = '/pokemon.png'; // URL of the sprite sheet
  const image = new Image();

  // load the sprite sheet
  image.src = spriteUrl;

  return new Promise((resolve, reject) => {
    image.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = size * tileSize;
      canvas.height = size * tileSize;
      const context = canvas.getContext('2d');

      // loop through the asciiMap and draw the corresponding tile from the sprite sheet
      var index = 0;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const tileIndex = parseInt(asciiMap[index], 16);
          const tileX = (tileIndex % (spriteSize / tileSize)) * tileSize;
          const tileY = Math.floor(tileIndex / (spriteSize / tileSize)) * tileSize;
          // context.drawImage(image, tileX, tileY, tileSize, tileSize, j * tileSize, i * tileSize, tileSize, tileSize);
          context.drawImage(image, tileX, tileY, tileSize, tileSize, j * tileSize, i * tileSize, tileSize, tileSize);

          index++;
        }
      }

      resolve(canvas.toDataURL()); // return the image as a data URL
    };

    image.onerror = function() {
      reject(new Error('Failed to load sprite sheet'));
    };
  });
}

// Function to get a random level from the server and display it
function getRandomLevel() {
  fetch('/get-random-level')
    .then(response => response.json())
    .then(data => {
      // disable submit button if this is a refresh
      submitButton.disabled = false;
      levelData = data;
      console.log("Random level data:", data);
      console.log("ASCII_MAP:", data.ASCII_MAP);
      console.log("MAP_SIZE:", data.MAP_SIZE);
      console.log("Level ID:", data.ID);
      levelId.textContent = `${data.ID}`;
      // userLevelImage.src = convertAsciiMapToImage(data.ASCII_MAP.replace(/\n/g, ''));
      convertAsciiMapToImage(data.ASCII_MAP.replace(/\n/g, ''), data.MAP_SIZE).then(function(dataUrl) {
        userLevelImage.src = dataUrl;
      }).catch(function(error) {
        console.error(error);
      });
    });
}

// Function to submit annotation to the server
function submitAnnotation() {
  var annotation = annotationInput.value.trim();
  var id = levelData.ID;
  var asciimap = levelData.ASCII_MAP;
  var mapsize = levelData.MAP_SIZE
  var username = usernameInput.value.trim()
  if (annotation === '') {
    alert('Please enter an annotation.');
    return;
  }

  var data = {
    level_id: id,
    ascii_map: asciimap,
    annotation: annotation,
    map_size: mapsize,
    uname: username
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
      getRandomLevel();
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

// Load tileset image and get a random level when the page loads
const tileset = new Image();
tileset.src = 'pokemon.png';
tileset.onload = () => {
  getRandomLevel();
};