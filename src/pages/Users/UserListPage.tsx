import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { StatusBadge } from '../../components/common/Badge'
import { LinkButton } from '../../components/common/Button'
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
import { userService } from '../../services/userService'
import { STATUSES } from '../../types/common'
import type { User } from '../../types/user'
import { formatDate } from '../../utils/format'
import styles from './Users.module.css'
import { useRoleOptions } from './useRoleOptions'

type UserSortKey = 'name' | 'createdAt' | 'status'

const SEARCH_KEYS: (keyof User)[] = ['name', 'email']
const FILTER_KEYS: (keyof User & string)[] = ['role', 'status']
const statusOptions = STATUSES.map((status) => ({ value: status, label: status }))

const columns: Column<User>[] = [
  { key: 'id', header: 'ID', render: (user) => <span className={styles.muted}>#{user.id}</span> },
  {
    key: 'name',
    header: 'Name',
    sortKey: 'name',
    render: (user) => (
      <Link to={`/users/${user.id}`} className={styles.nameLink}>
        {user.name}
      </Link>
    ),
  },
  { key: 'email', header: 'Email', render: (user) => user.email },
  { key: 'role', header: 'Role', render: (user) => user.role },
  { key: 'status', header: 'Status', sortKey: 'status', render: (user) => <StatusBadge status={user.status} /> },
  { key: 'createdAt', header: 'Created Date', sortKey: 'createdAt', render: (user) => formatDate(user.createdAt) },
]

/** The header's global search links here with ?q=; keying on it re-initialises the list state. */
export function UserListPage() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  return <UserList key={query} initialSearch={query} />
}

function UserList({ initialSearch }: { initialSearch: string }) {
  const { showToast } = useToast()
  const { data, error, isLoading, isFetching, reload } = useAsync(userService.getUsers)
  const { options: roleOptions } = useRoleOptions()
  const [pendingDelete, setPendingDelete] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)

  const table = useTableState<User, UserSortKey>({
    items: data ?? [],
    searchKeys: SEARCH_KEYS,
    filterKeys: FILTER_KEYS,
    initialSort: { key: 'createdAt', direction: 'desc' },
    initialSearch,
  })

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await userService.deleteUser(pendingDelete.id)
      showToast('success', 'User deleted successfully')
      reload()
    } catch {
      showToast('error', 'The user could not be deleted. Please try again.')
    } finally {
      setDeleting(false)
      setPendingDelete(null)
    }
  }

  const tableColumns: Column<User>[] = [
    ...columns,
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (user) => (
        <TableActions
          itemLabel={user.name}
          onView={`/users/${user.id}`}
          onEdit={`/users/${user.id}/edit`}
          onDelete={() => setPendingDelete(user)}
        />
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage user accounts, roles, and status."
        actions={
          <LinkButton to="/users/new" icon={<Plus size={16} />}>
            Add User
          </LinkButton>
        }
      />

      <Card flush>
        <TableToolbar
          search={table.search}
          onSearchChange={table.setSearch}
          searchPlaceholder="Search by name or email"
          onClear={table.clearFilters}
          showClear={table.hasActiveFilters}
        >
          <Select
            label="Filter by role"
            hideLabel
            placeholder="All roles"
            options={roleOptions}
            value={table.filters.role}
            onChange={(event) => table.setFilter('role', event.target.value)}
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
          caption="Users"
          columns={tableColumns}
          rows={table.pageItems}
          rowKey={(user) => user.id}
          isLoading={isLoading}
          isFetching={isFetching}
          error={error}
          onRetry={reload}
          sort={table.sort}
          onSort={(key) => table.toggleSort(key as UserSortKey)}
          emptyTitle={table.hasActiveFilters ? 'No matching users' : 'No users yet'}
          emptyDescription={
            table.hasActiveFilters ? 'Try a different search or clear the filters.' : 'Add your first user to get started.'
          }
          emptyAction={
            !table.hasActiveFilters && (
              <LinkButton to="/users/new" icon={<Plus size={16} />}>
                Add User
              </LinkButton>
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

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete User?"
        message={`Are you sure you want to delete ${pendingDelete?.name ?? 'this user'}? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
