import bodyParser from "body-parser";
import express, { Request, Response, Router } from "express";
import { remove } from "fs-extra";
import { isWebUri } from "valid-url";
import { deleteLocalFiles, filterImageFromURL } from "./util/util";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async ( req: Request, res: Response ): Promise<void> => {
    const { image_url } = req.query;
    if ( !image_url || !isWebUri(image_url) ) {
      res.status(400).send("a valid image_url is required");
    } else {
      const filteredImage = await filterImageFromURL( image_url );
      res.status(200).sendFile(filteredImage);
      remove(__dirname + "/util/tmp");
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ): Promise<void> => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen( port, () => {
    console.log( `server running http://localhost:${ port }` );
    console.log( `press CTRL+C to stop server` );
  });

})();
