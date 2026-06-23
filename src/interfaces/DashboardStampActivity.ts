export interface DashboardStampActivity {
  id: number
  activity_id: number
  stamp_activity_status_id: number
  created_at: string
  activity: {
    id: number
    name: string
    section_id: number
    section?: {
      id: number
      name: string
    }
  }
  status: {
    id: number
    name: string
    hexadecimal: string
  }
}