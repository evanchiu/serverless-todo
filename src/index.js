import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

import { readFile } from "fs/promises";
import { lookup } from "mime-types";
import { join, resolve } from "path";

exports.handler = main;
const key = "user_key";

const routes = {
  "/api/todos": todosRoute,
};

function main(event) {
  if (routes[event.path]) {
    return routes[event.path](event);
  } else {
    return servePublic(event);
  }
}

function todosRoute(event) {
  if (event.httpMethod === "GET") {
    return getTodos(key);
  } else if (event.httpMethod === "POST") {
    // Get the string form of the body data
    var todoString = event.body;
    if (event.isBase64Encoded) {
      todoString = Buffer.from(event.body, "base64").toString();
    }

    // Parse it and save, or indicate bad input
    try {
      let todos = JSON.parse(todoString);
      return saveTodos(key, todos);
    } catch (err) {
      console.error(err);
      return done(400, '{"message":"Invalid JSON body"}');
    }
  } else {
    return done(400, '{"message":"Invalid HTTP Method"}');
  }
}

async function getTodos(id) {
  const command = new GetCommand({
    TableName: process.env.TABLE,
    Key: {
      id: id,
    },
  });

  try {
    const response = await docClient.send(command);
    console.log(`Got data from dynamo, table(${process.env.TABLE}), id(${id})`);
    console.log(response);
    if (response.Item) {
      return done(200, JSON.stringify(response.Item.todos));
    } else {
      return done(200, "[]");
    }
  } catch (e) {
    console.log(
      `Error: failed to get data from dynamo, table(${process.env.TABLE}), id(${id})`
    );
    console.log(e);
    return done(500, '{"message":"Internal Server Error"}');
  }
}

async function saveTodos(id, todos) {
  const command = new PutCommand({
    TableName: process.env.TABLE,
    Item: {
      id: id,
      todos: todos,
    },
  });

  try {
    const response = await docClient.send(command);
    console.log(
      `Successfully put data to dynamo, table(${process.env.TABLE}), id(${id}), todos(${todos})`
    );
    console.log(response);
    return done(200, '{"message":"Success"}');
  } catch (e) {
    console.log(
      `Error: failed to put data to dynamo, table(${process.env.TABLE}), id(${id}), todos(${todos})`
    );
    console.log(e);
    return done(500, '{"message":"Internal Server Error"}');
  }
}

// Attempt to serve public content from the public directory
async function servePublic(event) {
  console.log(`Serving public for ${event.path}`);
  // Set urlPath
  let urlPath;
  if (event.path === "/") {
    return serveIndex(event);
  } else {
    urlPath = event.path;
  }

  // Determine the file's path on lambda's filesystem
  const publicPath = join(process.env.LAMBDA_TASK_ROOT, "public");
  const filePath = resolve(join(publicPath, urlPath));
  const mimeType = lookup(filePath);

  // Make sure the user doesn't try to break out of the public directory
  if (!filePath.startsWith(publicPath)) {
    console.log("forbidden", filePath, publicPath);
    return done(403, '{"message":"Forbidden"}', "application/json");
  }

  // Attempt to read the file, give a 404 on error
  try {
    const data = await readFile(filePath);
    if (
      mimeType === "image/png" ||
      mimeType === "image/jpeg" ||
      mimeType === "image/x-icon"
    ) {
      // Base 64 encode binary images
      return done(200, data.toString("base64"), mimeType, true);
    } else {
      return done(200, data.toString(), mimeType);
    }
  } catch (e) {
    console.error("404", e);
    return done(404, '{"message":"Not Found"}');
  }
}

// Serve the index page
async function serveIndex(event) {
  console.log("Serving index");
  // Determine base path on whether the API Gateway stage is in the path or not
  let base_path = "/";
  if (event.requestContext.path.startsWith("/" + event.requestContext.stage)) {
    base_path = "/" + event.requestContext.stage + "/";
  }

  let filePath = join(process.env.LAMBDA_TASK_ROOT, "public/index.html");
  // Read the file, fill in base_path and serve, or 404 on error
  try {
    const data = await readFile(filePath);
    let content = data.toString().replace(/{{base_path}}/g, base_path);
    return done(200, content, "text/html");
  } catch (error) {
    console.error("404", error);
    return done(404, '{"message":"Not Found"}');
  }
}

// We're done with this lambda, return to the client with given parameters
function done(
  statusCode,
  body,
  contentType = "application/json",
  isBase64Encoded = false
) {
  return {
    statusCode: statusCode,
    isBase64Encoded: isBase64Encoded,
    body: body,
    headers: {
      "Content-Type": contentType,
    },
  };
}
