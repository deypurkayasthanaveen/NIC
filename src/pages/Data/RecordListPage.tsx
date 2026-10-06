import { Plus } from 'lucide-react'
import { useState } from 'react'
import { StatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { PageHeader } from '../../components/common/PageHeader'
import { Select } from '../../components/common/Select'
import { DataTable, type Column } from '../../components/table/DataTable'
import { TableActions } from '../../components/table/TableActions'
import { TablePagination } from '../../components/table/TablePagination'
import { TableToolbar } from '../../components/table/TableToolbar'
import { useAsync } from '../../hooks/useAsync'
import { useTableState } from '../../hooks/useTableState'
import { useToast } from '../../hooks/useToast'
import { recordService } from '../../services/recordService'
import { STATUSES } from '../../types/common'
import { RECORD_CATEGORIES, type DataRecord, type DataRecordInput } from '../../types/record'
import { formatDate } from '../../utils/format'
import styles from './Data.module.css'
import { RecordFormModal } from './RecordFormModal'
import { RecordViewModal } from './RecordViewModal'

type RecordSortKey = 'name' | 'status' | 'createdAt' | 'updatedAt'
type ModalState =
  | { mode: 'create' }
  | { mode: 'edit'; record: DataRecord }
  | { mode: 'view'; record: DataRecord }
  | null

const SEARCH_KEYS: (keyof DataRecord)[] = ['name']
const FILTER_KEYS: (keyof DataRecord & string)[] = ['category', 'status']
const statusOptions = STATUSES.map((status) => ({ value: status, label: status }))
const categoryOptions = RECORD_CATEGORIES.map((category) => ({ value: category, label: category }))

const baseColumns: Column<DataRecord>[] = [
  { key: 'id', header: 'ID', render: (record) => <span className={styles.muted}>#{record.id}</span> },
  {
    key: 'name',
    header: 'Name',
    sortKey: 'name',
    render: (record) => <span className={styles.name}>{record.name}</span>,
  },
  { key: 'category', header: 'Category', render: (record) => record.category },
  { key: 'status', header: 'Status', sortKey: 'status', render: (record) => <StatusBadge status={record.status} /> },
  { key: 'createdAt', header: 'Created Date', sortKey: 'createdAt', render: (record) => formatDate(record.createdAt) },
  { key: 'updatedAt', header: 'Updated Date', sortKey: 'updatedAt', render: (record) => formatDate(record.updatedAt) },
]

export function RecordListPage() {
  const { showToast } = useToast()
  const { data, error, isLoading, isFetching, reload } = useAsync(recordService.getRecords)
  const [modal, setModal] = useState<ModalState>(null)
  const [pendingDelete, setPendingDelete] = useState<DataRecord | null>(null)
  const [deleting, setDeleting] = useState(false)

  const table = useTableState<DataRecord, RecordSortKey>({
    items: data ?? [],
    searchKeys: SEARCH_KEYS,
    filterKeys: FILTER_KEYS,
    initialSort: { key: 'updatedAt', direction: 'desc' },
  })

  const handleSave = async (values: DataRecordInput) => {
    const editing = modal?.mode === 'edit' ? modal.record : null
    try {
      if (editing) {
        await recordService.updateRecord(editing.id, values)
        showToast('success', 'Record updated successfully')
      } else {
        await recordService.createRecord(values)
        showToast('success', 'Record created successfully')
      }
      setModal(null)
      reload()
    } catch (saveError) {
      showToast('error', saveError instanceof Error ? saveError.message : 'The record could not be saved.')
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await recordService.deleteRecord(pendingDelete.id)
      showToast('success', 'Record deleted successfully')
      reload()
    } catch {
      showToast('error', 'The record could not be deleted. Please try again.')
    } finally {
      setDeleting(false)
      setPendingDelete(null)
    }
  }

  const columns: Column<DataRecord>[] = [
    ...baseColumns,
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (record) => (
        <TableActions
          itemLabel={record.name}
          onView={() => setModal({ mode: 'view', record })}
          onEdit={() => setModal({ mode: 'edit', record })}
          onDelete={() => setPendingDelete(record)}
        />
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Data"
        description="Browse and maintain generic data records."
        actions={
          <Button icon={<Plus size={16} />} onClick={() => setModal({ mode: 'create' })}>
            Add Record
          </Button>
        }
      />

      <Card flush>
        <TableToolbar
          search={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search by name"
          onClear={table.clearFilters}
          showClear={table.hasActiveFilters}
        >
          <Select
            label="Filter by category"
            hideLabel
            placeholder="All categories"
            options={categoryOptions}
            value={table.filters.category}
            onChange={(event) => table.setFilter('category', event.target.value)}
          />
          <Select
            label="Filter by status"
            hideLabel
            placeholder="All statuses"
            options={statusOptions}
            value={table.filters.status}
            onChange={(event) => table.setFilter('status', event.target.value)}
          />
        </TableToolbar>

        <DataTable
          caption="Data records"
          columns={columns}
          rows={table.pageItems}
          rowKey={(record) => record.id}
          isLoading={isLoading}
          isFetching={isFetching}
          error={error}
          onRetry={reload}
          sort={table.sort}
          onSort={(key) => table.toggleSort(key as RecordSortKey)}
          emptyTitle={table.hasActiveFilters ? 'No matching records' : 'No records yet'}
          emptyDescription={
            table.hasActiveFilters ? 'Try a different search or clear the filters.' : 'Add a record to get started.'
          }
          emptyAction={
            !table.hasActiveFilters && (
              <Button icon={<Plus size={16} />} onClick={() => setModal({ mode: 'create' })}>
                Add Record
              </Button>
            )
          }
        />

        {!isLoading && !error && (
          <TablePagination
            page={table.page}
            totalPages={table.totalPages}
            totalItems={table.totalItems}
            pageSize={table.pageSize}
            onPageChange={table.setPage}
          />
        )}
      </Card>

      {(modal?.mode === 'create' || modal?.mode === 'edit') && (
        <RecordFormModal
          record={modal.mode === 'edit' ? modal.record : undefined}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {modal?.mode === 'view' && (
        <RecordViewModal
          record={modal.record}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ mode: 'edit', record: modal.record })}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete Record?"
        message={`Are you sure you want to delete ${pendingDelete?.name ?? 'this record'}?`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
