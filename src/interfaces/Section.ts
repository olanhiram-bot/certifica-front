import type { StampActivityResource } from './Stamp'

export interface ActivityResource {
  id: number
  name: string
  description: string | null
  file_url: string
  image_url: string
  file_url_content: string | null
  url_content: string | null
  stamp_activity: StampActivityResource | null
  created_at: string | null
  updated_at: string | null
  created_by: number | null
  updated_by: number | null
  deleted_by: number | null
  deleted_at: string | null
}

export interface SectionResource {
  id: number
  name: string
  section_type_id: number
  created_at: string | null
  updated_at: string | null
  created_by: number | null
  updated_by: number | null
  deleted_by: number | null
  deleted_at: string | null
  deleted_reason: string
  activities: ActivityResource[]
}

export interface SectionsResponse {
  data: SectionResource[]
}

export interface ActivitiesResponse {
  data: ActivityResource[]
}

export interface ActivityResponse {
  data: ActivityResource
}
