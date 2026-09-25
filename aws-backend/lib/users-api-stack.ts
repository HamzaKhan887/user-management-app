import * as cdk from 'aws-cdk-lib'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import path from 'path'
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2'
import * as apigateway_integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { DynamodbStack } from './dynamodb-stack'
import { S3BucketStack } from './s3-bucket-stack'

interface UsersApiStackProps extends cdk.StackProps {
  dynamodbStack: DynamodbStack
  s3BucketStack: S3BucketStack
}

export class UsersApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: UsersApiStackProps) {
    super(scope, id, props)
    const userLambda = new NodejsFunction(this, 'UserHandler', {
      runtime: Runtime.NODEJS_24_X,
      entry: path.join(__dirname, '../src/lambda/handler.ts'),
      handler: 'handler',
      functionName: `${this.stackName}-user-handler`,
      environment: {
        TABLE_NAME: props?.dynamodbStack.usersTable.tableName,
        BUCKET_NAME: props?.s3BucketStack.profilePicturesBucket.bucketName,
      },
    })

    props.dynamodbStack.usersTable.grantReadWriteData(userLambda)
    props.s3BucketStack.profilePicturesBucket.grantReadWrite(userLambda)

    const httpApi = new apigateway.HttpApi(this, 'usersApi', {
      apiName: 'users-api',
      description: 'Users Management API',
      corsPreflight: {
        allowOrigins: ['https://hk-usermanagement.vercel.app'],
        allowMethods: [apigateway.CorsHttpMethod.ANY],
        allowHeaders: ['*'],
      },
    })

    const routes = [
      {
        path: '/users',
        method: apigateway.HttpMethod.GET,
        name: 'GetAllUsers',
      },
      {
        path: '/users',
        method: apigateway.HttpMethod.POST,
        name: 'CreateUser',
      },
      {
        path: '/users/{id}',
        method: apigateway.HttpMethod.GET,
        name: 'GetUser',
      },
      {
        path: '/users/{id}',
        method: apigateway.HttpMethod.PUT,
        name: 'UpdateUser',
      },
      {
        path: '/users/{id}',
        method: apigateway.HttpMethod.DELETE,
        name: 'DeleteUser',
      },
    ]

    routes.forEach(({ path, method, name }) => {
      httpApi.addRoutes({
        path,
        methods: [method],
        integration: new apigateway_integrations.HttpLambdaIntegration(
          `${name}Integration`,
          userLambda
        ),
      })
    })

    const defaultStage = httpApi.defaultStage!.node
      .defaultChild as apigateway.CfnStage
    defaultStage.defaultRouteSettings = {
      throttlingRateLimit: 10,
      throttlingBurstLimit: 20,
    }

    new cdk.CfnOutput(this, 'api url', {
      value: httpApi.url ?? '',
      description: 'http api url',
    })
  }
}
