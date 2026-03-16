'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileText, Image, File, Upload, Download, Eye, X, CloudUpload } from 'lucide-react'

type DocFilter = 'all' | 'lab_result' | 'patient_upload' | 'food_diary' | 'intake_form'

const FILTERS: { key: DocFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'lab_result', label: 'Lab Results' },
  { key: 'patient_upload', label: 'My Uploads' },
  { key: 'food_diary', label: 'Food Diaries' },
  { key: 'intake_form', label: 'Intake Forms' },
]

const MOCK_DOCS = [
  {
    id: '1',
    file_name: 'Blood Panel Results - March 2026.pdf',
    type: 'lab_result' as const,
    lab_provider: 'TDL',
    uploaded_by: 'admin',
    notes: 'Vitamin D levels are low — we will discuss supplementation at your next appointment.',
    created_at: '2026-03-10T14:30:00Z',
    mime_type: 'application/pdf',
    file_size: 245000,
  },
  {
    id: '2',
    file_name: 'Gut Microbiome Analysis.pdf',
    type: 'lab_result' as const,
    lab_provider: 'GutID',
    uploaded_by: 'admin',
    notes: null,
    created_at: '2026-02-28T10:15:00Z',
    mime_type: 'application/pdf',
    file_size: 1840000,
  },
  {
    id: '3',
    file_name: 'Previous GP Records.pdf',
    type: 'patient_upload' as const,
    lab_provider: null,
    uploaded_by: 'self',
    notes: null,
    created_at: '2026-02-15T09:00:00Z',
    mime_type: 'application/pdf',
    file_size: 520000,
  },
  {
    id: '4',
    file_name: 'Genetic Report - TeamGene.pdf',
    type: 'lab_result' as const,
    lab_provider: 'TeamGene',
    uploaded_by: 'admin',
    notes: 'Interesting findings around MTHFR — we covered this in our last session.',
    created_at: '2026-01-20T16:45:00Z',
    mime_type: 'application/pdf',
    file_size: 3200000,
  },
  {
    id: '5',
    file_name: 'Allergy Test Photo.jpg',
    type: 'patient_upload' as const,
    lab_provider: null,
    uploaded_by: 'self',
    notes: null,
    created_at: '2026-01-12T11:20:00Z',
    mime_type: 'image/jpeg',
    file_size: 890000,
  },
]

function getFileIcon(mimeType: string | null) {
  if (mimeType?.startsWith('image/')) return <Image className="h-5 w-5 text-warm-500" />
  if (mimeType?.includes('pdf')) return <FileText className="h-5 w-5 text-error" />
  return <File className="h-5 w-5 text-forest-500" />
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getTypeBadge(type: string) {
  const map: Record<string, { label: string; variant: 'default' | 'warm' | 'neutral' }> = {
    lab_result: { label: 'Lab Result', variant: 'default' },
    patient_upload: { label: 'My Upload', variant: 'warm' },
    food_diary: { label: 'Food Diary', variant: 'neutral' },
    intake_form: { label: 'Intake Form', variant: 'neutral' },
  }
  const info = map[type] || { label: type, variant: 'neutral' as const }
  return <Badge variant={info.variant}>{info.label}</Badge>
}

export default function DocumentsPage() {
  const [filter, setFilter] = useState<DocFilter>('all')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const filtered = filter === 'all' ? MOCK_DOCS : MOCK_DOCS.filter(d => d.type === filter)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold font-heading">My Documents</h1>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" /> Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                  dragOver ? 'border-forest-500 bg-forest-50' : 'border-cream-400 bg-cream-50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false) }}
              >
                <CloudUpload className="h-10 w-10 text-cream-500 mx-auto mb-3" />
                <p className="text-sm text-cream-800 font-medium mb-1">Drop files here or click to browse</p>
                <p className="text-xs text-cream-600">Accepted: PDF, JPG, PNG, DOCX — Max 25MB</p>
                <input id="file-upload" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx" />
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => document.getElementById('file-upload')?.click()}>
                  Choose File
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Notes <Badge variant="outline" className="ml-2 text-[10px]">Optional</Badge></Label>
                <Textarea placeholder="Add context about this document" rows={2} />
              </div>
              <Button className="w-full" onClick={() => setUploadOpen(false)}>
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.key
                ? 'bg-forest-700 text-white'
                : 'bg-cream-300 text-cream-800 hover:bg-cream-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cream-100 shrink-0 self-start">
                  {getFileIcon(doc.mime_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-medium text-cream-900 text-sm truncate">{doc.file_name}</p>
                    {getTypeBadge(doc.type)}
                    {doc.lab_provider && (
                      <Badge variant="outline" className="text-[10px]">{doc.lab_provider}</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-cream-600">
                    <span>{formatDate(doc.created_at)}</span>
                    <span>{formatFileSize(doc.file_size)}</span>
                    <span>Uploaded by {doc.uploaded_by === 'admin' ? 'Dr Sarah' : 'You'}</span>
                  </div>
                  {doc.notes && (
                    <p className="text-xs text-forest-600 mt-2 bg-forest-50 rounded-xl px-3 py-2 italic">
                      &ldquo;{doc.notes}&rdquo; — Dr Sarah
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="View document">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Download document">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <FileText className="h-12 w-12 text-cream-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-1">No documents yet</h3>
            <p className="text-sm text-cream-700 max-w-md mx-auto">
              Your lab results and reports will appear here once Dr Sarah uploads them. You can also upload your own medical records or previous test results.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
