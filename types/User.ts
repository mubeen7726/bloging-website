export interface UserType {
  _id:string
  Username: string
  isAdmin?: boolean
  email?: string
  createdAt?: Date
  providerUserId: string
  image?: string
}
