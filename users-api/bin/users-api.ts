#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core'
import { UsersApiStack } from '../lib/users-api-stack'
import { DynamodbStack } from '../lib/dynamodb-stack'

const app = new cdk.App()

const dynamodbStack = new DynamodbStack(app, 'DynamoDBStack')
const usersApiStack = new UsersApiStack(app, 'UsersApiStack', { dynamodbStack })

usersApiStack.addStackDependency(dynamodbStack)
