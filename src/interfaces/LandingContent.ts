export interface LandingContent {
  id: number
  name: string | null
  description: string | null
  file_url: string | null
  image_url: string | null
  position: number | null
  landing_content_type_id: number
  landing_content_type?: { id: number; name: string }
  url_content: string,
  link?: string,
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by: number | null
  updated_by: number | null
  deleted_by: number | null
  deleted_reason: string | null
}
