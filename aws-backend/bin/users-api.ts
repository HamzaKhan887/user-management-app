#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core'
import { UsersApiStack } from '../lib/users-api-stack'
import { DynamodbStack } from '../lib/dynamodb-stack'
import { S3BucketStack } from '../lib/s3-bucket-stack'

const app = new cdk.App()

const dynamodbStack = new DynamodbStack(app, 'DynamoDBStack')
const s3BucketStack = new S3BucketStack(app, 's3Bucket')
const usersApiStack = new UsersApiStack(app, 'UsersApiStack', {
  dynamodbStack,
  s3BucketStack,
})

usersApiStack.addStackDependency(dynamodbStack)
usersApiStack.addStackDependency(s3BucketStack)
