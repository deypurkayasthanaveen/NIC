import { RECORD_CATEGORIES, type DataRecord } from '../types/record'

const subjects = [
  'Quarterly Budget', 'Vendor Contract', 'Warehouse Audit', 'Campaign Brief',
  'Payroll Batch', 'Asset Register', 'Shipment Log', 'Expense Claim',
  'Training Plan', 'Stock Count',
]

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export const records: DataRecord[] = Array.from({ length: 50 }, (_, index) => {
  const id = index + 1
  const createdMonth = (index % 8) + 1
  return {
    id,
    name: `${subjects[index % subjects.length]} #${1000 + id}`,
    category: RECORD_CATEGORIES[index % RECORD_CATEGORIES.length],
    status: index % 5 === 2 ? 'Inactive' : 'Active',
    createdAt: `2026-${pad(createdMonth)}-${pad((index % 25) + 1)}`,
    updatedAt: `2026-${pad(createdMonth + 1)}-${pad(((index * 3) % 25) + 1)}`,
  }
})
