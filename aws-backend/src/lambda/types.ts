export type UserInput = {
  name: string
  email: string
  imageData?: string // base64 encoded image, optional
}

// shape of the entry in the dynamoDB table
export type UserTableEntry = {
  id: string
  name: string
  email: string
  imageUrl?: string // url of the image from s3 bucket
  createdAt: string
}
