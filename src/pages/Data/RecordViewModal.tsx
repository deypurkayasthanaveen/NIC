import { Badge, StatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { DetailList } from '../../components/common/DetailList'
import { Modal } from '../../components/common/Modal'
import type { DataRecord } from '../../types/record'
import { formatDate } from '../../utils/format'

interface RecordViewModalProps {
  record: DataRecord
  onClose: () => void
  onEdit: () => void
}

export function RecordViewModal({ record, onClose, onEdit }: RecordViewModalProps) {
  return (
    <Modal
      open
      title={record.name}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>Edit Record</Button>
        </>
      }
    >
      <DetailList
        items={[
          { label: 'Record ID', value: `#${record.id}` },
          { label: 'Category', value: <Badge tone="info">{record.category}</Badge> },
          { label: 'Status', value: <StatusBadge status={record.status} /> },
          { label: 'Created Date', value: formatDate(record.createdAt) },
          { label: 'Updated Date', value: formatDate(record.updatedAt) },
        ]}
      />
    </Modal>
  )
}
