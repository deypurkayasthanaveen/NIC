import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
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
import { roleService } from '../../services/roleService'
import { userService } from '../../services/userService'
import { STATUSES } from '../../types/common'
import type { Role, RoleInput } from '../../types/role'
import { RoleFormModal } from './RoleFormModal'
import styles from './Roles.module.css'
import { RoleViewModal } from './RoleViewModal'

type RoleSortKey = 'name' | 'status'
type ModalState = { mode: 'create' } | { mode: 'edit'; role: Role } | { mode: 'view'; role: Role } | null

const SEARCH_KEYS: (keyof Role)[] = ['name', 'description']
const FILTER_KEYS: (keyof Role & string)[] = ['status']
const statusOptions = STATUSES.map((status) => ({ value: status, label: status }))

export function RoleListPage() {
  const { showToast } = useToast()
  const roles = useAsync(roleService.getRoles)
  const users = useAsync(userService.getUsers)
  const [modal, setModal] = useState<ModalState>(null)
  const [pendingDelete, setPendingDelete] = useState<Role | null>(null)
  const [deleting, setDeleting] = useState(false)

  const userCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const user of users.data ?? []) counts.set(user.role, (counts.get(user.role) ?? 0) + 1)
    return counts
  }, [users.data])

  const table = useTableState<Role, RoleSortKey>({
    items: roles.data ?? [],
    searchKeys: SEARCH_KEYS,
    filterKeys: FILTER_KEYS,
    initialSort: { key: 'name', direction: 'asc' },
  })

  const handleSave = async (values: RoleInput) => {
    const editing = modal?.mode === 'edit' ? modal.role : null
    try {
      if (editing) {
        await roleService.updateRole(editing.id, values)
        showToast('success', 'Role updated successfully')
      } else {
        await roleService.createRole(values)
        showToast('success', 'Role created successfully')
      }
      setModal(null)
      roles.reload()
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'The role could not be saved.')
    }
  }

  const requestDelete = (role: Role) => {
    const assigned = userCounts.get(role.name) ?? 0
    if (assigned > 0) {
      showToast('warning', `${role.name} is assigned to ${assigned} user(s). Reassign them before deleting this role.`)
      return
    }
    setPendingDelete(role)
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await roleService.deleteRole(pendingDelete.id)
      showToast('success', 'Role deleted successfully')
      roles.reload()
    } catch {
      showToast('error', 'The role could not be deleted. Please try again.')
    } finally {
      setDeleting(false)
      setPendingDelete(null)
    }
  }

  const columns: Column<Role>[] = [
    { key: 'name', header: 'Role', sortKey: 'name', render: (role) => <span className={styles.name}>{role.name}</span> },
    {
      key: 'description',
      header: 'Description',
      render: (role) => <span className={styles.description}>{role.description || '-'}</span>,
    },
    { key: 'users', header: 'Users', render: (role) => (users.data ? (userCounts.get(role.name) ?? 0) : '-') },
    { key: 'status', header: 'Status', sortKey: 'status', render: (role) => <StatusBadge status={role.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (role) => (
        <TableActions
          itemLabel={role.name}
          onView={() => setModal({ mode: 'view', role })}
          onEdit={() => setModal({ mode: 'edit', role })}
          onDelete={() => requestDelete(role)}
        />
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Roles"
        description="Define roles and the permissions they grant. Frontend demonstration only."
        actions={
          <Button icon={<Plus size={16} />} onClick={() => setModal({ mode: 'create' })}>
            Add Role
          </Button>
        }
      />

      <Card flush>
        <TableToolbar
          search={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search roles"
          onClear={table.clearFilters}
          showClear={table.hasActiveFilters}
        >
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
          caption="Roles"
          columns={columns}
          rows={table.pageItems}
          rowKey={(role) => role.id}
          isLoading={roles.isLoading}
          isFetching={roles.isFetching}
          error={roles.error}
          onRetry={roles.reload}
          sort={table.sort}
          onSort={(key) => table.toggleSort(key as RoleSortKey)}
          emptyTitle={table.hasActiveFilters ? 'No matching roles' : 'No roles yet'}
          emptyDescription={table.hasActiveFilters ? 'Try a different search or clear the filters.' : undefined}
        />

        {!roles.isLoading && !roles.error && (
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
        <RoleFormModal
          role={modal.mode === 'edit' ? modal.role : undefined}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {modal?.mode === 'view' && (
        <RoleViewModal
          role={modal.role}
          userCount={userCounts.get(modal.role.name) ?? 0}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ mode: 'edit', role: modal.role })}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete Role?"
        message={`Are you sure you want to delete the ${pendingDelete?.name ?? ''} role?`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
