# serverless-todo

React [TodoMVC](http://todomvc.com/) with a Serverless backend.

It provides a demo integration of [React](https://reactjs.org) + [API Gateway](https://aws.amazon.com/api-gateway/) + [AWS Lambda](https://aws.amazon.com/lambda) + [Node.js](https://nodejs.org/) + [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)

## Deploy
* Hit "Deploy" from the [application](https://serverlessrepo.aws.amazon.com/#/applications/arn:aws:serverlessrepo:us-east-1:233054207705:applications~serverless-todo) page

## Use
1. In the [API Gateway Console](https://console.aws.amazon.com/apigateway)
1. Navigate to APIs / aws-serverless-repository-serverless-todo / Settings
    1. Hit Add Binary Media Type
    1. Enter `*/*` in the box
    1. Hit Save Changes
    1. Navigate to APIs / aws-serverless-repository-serverless-todo / Resources
    1. Click the Actions dropdown
    1. Click Deploy API
        1. Deployment stage: **Prod**
        1. Deployment description: *Adding binary support*
        1. Hit Deploy
1. Navigate to APIs / aws-serverless-repository-serverless-todo / Dashboard
    1. Find the Invoke url, something like *https://xxxxxxxxx.execute-api.region.amazonaws.com/Prod/*
    1. (You can also set up [custom domain name](http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html))
1. Open the invoke url in your browser

## Links
* [serverless-todo](https://github.com/evanchiu/serverless-todo) on Github
* [serverless-todo](https://serverlessrepo.aws.amazon.com/#/applications/arn:aws:serverlessrepo:us-east-1:233054207705:applications~serverless-todo) on the AWS Serverless Application Repository

## License
&copy; 2017-2024 [Evan Chiu](https://evanchiu.com). This project is available under the terms of the MIT license.
