import { parseString } from "../../src/parsers/parseString";
import { suite } from "../suite";

suite("parseString", (test) => {
  const run = (output: string, data: unknown) =>
    eval(
      `const {z} = require("zod/v4"); ${output}.safeParse(${JSON.stringify(
        data,
      )})`,
    );

  test("DateTime format", (assert) => {
    const datetime = "2018-11-13T20:20:39Z";

    const code = parseString({
      type: "string",
      format: "date-time",
    });

    assert(code, 'z.iso.datetime({ offset: true })');

    assert(run(code, datetime), { success: true, data: datetime });
  });

  test("email", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "email",
      }),
      "z.email()",
    );
  });

  test("ip", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "ip",
      }),
      "z.union([z.ipv4(), z.ipv6()])",
    );
    assert(
      parseString({
        type: "string",
        format: "ipv6",
      }),
      `z.ipv6()`,
    );
  });

  test("uri", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "uri",
      }),
      `z.url()`,
    );
  });

  test("uuid", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "uuid",
      }),
      `z.uuid()`,
    );
  });

  test("time", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "time",
      }),
      `z.iso.time()`,
    );
  });

  test("date", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "date",
      }),
      `z.iso.date()`,
    );
  });

  test("duration", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "duration",
      }),
      `z.iso.duration()`,
    );
  });

  test("base64", (assert) => {
    assert(
      parseString({
        type: "string",
        contentEncoding: "base64",
      }),
      "z.string().base64()",
    );
    assert(
      parseString({
        type: "string",
        contentEncoding: "base64",
      }),
      'z.string().base64()',
    );
    assert(
      parseString({
        type: "string",
        format: "binary",
      }),
      "z.base64()",
    );
    assert(
      parseString({
        type: "string",
        format: "binary",
      }),
      'z.base64()',
    );
  });

  test("stringified JSON", (assert) => {
    assert(
      parseString({
        type: "string",
        contentMediaType: "application/json",
        contentSchema: {
          type: "object",
          properties: {
            name: {
              type: "string"
            },
            age: {
              type: "integer"
            }
          },
          required: [
            "name",
            "age"
          ]
        }
      }),
      'z.string().transform((str, ctx) => { try { return JSON.parse(str); } catch (err) { ctx.addIssue({ code: "custom", message: "Invalid JSON" }); }}).pipe(z.object({ "name": z.string(), "age": z.number().int() }))',
    );
    assert(
      parseString({
        type: "string",
        contentMediaType: "application/json",
        contentSchema: {
          type: "object",
          properties: {
            name: {
              type: "string"
            },
            age: {
              type: "integer"
            }
          },
          required: [
            "name",
            "age"
          ]
        },
        errorMessage: {
          contentMediaType: "x",
          contentSchema: "y",
        },
      }),
      'z.string().transform((str, ctx) => { try { return JSON.parse(str); } catch (err) { ctx.addIssue({ code: "custom", message: "Invalid JSON" }); }}, "x").pipe(z.object({ "name": z.string(), "age": z.number().int() }), "y")',
    );
  });

  // test("should accept errorMessage", (assert) => {
  //   assert(
  //     parseString({
  //       type: "string",
  //       format: "ipv4",
  //       pattern: "x",
  //       minLength: 1,
  //       maxLength: 2,
  //       errorMessage: {
  //         format: "ayy",
  //         pattern: "lmao",
  //         minLength: "deez",
  //         maxLength: "nuts",
  //       },
  //     }),
  //     'z.string().ip({ version: "v4", message: "ayy" }).regex(new RegExp("x"), "lmao").min(1, "deez").max(2, "nuts")',
  //   );
  // });
});
