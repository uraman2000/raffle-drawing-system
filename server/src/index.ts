import "reflect-metadata";
import { createConnection } from "typeorm";
import "reflect-metadata";
import * as bodyParser from "body-parser";
import { createExpressServer } from "routing-controllers";
import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import * as swaggerUiExpress from "swagger-ui-express";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

const routingControllersOptions = {
  cors: true,
  routePrefix: "/api",
  controllers: [__dirname + "/controller/*.{js,ts}"],
};
const app = createExpressServer(routingControllersOptions);
createConnection()
  .then(async (connection) => {
    const schemas = validationMetadatasToSchemas();

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: { schemas },
      info: {
        title: "API Documentation for RFC Raffle Drawing System",
        version: "1.0.0",
      },
    });

    app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
    app.use(bodyParser.json());
    // Render spec on root:

    app.listen(3000);
    console.log("Express server has started on port 3000. Open http://localhost:3000/docs to see results");
  })
  .catch((error) => console.log(error));
export default app;
