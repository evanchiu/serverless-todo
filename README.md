# serverless-todo

React [TodoMVC](http://todomvc.com/) with a Serverless backend. See demo at [todo.evanchiu.com](https://todo.evanchiu.com).

It provides a demo integration of [React](https://reactjs.org) + [API Gateway](https://aws.amazon.com/api-gateway/) + [AWS Lambda](https://aws.amazon.com/lambda) + [Node.js](https://nodejs.org/) + [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)

## Deploy with CloudFormation

Prerequisites: [Node.js](https://nodejs.org/en/) and [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed

* Create an [AWS](https://aws.amazon.com/) Account and [IAM User](https://aws.amazon.com/iam/) with the `AdministratorAccess` AWS [Managed Policy](http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html)
* Run `aws configure` to put store that user's credentials in `~/.aws/credentials`
* Create an S3 bucket for storing the Lambda code and store its name in a shell variable with:
  * `export S3_BUCKET=<bucket name>`
* Npm install:
  * `npm install`
* Build:
  * `npm run build`
* Upload package to S3, transform the CloudFormation template:
  * `npm run package`
* Deploy to CloudFormation:
  * `npm run deploy`

## Deploy from the AWS Serverless Application Repository
* Hit "Deploy" from the [application](https://serverlessrepo.aws.amazon.com/#/applications/arn:aws:serverlessrepo:us-east-1:233054207705:applications~serverless-todo) page

## Links
* [todo.evanchiu.com](https://todo.evanchiu.com) live demo
* [serverless-todo](https://github.com/evanchiu/serverless-todo) on Github
* [serverless-todo](https://serverlessrepo.aws.amazon.com/#/applications/arn:aws:serverlessrepo:us-east-1:233054207705:applications~serverless-todo) on the AWS Serverless Application Repository

## License
&copy; 2017 [Evan Chiu](https://evanchiu.com). This project is available under the terms of the MIT license.
