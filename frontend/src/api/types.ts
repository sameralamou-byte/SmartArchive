export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserRead {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  organization_id: string;
  email_verified: boolean;
}

export interface DocumentRead {
  id: string;
  title: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  status: string;
  created_at: string;
}
