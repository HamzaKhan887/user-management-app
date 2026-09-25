# User Management App

**Live site:** https://hk-usermanagement.vercel.app/

Manage users through a simple UI. Create, edit and delete users, each with an optional profile picture, using AWS Lambda, API Gateway, DynamoDB and S3.

## Features

- Create, edit and delete users, each with an optional profile picture stored in S3

## Screenshots

**Main Page:** create a new user and browse the full list, sorted newest first.

![Main Page](./assets/main-page.png)

**Edit User:** update a user's details or replace their profile picture from a pre-filled dialog.

![Edit User](./assets/edit-user.png)

**Delete User:** confirm before removing a user from the table.

![Delete User](./assets/delete-user.png)

## Built with

**Frontend**
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Query](https://tanstack.com/query): data fetching, caching and server-side prefetching
- [Axios](https://axios-http.com/): API client
- [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/): form state management and schema validation
- [Tailwind CSS](https://tailwindcss.com/): styling
- [shadcn/ui](https://ui.shadcn.com/): UI components

**Backend**
- [AWS CDK](https://aws.amazon.com/cdk/): infrastructure as code
- [AWS Lambda](https://aws.amazon.com/lambda/): backend functions
- [Amazon API Gateway](https://aws.amazon.com/api-gateway/): HTTP routing
- [Amazon DynamoDB](https://aws.amazon.com/dynamodb/): database
- [Amazon S3](https://aws.amazon.com/s3/): profile picture storage
- [AWS SDK for JavaScript v3](https://github.com/aws/aws-sdk-js-v3): DynamoDB and S3 clients