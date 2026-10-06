import type { Status } from './common'

export const RECORD_CATEGORIES = ['Finance', 'Operations', 'Inventory', 'Marketing', 'HR'] as const

export type RecordCategory = (typeof RECORD_CATEGORIES)[number]

export interface DataRecord {
  id: number
  name: string
  category: RecordCategory
  status: Status
  createdAt: string
  updatedAt: string
}

export type DataRecordInput = Pick<DataRecord, 'name' | 'category' | 'status'>
