import { JsonSchemaObject } from "../Types.js";
import { withMessage } from "../utils/withMessage.js";
import { parseSchema } from "./parseSchema.js";

export const parseString = (schema: JsonSchemaObject & { type: "string" }) => {
  let r = "z.string()";

  r = withMessage(schema, "format", ({ value }) => {
    switch (value) {
      case "email":
        return ["z.email(", ")"];
      case "ip":
        return ["z.union([z.ipv4(), z.ipv6()", "])"];
      case "ipv4":
        return ['z.ipv4(', ")"];
      case "ipv6":
        return ['z.ipv6(',")"];
      case "cidr":
        return ["z.union([z.cidrv4(), z.cidrv6()", "])"];
      case "cidrv4":
        return ['z.cidrv4(', ")"];
      case "cidrv6":
        return ['z.cidrv6(',")"];
      case "uri":
        return ["z.url(", ")"];
      case "uuid":
        return ["z.uuid(", ")"];
      case "guid":
        return ["z.guid(", ")"];
      case "uuidv4":
        return ["z.uuidv4(", ")"];
      case "uuidv6":
        return ["z.uuidv6(", ")"];
      case "uuidv7":
        return ["z.uuidv7(", ")"];
      case "hostname":
        return ["z.hostname(", ")"];
      case "emoji":
        return ["z.emoji(", ")"];
      case "base64":
        return ["z.base64(", ")"];
      case "base64url":
        return ["z.base64url(", ")"];
      case "jwt":
        return ["z.jwt(", ")"];
      case "base64url":
        return ["z.base64url(", ")"];
      case "nanoid":
        return ["z.nanoid(", ")"];
      case "cuid":
        return ["z.cuid(", ")"];
      case "cuid2":
        return ["z.cuid2(", ")"];
      case "ulid":
        return ["z.ulid(", ")"];
      case "date-time":
        return ["z.iso.datetime({ offset: true", " })"];
      case "time":
        return ["z.iso.time(", ")"];
      case "date":
        return ["z.iso.date(", ")"];
      case "duration":
        return ["z.iso.duration(", ")"];
      case "binary":
        return ["z.base64(", ")"];
      default:
        return ["z.string(", ")"];
    }
  });

  r += withMessage(schema, "pattern", ({ json }) => [
    `.regex(new RegExp(${json})`,
    ", ",
    ")",
  ]);

  r += withMessage(schema, "minLength", ({ json }) => [
    `.min(${json}`,
    ", ",
    ")",
  ]);

  r += withMessage(schema, "maxLength", ({ json }) => [
    `.max(${json}`,
    ", ",
    ")",
  ]);

  r += withMessage(schema, "contentEncoding", ({ value }) => {
    if (value === "base64") {
      return [".base64(", ")"];
    }
  });

  const contentMediaType = withMessage(schema, "contentMediaType", ({ value }) => {
    if (value === "application/json") {
      return [
        ".transform((str, ctx) => { try { return JSON.parse(str); } catch (err) { ctx.addIssue({ code: \"custom\", message: \"Invalid JSON\" }); }}",
        ", ",
        ")"
      ]
    }
  });

  if(contentMediaType != ""){
    r += contentMediaType;
    r += withMessage(schema, "contentSchema", ({ value })=>{
      if (value && value instanceof Object){
        return [
          `.pipe(${parseSchema(value)}`,
          ", ",
          ")"
        ]
      }
    });
  }

  return r;
};
