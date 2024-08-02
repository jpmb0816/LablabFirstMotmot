class GameMap {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.name = null;
    this.isLoaded = true;
    this.status = "Loading...";

    this.width = 0;
    this.height = 0;

    this.rows = 0;
    this.cols = 0;

    this.background = [];
    this.foreground = [];
    this.collisions = [];

    this.entities = null;
    this.sprManager = new SpriteManager();
    this.loadingScreen = new LoadingScreen(this);

    this.wireframe = false;
  }

  load(path, status = "Loading...", runAfterPlayerInitiliazed) {
    if (this.isLoaded) {
      this.isLoaded = false;
      this.status = status;

      this.loadingScreen.reset(c);
      this.ctx.clearRect(0, 0, this.width, this.height);

      loadJSON(path).then((json) => {
        this.canvas.width = json.width;
        this.canvas.height = json.height;

        this.name = json.name;
        this.width = json.width;
        this.height = json.height;

        this.rows = json.rows;
        this.cols = json.rows;

        this.background = json.background;
        this.foreground = json.foreground;
        this.collisions = [];
        this.sprManager = new SpriteManager();

        loadAllSprites(json.sprites, this.sprManager).then(() => {
          // Draw map in this offscreen canvas
          for (let r = 0, er = this.rows; r < er; r++) {
            for (let c = 0, ec = this.cols; c < ec; c++) {
              const valBG = this.background[r][c] - 1;
              const valFG = this.foreground[r][c] - 1;
              const valColl = json.collisions[r][c];

              const x = c * TILE_SIZE;
              const y = r * TILE_SIZE;

              if (valBG > -1)
                this.sprManager.draw(
                  this.ctx,
                  this.sprManager.names[valBG],
                  x,
                  y
                ); //
              if (valFG > -1)
                this.sprManager.drawMultiSprite(
                  this.ctx,
                  "props",
                  valFG,
                  TILE_SIZE,
                  TILE_SIZE,
                  x,
                  y
                );

              if (valColl === 1) {
                this.collisions.push({
                  l: x,
                  r: x + TILE_SIZE,
                  t: y,
                  b: y + TILE_SIZE,
                  ol: x,
                  or: x + TILE_SIZE,
                  ot: y,
                  ob: y + TILE_SIZE,
                });
                if (gameConfig.collisionBox)
                  this.ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
              }
            }
          }

          // Load the entities
          const entList = [];

          if (json.npcs) json.npcs.forEach((npc) => entList.push(npc));
          if (json.signposts)
            json.signposts.forEach((signpost) => entList.push(signpost));
          this.entities = new EntityCollection();

          loadAllJSON(entList, (entity) => {
            // Add entity in entity collection based on entity type
            switch (entity.type) {
              case "npc":
                this.entities.add(
                  new NPC(
                    entity.name,
                    gridToCoordinate(entity.startCol),
                    gridToCoordinate(entity.startRow),
                    entity.width,
                    entity.height,
                    this.sprManager.getImage(entity.mainSprite),
                    sm.getSprite(entity.shadowSprite),
                    entity.mainOffset,
                    entity.shadowOffset,
                    entity.instructions,
                    entity.delayPerFrame,
                    entity.sequences,
                    entity.responses
                  )
                );
                break;
              case "signpost":
                this.entities.add(
                  new SignPost(
                    entity.name,
                    gridToCoordinate(entity.startCol),
                    gridToCoordinate(entity.startRow),
                    entity.width,
                    entity.height,
                    this.sprManager.getSprite(entity.mainSprite),
                    sm.getSprite(entity.shadowSprite),
                    entity.mainOffset,
                    entity.shadowOffset,
                    entity.spriteIDs,
                    entity.responses,
                    entity.isChanging
                  )
                );
                break;
            }
          }).then(() => {
            // If finished loading all do below
            this.entities.add(player);

            player.setCX(json.startX);
            player.setCY(json.startY);
            player.setFacing(json.startFacing);

            if (runAfterPlayerInitiliazed) {
              runAfterPlayerInitiliazed();
            }

            camera.setMapSize(this.canvas.width, this.canvas.height);
            this.isLoaded = true;
          });
        });
      });
    }
  }
}
