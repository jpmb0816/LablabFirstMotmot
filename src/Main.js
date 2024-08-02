/**************************************************
 *                                                *
 *                 Initialization                 *
 *                                                *
 **************************************************/

// Canvas and canvas context
let canvas, c, width, height;
let uiTextCanvas, uiTextCtx;
let uiTextCanvas2, uiTextCtx2;
let dialogCanvas, dialogCtx;

// Object used in game
let sm, camera, fps, map, player, dialog, font;

const gameSizeMultiplier = 2;

/**************************************************
 *                                                *
 *                 Main functions                 *
 *                                                *
 **************************************************/

// This is where loading files takes place
function preload() {
  // Creating main canvas
  createCanvas(640 * gameSizeMultiplier, 512 * gameSizeMultiplier);

  // Promises or Asynchronous functions
  sm = new SpriteManager();

  loadJSON("config/ui/config.json")
    .then((json) => {
      const list = [];
      json.sprites.forEach((data) => list.push(data));
      return loadAllSprites(list, sm);
    })

    // When done loading all images, call the init() function
    .then(() => init())
    .catch((err) => console.error(err));
}

// This will execute before rendering
function init() {
  fps = new FPS();
  map = new GameMap();

  uiTextCanvas = document.createElement("canvas");
  uiTextCtx = uiTextCanvas.getContext("2d");
  uiTextCanvas.width = width;
  uiTextCanvas.height = 100 * gameSizeMultiplier;

  uiTextCanvas2 = document.createElement("canvas");
  uiTextCtx2 = uiTextCanvas2.getContext("2d");
  uiTextCanvas2.width = width;
  uiTextCanvas2.height = 100 * gameSizeMultiplier;

  dialogCanvas = document.createElement("canvas");
  dialogCtx = dialogCanvas.getContext("2d");
  dialogCanvas.width = 620 * gameSizeMultiplier;
  dialogCanvas.height = 170 * gameSizeMultiplier;

  // Player
  player = new Player(
    "Dianna",
    gridToCoordinate(2),
    gridToCoordinate(2),
    TILE_SIZE,
    TILE_SIZE,
    sm.getImage("player-g"),
    sm.getSprite("char-shadow"),
    { x1: 8, x2: 8, y1: 32, y2: 4 },
    { x: 0, y: 5 }
  );

  // Camera
  camera = new Camera(c, width, height);
  camera.bind(player);

  // Font sprites
  font = new FontSprite(8, 16);
  font.add("red", sm.getImage("font-red"));
  font.add("white", sm.getImage("font-white"));

  // Dialog box
  dialog = new DialogBox(font, 65);

  // UI Text
  font.drawText(uiTextCtx, player.name, "red", 30, 40, 16);

  font.drawText(uiTextCtx, "TIME:", "white", 260, 40, 5);

  font.drawText(uiTextCtx, "X:", "white", 500, 40, 2);
  font.drawText(uiTextCtx, "Y:", "white", 564, 40, 2);
  font.drawText(uiTextCtx, "C:", "white", 500, 60, 2);
  font.drawText(uiTextCtx, "R:", "white", 564, 60, 2);

  font.drawText(uiTextCtx, "FPS:", "white", 500, 80, 4);

  // Dialog box
  dialogCtx.drawImage(
    sm.getImage("dialog-box"),
    0,
    1100,
    1200,
    275,
    20 * gameSizeMultiplier,
    0 * gameSizeMultiplier,
    600 * gameSizeMultiplier,
    170 * gameSizeMultiplier
  );

  // Event listeners
  window.addEventListener("keydown", keyEventLogger);
  if (!MOBILE) window.addEventListener("keyup", keyEventLogger);

  if (gameConfig.hasMouse) {
    canvas.addEventListener("mousemove", updateMouse);
    canvas.addEventListener("mousedown", updateMouseClick);
    canvas.addEventListener("mouseup", updateMouseClick);
  }

  //gameConfig.hasUI = false;
  map.load("config/map/MysteriousForest/config.json");

  // Call render
  render();
}

let lastRenderTime = 0;
const frameRate = 60; // Desired frame rate
const frameDuration = 1000 / frameRate; // Frame duration in milliseconds

function renderOthers(ctx) {
  // Set fill style to black
  ctx.fillStyle = "black";

  // Set global alpha to desired transparency level (e.g., 0.5 for 50% transparency)
  const bAlpha = ctx.globalAlpha;
  ctx.globalAlpha = 0.4;

  // Draw the rectangle
  ctx.fillRect(0, 0, map.width, map.height);

  ctx.globalAlpha = 0.8;

  //ctx.font = "40px sans-serif";
  font.drawText2(
    ctx,
    "Happy 1st Monthsary",
    "white",
    map.width / 2 - 155,
    map.height / 2,
    19,
    false
  );
  font.drawText2(
    ctx,
    "Baby lablab ko!",
    "white",
    map.width / 2 - 118,
    map.height / 2 + 50,
    19,
    false
  );

  // Reset global alpha to 1 (fully opaque) if further drawing should be non-transparent
  ctx.globalAlpha = bAlpha;
}

function checkEvent() {
  const mw = 64;
  const mh = 64;
  const mwO = 64;
  const mhO = 0;
  const ox = player.cx;

  if (map.name == "Mysterious Forest") {
    const mx = mw * 9;
    const my = mh * 0;

    if (
      mx < player.r &&
      mx + mw + mwO > player.l &&
      my < player.b &&
      my + mh + mhO > player.t
    ) {
      const ny = mh * 20;

      fireworks = [];
      map.load(
        "config/map/MysteriousForestNorth/config.json",
        "Loading...",
        function () {
          gameConfig.hasUI = false;
          player.setCX(ox);
          player.setCY(ny - mh);
          player.setFacing("up");
        }
      );
    }
  } else if (map.name == "Mysterious Forest North") {
    const mx = mw * 9;
    const my = mh * 20;

    if (
      mx < player.r &&
      mx + mw + mwO > player.l &&
      my < player.b &&
      my + mh + mhO > player.t
    ) {
      const ny = mh * 0;

      map.load(
        "config/map/MysteriousForest/config.json",
        "Loading...",
        function () {
          gameConfig.hasUI = true;
          player.setCX(ox);
          player.setCY(ny + mh);
          player.setFacing("down");
        }
      );
    }
  }
}

// This is where rendering takes place
function render(currentTime) {
  // Calculate elapsed time
  const elapsed = currentTime - lastRenderTime;

  // Only update if enough time has passed
  if (elapsed >= frameDuration) {
    lastRenderTime = currentTime - (elapsed % frameDuration); // Adjust lastRenderTime for smooth rendering

    // Rendering logic
    map.loadingScreen.displayIfDone(c, () => {
      // Update camera view based on player position
      camera.update();

      // This area is affected by camera
      c.drawImage(
        map.canvas,
        camera.x,
        camera.y,
        camera.cw,
        camera.ch,
        camera.x,
        camera.y,
        camera.cw,
        camera.ch
      );

      // Sort by y order and draw
      if (map.name == "Mysterious Forest North") {
        renderOthers(c);
      }

      map.entities.sortbyYOrder();
      checkEvent();
      map.entities.drawAll();

      if (map.name == "Mysterious Forest North") {
        animateFireworks(canvas);
      }

      // This area is not affected by camera
      camera.stop();

      // If player is enabled, render UI elements
      if (player.enable) {
        if (gameConfig.hasUI) {
          const time = getCurrentTime();

          const hp = clamp(
            getPercentage(player.health, player.maxHealth),
            0,
            100
          );
          const hpImg = Math.floor(scaleValue(hp, 0, 100, 5.99, 1));

          const mana = clamp(
            getPercentage(player.mana, player.maxMana),
            0,
            100
          );
          const manaImg = Math.floor(scaleValue(mana, 0, 100, 2.99, 1));

          sm.drawMultiSprite(
            uiTextCtx,
            "hp-bar",
            0,
            110,
            11,
            30 * gameSizeMultiplier,
            60 * gameSizeMultiplier
          );
          sm.drawMultiSprite(
            uiTextCtx,
            "hp-bar",
            hpImg,
            hp,
            11,
            35 * gameSizeMultiplier,
            60 * gameSizeMultiplier
          );

          sm.drawMultiSprite(
            uiTextCtx,
            "mana-bar",
            0,
            110,
            11,
            30 * gameSizeMultiplier,
            75 * gameSizeMultiplier
          );
          sm.drawMultiSprite(
            uiTextCtx,
            "mana-bar",
            manaImg,
            mana,
            11,
            35 * gameSizeMultiplier,
            75 * gameSizeMultiplier
          );

          font.drawText(
            uiTextCtx,
            time.hrs + ":" + time.mins + ":" + time.secs,
            "white",
            308,
            40,
            16,
            true
          );

          font.drawText(uiTextCtx, player.rcx + "", "white", 524, 40, 4, true);
          font.drawText(uiTextCtx, player.rcy + "", "white", 588, 40, 4, true);

          font.drawText(
            uiTextCtx,
            coordinateToGrid(player.rcx) + "",
            "white",
            524,
            60,
            3,
            true
          );
          font.drawText(
            uiTextCtx,
            coordinateToGrid(player.rcy) + "",
            "white",
            588,
            60,
            3,
            true
          );
          font.drawText(uiTextCtx, fps.get() + "", "white", 540, 80, 3, true);

          c.drawImage(uiTextCanvas, 0, 0);
        } else {
          //font.drawText(c, fps.get() + "", "white", 540, 80, 3);
        }

        if (map.name == "Mysterious Forest North") {
          c.drawImage(uiTextCanvas2, 0, 0);
        }
      }

      // Display dialog
      dialog.display();

      // Display mouse
      if (gameConfig.hasMouse) {
        sm.drawMultiSprite(
          c,
          "cursor",
          mouse.hasClick ? 2 : 4,
          15,
          19,
          mouse.x,
          mouse.y
        );
      }

      // Update FPS
      fps.update();
    });
  }

  // Request the next frame
  requestAnimationFrame(render);
}
