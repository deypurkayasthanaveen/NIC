import { records as seedRecords } from '../data/records'
import type { DataRecord, DataRecordInput } from '../types/record'
import { todayIso } from '../utils/format'
import { mockError, mockResponse, nextId } from './mockDelay'

let records: DataRecord[] = structuredClone(seedRecords)

export const recordService = {
  getRecords(): Promise<DataRecord[]> {
    return mockResponse(records)
  },

  createRecord(input: DataRecordInput): Promise<DataRecord> {
    const today = todayIso()
    const record: DataRecord = { ...input, id: nextId(records), createdAt: today, updatedAt: today }
    records = [...records, record]
    return mockResponse(record)
  },

  updateRecord(id: number, input: DataRecordInput): Promise<DataRecord> {
    const existing = records.find((record) => record.id === id)
    if (!existing) return mockError(`Record with ID ${id} was not found.`)
    const updated: DataRecord = { ...existing, ...input, updatedAt: todayIso() }
    records = records.map((record) => (record.id === id ? updated : record))
    return mockResponse(updated)
  },

  deleteRecord(id: number): Promise<void> {
    records = records.filter((record) => record.id !== id)
    return mockResponse(undefined)
  },
}
