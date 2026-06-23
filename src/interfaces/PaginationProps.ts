import type { LinkPaginate } from './LinkPaginate'

export interface PaginationProps {
  links: LinkPaginate[]
  currentPage: number
  perPage: number
  total: number
  to?: number
}
