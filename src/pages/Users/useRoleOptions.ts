import { useMemo } from 'react'
import type { SelectOption } from '../../components/common/Select'
import { useAsync } from '../../hooks/useAsync'
import { roleService } from '../../services/roleService'

/** Role names as select options, optionally keeping a value that no longer exists (e.g. a deleted role). */
export function useRoleOptions(currentRole?: string): { options: SelectOption[]; isLoading: boolean } {
  const { data, isLoading } = useAsync(roleService.getRoles)

  const options = useMemo(() => {
    const names = (data ?? []).map((role) => role.name)
    if (currentRole && !names.includes(currentRole)) names.push(currentRole)
    return names.map((name) => ({ value: name, label: name }))
  }, [data, currentRole])

  return { options, isLoading }
}
