import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export class S3BucketStack extends cdk.Stack {
  public readonly profilePicturesBucket: s3.Bucket

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    this.profilePicturesBucket = new s3.Bucket(this, 'ProfilePictureBucket', {
      bucketName: `${this.stackName.toLowerCase()}-picture-bucket`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: false,
        ignorePublicAcls: true,
        restrictPublicBuckets: false,
      }),
    })

    this.profilePicturesBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [new iam.AnyPrincipal()],
        resources: [
          `${this.profilePicturesBucket.bucketArn}/profile-pictures/*`,
        ],
      })
    )
  }
}
