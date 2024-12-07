import { PageHeader } from '@/components/app'
import {
  Badge,
  Button,
  ComboBox,
  Empty,
  FileTrigger,
  Form,
  Menu,
  MenuItem,
  MenuTrigger,
  Modal,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TextField,
} from '@/components/common'
import { api } from '@convex/_generated/api'
import type { DataModel, Id } from '@convex/_generated/dataModel'
import { JURISDICTIONS, type Jurisdiction } from '@convex/constants'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { Ellipsis, FileText, Plus } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/admin/documents/')({
  component: DocumentsRoute,
})

const NewDocumentModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
}: {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSubmit: () => void
}) => {
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl)
  const uploadPDF = useMutation(api.documents.upload)
  const createDocument = useMutation(api.documents.create)
  const quests = useQuery(api.quests.getAllActive)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>(null)
  const [questId, setQuestId] = useState<Id<'quests'> | null>(null)

  const clearForm = () => {
    setFile(null)
    setTitle('')
    setCode('')
    setJurisdiction(null)
    setQuestId(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (jurisdiction === null) throw new Error('Jurisdiction is required')
    if (file === null) throw new Error('File is required')
    if (questId === null) throw new Error('Quest is required')

    setIsSubmitting(true)
    const documentId = await createDocument({
      title,
      jurisdiction,
      code,
      questId,
    })

    const postUrl = await generateUploadUrl()
    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    })
    const { storageId } = await result.json()

    await uploadPDF({ documentId, storageId })

    clearForm()
    onSubmit()
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="w-full max-w-xl"
    >
      <ModalHeader title="Upload Document" />
      <Form onSubmit={handleSubmit} className="w-full">
        <TextField
          label="Title"
          value={title}
          onChange={setTitle}
          autoFocus
          isRequired
          className="w-full"
        />
        <TextField label="Code" value={code} onChange={setCode} />
        <Select
          label="State"
          selectedKey={jurisdiction}
          onSelectionChange={(key) => setJurisdiction(key as Jurisdiction)}
          isRequired
          className="w-full"
        >
          {Object.entries(JURISDICTIONS).map(([key, value]) => (
            <SelectItem key={key} id={key}>
              {value}
            </SelectItem>
          ))}
        </Select>
        <ComboBox
          label="Quest"
          selectedKey={questId}
          onSelectionChange={(key) => setQuestId(key as Id<'quests'>)}
          isRequired
          className="w-full"
        >
          {quests?.map((quest) => {
            const textValue = `${quest.title}${
              quest.jurisdiction ? ` (${quest.jurisdiction})` : ''
            }`

            return (
              <SelectItem key={quest._id} id={quest._id} textValue={textValue}>
                {quest.title}{' '}
                {quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
              </SelectItem>
            )
          })}
        </ComboBox>
        <FileTrigger
          acceptedFileTypes={['application/pdf']}
          onSelect={(e) => {
            if (e === null) return
            const files = Array.from(e)
            setFile(files[0])
          }}
        >
          <Button type="button" variant="secondary">
            {file ? file.name : 'Select PDF'}
          </Button>
        </FileTrigger>
        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onPress={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isDisabled={isSubmitting}>
            Upload
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

const DocumentTableRow = ({
  document,
}: {
  document: DataModel['documents']['document']
}) => {
  const formUrl = useQuery(api.documents.getURL, { documentId: document._id })
  const softDelete = useMutation(api.documents.softDelete)
  const undelete = useMutation(api.documents.undoSoftDelete)
  const deleteForever = useMutation(api.documents.deleteForever)

  return (
    <TableRow
      key={document._id}
      className="flex gap-2 items-center"
      href={{
        to: '/admin/documents/$documentId',
        params: { documentId: document._id },
      }}
    >
      <TableCell>
        <div>{document.title}</div>
        {document.deletionTime && (
          <span className="text-red-5" slot="description">
            {`deleted ${new Date(document.deletionTime).toLocaleString()}`}
          </span>
        )}
      </TableCell>
      <TableCell>
        {document.jurisdiction && <Badge>{document.jurisdiction}</Badge>}
      </TableCell>
      <TableCell>{new Date(document._creationTime).toLocaleString()}</TableCell>
      <TableCell>
        <MenuTrigger>
          <Button
            variant="icon"
            aria-label="Actions"
            size="small"
            icon={Ellipsis}
          />
          <Menu>
            {formUrl && (
              <MenuItem href={formUrl} target="_blank" rel="noreferrer">
                View PDF
              </MenuItem>
            )}
            {document.deletionTime ? (
              <>
                <MenuItem
                  onAction={() => undelete({ documentId: document._id })}
                >
                  Undelete
                </MenuItem>
                {/* TODO: Add modal */}
                <MenuItem
                  onAction={() => deleteForever({ documentId: document._id })}
                >
                  Permanently Delete
                </MenuItem>
              </>
            ) : (
              <MenuItem
                onAction={() => softDelete({ documentId: document._id })}
              >
                Delete
              </MenuItem>
            )}
          </Menu>
        </MenuTrigger>
      </TableCell>
    </TableRow>
  )
}

function DocumentsRoute() {
  const [isNewFormModalOpen, setIsNewFormModalOpen] = useState(false)
  const documents = useQuery(api.documents.getAll)

  return (
    <div>
      <PageHeader title="Documents">
        <Button
          onPress={() => setIsNewFormModalOpen(true)}
          icon={Plus}
          variant="primary"
        >
          Upload Document
        </Button>
      </PageHeader>
      <Table aria-label="Documents">
        <TableHeader>
          <TableColumn isRowHeader>Title</TableColumn>
          <TableColumn>Jurisdiction</TableColumn>
          <TableColumn>Created</TableColumn>
          <TableColumn />
        </TableHeader>
        <TableBody
          items={documents}
          renderEmptyState={() => (
            <Empty
              title="No documents"
              icon={FileText}
              button={{
                children: 'New Document',
                onPress: () => setIsNewFormModalOpen(true),
              }}
            />
          )}
        >
          {documents?.map((document) => (
            <DocumentTableRow key={document._id} document={document} />
          ))}
        </TableBody>
      </Table>
      <NewDocumentModal
        isOpen={isNewFormModalOpen}
        onOpenChange={setIsNewFormModalOpen}
        onSubmit={() => setIsNewFormModalOpen(false)}
      />
    </div>
  )
}
