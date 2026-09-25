import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import {
  ConditionalCheckFailedException,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb'
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { UserInput, UserTableEntry } from './types'

const client = new DynamoDBClient({})
const dynamoDB = DynamoDBDocumentClient.from(client)
const s3Client = new S3Client({})

const TABLE_NAME = process.env.TABLE_NAME || ''
const BUCKET_NAME = process.env.BUCKET_NAME || ''

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const method = event.requestContext.http.method
  const path = event.requestContext.http.path
  try {
    if (path === '/users') {
      switch (method) {
        case 'GET':
          return getAllUsers(event)
        case 'POST':
          return createUser(event)
        default:
          return {
            statusCode: 400,
            body: JSON.stringify({
              message: 'unsupported HTTP method for /users path',
            }),
          }
      }
    }

    if (path.startsWith('/users/')) {
      const userId = path.split('/users/')[1]
      if (!userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'user id is required' }),
        }
      }

      switch (method) {
        case 'GET':
          return getUser(userId)
        case 'PUT':
          return updateUser(event, userId)
        case 'DELETE':
          return deleteUser(userId)
        default:
          return {
            statusCode: 400,
            body: JSON.stringify({
              message: 'unsupported HTTP method for /users path',
            }),
          }
      }
    }

    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'not found',
      }),
    }
  } catch (error) {
    console.error('Error', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'internal server error',
      }),
    }
  }
}

async function uploadProfilePicture(
  userId: string,
  imageData: string
): Promise<string> {
  // image is sent between the frontend and backend in base64 as JSON can't carry binary
  // but s3 bucket wants the raw binary to store the image
  // so we use a buffer to convert from base64 back to the raw binary

  // remove data URL prefix, leaving behind the base64 data
  const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '')

  // convert base64 into raw binary
  const imageBuffer = Buffer.from(base64Data, 'base64')

  const fileExtension = imageData.includes('data:image/jpeg')
    ? 'jpg'
    : imageData.includes('data:image/png')
      ? 'png'
      : imageData.includes('data:image/gif')
        ? 'gif'
        : 'jpg'

  const s3Key = `profile-pictures/${userId}-${Date.now()}.${fileExtension}`

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: imageBuffer,
      ContentType: `image/${fileExtension}`,
    })
  )

  return `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`
}

function getS3KeyFromUrl(imageUrl: string): string {
  // s3 bucket urls look like this: https://somebucket.s3.amazonaws.com/profile-pictures/abc123-1737000000000.jpg
  // we want to only get the 'profile-pictures/abc123-1737000000000.jpg' part
  // imageUrl.split('/') produces an array like:
  // ['https:', '', 'somebucket.s3.amazonaws.com', 'profile-pictures', 'abc123-1737000000000.jpg']
  // we then join the parts of the array from index 3 onwards with a / separating them
  // producing profile-pictures/abc123-1737000000000.jpg, which is our s3 key

  return imageUrl.split('/').slice(3).join('/')
}

async function fetchExistingUser(
  userId: string
): Promise<UserTableEntry | null> {
  const result = await dynamoDB.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: userId },
    })
  )
  return (result.Item as UserTableEntry) || null
}

async function getAllUsers(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const result = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    )
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items || []),
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch users' }),
    }
  }
}

async function createUser(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const user: UserInput = JSON.parse(event.body!)

  if (!user.name || !user.email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'name and email are required' }),
    }
  }

  const userId = uuidv4()
  const createdAt = new Date().toISOString()
  let imageUrl: string | undefined

  // save image to s3 bucket
  if (user.imageData) {
    try {
      imageUrl = await uploadProfilePicture(userId, user.imageData)
      console.log('Image uploaded to S3 successfully :', imageUrl)
    } catch (s3error) {
      console.error('S3 Error, could not save image to the bucket', s3error)
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'could not save image to the s3 bucket',
        }),
      }
    }
  }

  const userTableEntry: UserTableEntry = {
    id: userId,
    name: user.name,
    email: user.email,
    imageUrl,
    createdAt,
  }

  try {
    await dynamoDB.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: userTableEntry,
      })
    )

    return {
      statusCode: 201,
      body: JSON.stringify(userTableEntry),
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to create user' }),
    }
  }
}

async function getUser(userId: string): Promise<APIGatewayProxyResultV2> {
  try {
    const result = await dynamoDB.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id: userId },
      })
    )

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'user not found' }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch user' }),
    }
  }
}

async function updateUser(
  event: APIGatewayProxyEventV2,
  userId: string
): Promise<APIGatewayProxyResultV2> {
  const user: UserInput = JSON.parse(event.body!)

  if (!user.name || !user.email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'name and email are required' }),
    }
  }

  // fetch user from DB
  const existingUser = await fetchExistingUser(userId)

  if (!existingUser) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'user not found' }),
    }
  }

  let imageUrl: string | undefined = existingUser.imageUrl

  if (user.imageData) {
    // add new profile picture to s3 bucket
    try {
      imageUrl = await uploadProfilePicture(userId, user.imageData)
      console.log('Image uploaded to S3 successfully :', imageUrl)
    } catch (s3error) {
      console.error('S3 Error, could not save image to the bucket', s3error)
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'could not save image to the s3 bucket',
        }),
      }
    }
  }

  try {
    const updateExpressionParts = ['#name = :name', '#email = :email']
    const expressionAttributeNames: Record<string, string> = {
      '#name': 'name',
      '#email': 'email',
    }
    const expressionAttributeValues: Record<string, unknown> = {
      ':name': user.name,
      ':email': user.email,
    }

    if (imageUrl !== undefined) {
      updateExpressionParts.push('#imageUrl = :imageUrl')
      expressionAttributeNames['#imageUrl'] = 'imageUrl'
      expressionAttributeValues[':imageUrl'] = imageUrl
    }

    const updateResult = await dynamoDB.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id: userId },
        UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: 'attribute_exists(id)',
        ReturnValues: 'ALL_NEW',
      })
    )

    // delete old profile picture from s3 bucket
    if (user.imageData && existingUser.imageUrl) {
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: getS3KeyFromUrl(existingUser.imageUrl),
          })
        )
        console.log('Deleting pre-exising profile picture')
      } catch (s3error) {
        console.error('Error deleting old profile picture:', s3error)
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(updateResult.Attributes),
    }
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'user not found' }),
      }
    }
    console.error('Error updating user:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update user' }),
    }
  }
}

async function deleteUser(userId: string): Promise<APIGatewayProxyResultV2> {
  // fetch user from DB
  const existingUser = await fetchExistingUser(userId)

  if (!existingUser) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'user not found' }),
    }
  }

  // delete profile picture from s3 bucket
  if (existingUser.imageUrl) {
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: getS3KeyFromUrl(existingUser.imageUrl),
        })
      )
      console.log('Deleting profile picture')
    } catch (s3error) {
      console.error('Error deleting profile picture:', s3error)
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'could not delete profile picture from the s3 bucket',
        }),
      }
    }
  }

  try {
    await dynamoDB.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id: userId },
        ConditionExpression: 'attribute_exists(id)',
      })
    )
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `user deleted ${userId}` }),
    }
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'user not found' }),
      }
    }
    console.error('Error deleting user:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to delete user' }),
    }
  }
}
