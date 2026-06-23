import type { LinkPaginate } from './LinkPaginate'

export interface PaginateResponse {
  current_page: number
  first_page_url?: string
  from?: null
  last_page: number
  last_page_url?: string
  links: LinkPaginate[]
  next_page_url?: null
  path: string
  per_page: number
  prev_page_url?: null
  to?: null
  total: number
}
