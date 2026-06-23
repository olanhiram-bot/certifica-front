export interface ValidatorStamp {
  id: number
  percent: number
  percent_moduls: number
  percent_evaluations: number
  is_active: string
  vigency_start_date: string | null
  vigency_end_date: string | null
  provider_id: number
  reviewer_id: number | null
  modality_type_id: number
  stamp_status_id: number
  stamp_status?: {
    id: number
    name: string
    color: string
  }
  provider?: {
    id: number
    username: string
    email: string
    rfc: string
    name: string
  }
  created_at: string | null
  updated_at: string | null
}

export interface ValidatorStampActivity {
  id: number
  stamp_id: number
  activity_id: number
  activity_name: string
  activity_description: string
  stamp_activity_status_id: number
  status_name: string
  status_hexadecimal: string
  file_url: string | null
  file_name: string | null
  file_size: string | null
  unit_size: string | null
  upload_date: string | null
  material_was_view: boolean
  score: number
  created_at: string | null
}