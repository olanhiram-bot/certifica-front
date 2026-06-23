export interface ActivityData {
  id: number
  name: string
  description: string | null
  url_content: string | null
  image_url?: string | null
  file_url?: string | null
  file_url_content?: string | null
}

export interface Stamp {
  id: number
  is_active: boolean | string
  vigency_start_date: string | null
  vigency_end_date: string | null
  percent: string | number
  percent_moduls: string | number
  percent_evaluations: string | number
  stamp_status_id?: number
  stamp_status?: {
    id: number
    name: string
    color?: string
  }
  provider_id: number
  reviewer_id: number | null
  modality_type_id: number
  created_at: string | null
  updated_at: string | null
  created_by: number | null
  updated_by: number | null
  deleted_by: number | null
  deleted_at: string | null
  deleted_reason: string | null
  remaining_days?: number | null
}

export interface StampActivityStatus {
  id: number
  name: string
  hexadecimal: string
}

export interface StampActivity {
  id: number
  stamp_id: number
  activity_id: number
  stamp_activity_status_id: number
  score: number
  file_url: string
  file_path: string
  file_name: string
  file_size: string
  extension: string
  unit_size: string
  upload_date: string
  material_was_view: boolean
  created_by: number | null
  updated_by: number | null
  deleted_by: number | null
  deleted_at: string | null
  deleted_reason: string | null
  created_at: string | null
  updated_at: string | null
  status: StampActivityStatus
}

export interface StampActivityResource {
  id: number
  stamp_id: number
  activity_id: number
  stamp_activity_status_id: number
  score: number
  file_url: string
  file_path: string
  file_name: string
  file_size: string
  extension: string
  unit_size: string
  upload_date: string
  material_was_view: boolean
  created_by: number | null
  updated_by: number | null
  deleted_by: number | null
  deleted_at: string | null
  deleted_reason: string | null
  created_at: string | null
  updated_at: string | null
  status: StampActivityStatus
  activity?: ActivityData
}

export interface StampActivityComment {
  id: string
  comment: string
  stamp_activity_id: string
  created_by: string
  updated_by: string
  deleted_by: string
  deleted_at: string
  deleted_reason: string
  created_at: string
  updated_at: string
}
