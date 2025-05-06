export interface UserProfileData {
    _id: string;
    email: string;
    Username?: string;
    providerUserId:string;
    image?: string;
    isAdmin: boolean;
    createdAt?: string;
    updatedAt?: string;
    // Add other fields as needed
  }
  
  export interface UserProfileResponse {
    data: UserProfileData;
    message?: string;
    success: boolean;
  }
  
  export interface UserState {
    profile: UserProfileResponse | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  }