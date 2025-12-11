export interface TableHeader {
  field: string
  header: string
  width?: string
  sortable?: boolean
  filterable?: boolean
  dataType?: 'string' | 'number' | 'date' | 'boolean' | 'actions'
}