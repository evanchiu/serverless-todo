const aws = require('aws-sdk');
const doc = new aws.DynamoDB.DocumentClient();
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');

exports.handler = main;
const key = 'user_key';

const routes = {
  '/api/todos': todosRoute
};

function main(event, context, lambdaCallback) {
  if (routes[event.path]) {
    return routes[event.path](event, context, lambdaCallback);
  } else {
    return servePublic(event, context, lambdaCallback);
  }
}

function todosRoute(event, context, lambdaCallback) {
  if (event.httpMethod === 'GET') {
    return getTodos(key, lambdaCallback);
  } else if (event.httpMethod === 'POST') {

    // Get the string form of the body data
    var todoString = event.body;
    if (event.isBase64Encoded) {
      todoString = Buffer.from(event.body, 'base64').toString();
    }

    // Parse it and save, or indicate bad input
    try {
      let todos = JSON.parse(todoString);
      return saveTodos(key, todos, lambdaCallback);
    } catch (err) {
      console.error(err);
      return done(400, '{"message":"Invalid JSON body"}', 'application/json', lambdaCallback);
    }
  } else {
    return done(400, '{"message":"Invalid HTTP Method"}', 'application/json', lambdaCallback);
  }
}

function getTodos(id, lambdaCallback) {
  const params = {
    TableName: process.env.TABLE,
    Key: {
      id: id
    }
  };

  doc.get(params, function(err, data) {
    if (err) {
      console.log('DynamoDB error on get: ', err);
      return done(500, '{"message":"Internal Server Error"}', 'application/json', lambdaCallback);
    } else {
      if (!data.Item) {
        return done(200, '[]', 'application/json', lambdaCallback);
      } else {
        return done(200, JSON.stringify(data.Item.todos), 'application/json', lambdaCallback);
      }
    }
  });
}

function saveTodos(id, todos, lambdaCallback) {
  const params = {
    TableName: process.env.TABLE,
    Item: {
      id: id,
      todos: todos
    }
  };

  doc.put(params, function(err) {
    if (err) {
      console.log('DynamoDB error on put: ', err);
      return done(500, '{"message":"Internal Server Error"}', 'application/json', lambdaCallback);
    } else {
      return done(200, '{"message":"Success"}', 'application/json', lambdaCallback);
    }
  });
}

// Attempt to serve public content from the public directory
function servePublic(event, context, lambdaCallback) {
  // Set urlPath
  var urlPath;
  if (event.path === '/') {
    return serveIndex(event, context, lambdaCallback);
  } else {
    urlPath = event.path;
  }

  // Determine the file's path on lambda's filesystem
  var publicPath = path.join(process.env.LAMBDA_TASK_ROOT, 'public');
  var filePath = path.resolve(path.join(publicPath, urlPath));
  var mimeType = mime.lookup(filePath);

  // Make sure the user doesn't try to break out of the public directory
  if (!filePath.startsWith(publicPath)) {
    console.log('forbidden', filePath, publicPath);
    return done(403, '{"message":"Forbidden"}', 'application/json', lambdaCallback);
  }

  // Attempt to read the file, give a 404 on error
  fs.readFile(filePath, function(err, data) {
    if (err) {
      return done(404, '{"message":"Not Found"}', 'application/json', lambdaCallback);
    } else if (mimeType === 'image/png' ||
        mimeType === 'image/jpeg' ||
        mimeType === 'image/x-icon') {
      // Base 64 encode binary images
      return done(200, data.toString('base64'), mimeType, lambdaCallback, true);
    } else {
      return done(200, data.toString(), mimeType, lambdaCallback);
    }
  });
}

// Serve the index page
function serveIndex(event, context, lambdaCallback) {
  // Determine base path on whether the API Gateway stage is in the path or not
  let base_path = '/';
  if (event.requestContext.path.startsWith('/' + event.requestContext.stage)) {
    base_path = '/' + event.requestContext.stage + '/';
  }

  let filePath = path.join(process.env.LAMBDA_TASK_ROOT, 'public/index.html');
  // Read the file, fill in base_path and serve, or 404 on error
  fs.readFile(filePath, function(err, data) {
    if (err) {
      return done(404, '{"message":"Not Found"}', 'application/json', lambdaCallback);
    }
    let content = data.toString().replace(/{{base_path}}/g, base_path);
    return done(200, content, 'text/html', lambdaCallback);
  });
}

// We're done with this lambda, return to the client with given parameters
function done(statusCode, body, contentType, lambdaCallback, isBase64Encoded = false) {
  lambdaCallback(null, {
    statusCode: statusCode,
    isBase64Encoded: isBase64Encoded,
    body: body,
    headers: {
      'Content-Type': contentType
    }
  });
}
