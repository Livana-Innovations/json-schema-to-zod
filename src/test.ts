import { parseSchema } from "./index.js";

const schema = {
      type: "object",
      properties: {
        prop: {
          type: ["string", "null"],
          default: null,
        },
      },
    };
    let result=parseSchema(schema, { path: [], seen: new Map() })