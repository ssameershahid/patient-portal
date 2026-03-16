'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pill, Plus, Edit, Archive, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react'

interface Supplement {
  id: string
  name: string
  brand: string
  dosage: string
  url: string
  discountCode: string | null
  notes: string | null
  active: boolean
}

const INITIAL_CATALOGUE: Supplement[] = [
  { id: '1', name: 'Gut Health Shot', brand: 'Deeply', dosage: '1 shot daily', url: 'https://www.deeply.uk', discountCode: 'DRSARAH30', notes: null, active: true },
  { id: '2', name: 'Omega-3 Lion\'s Mane', brand: 'Bare Biology', dosage: '1 tsp daily', url: 'https://www.barebiology.com', discountCode: null, notes: null, active: true },
  { id: '3', name: 'Vitamin D3 + K2', brand: 'Wild Nutrition', dosage: '1 capsule daily', url: 'https://www.wildnutrition.com', discountCode: null, notes: null, active: true },
  { id: '4', name: 'Magnesium Taurate', brand: 'Pure Encapsulations', dosage: '2 capsules before bed', url: 'https://www.pureencapsulations.co.uk', discountCode: null, notes: null, active: true },
  { id: '5', name: 'True Collagen', brand: 'Ancient and Brave', dosage: '1 scoop in hot drink', url: 'https://www.ancientandbrave.earth', discountCode: null, notes: null, active: true },
  { id: '6', name: 'Magnesium Citrate', brand: 'Biogena', dosage: '1 capsule with dinner', url: 'https://www.biogena.com', discountCode: null, notes: null, active: true },
  { id: '7', name: 'Terranova Green Superblend', brand: 'Terranova', dosage: '1 tsp daily in smoothie', url: 'https://www.terranovahealth.com', discountCode: null, notes: null, active: true },
]

const BRANDS = [
  'Deeply', 'Terranova', 'Wild Nutrition', 'Pure Encapsulations',
  'Ancient and Brave', 'Biogena', 'Bare Biology', 'Other',
]

export default function AdminSupplementsPage() {
  const [catalogue, setCatalogue] = useState<Supplement[]>(INITIAL_CATALOGUE)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editItem, setEditItem] = useState<Supplement | null>(null)

  function toggleActive(id: string) {
    setCatalogue(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  function handleEdit(supp: Supplement) {
    setEditItem(supp)
    setEditOpen(true)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading">Supplement Catalogue</h1>
          <p className="text-sm text-cream-700 mt-1">{catalogue.filter(s => s.active).length} active products</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Supplement</DialogTitle>
            </DialogHeader>
            <SupplementForm onClose={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {catalogue.map((supp) => (
          <Card key={supp.id} className={!supp.active ? 'opacity-60' : ''}>
            <CardContent className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="p-2 rounded-xl bg-forest-50 shrink-0 self-start">
                <Pill className="h-5 w-5 text-forest-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-cream-900">{supp.name}</p>
                  <Badge variant="outline" className="text-[10px]">{supp.brand}</Badge>
                  {supp.discountCode && (
                    <Badge variant="warm" className="text-[10px]">Code: {supp.discountCode}</Badge>
                  )}
                </div>
                <p className="text-xs text-cream-700 mt-0.5">{supp.dosage}</p>
                <a href={supp.url} target="_blank" rel="noopener noreferrer" className="text-xs text-forest-500 hover:underline flex items-center gap-1 mt-0.5">
                  {supp.url.replace('https://', '').replace('www.', '')}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={supp.active ? 'success' : 'outline'}>
                  {supp.active ? 'Active' : 'Inactive'}
                </Badge>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleActive(supp.id)}>
                  {supp.active ? <ToggleRight className="h-4 w-4 text-forest-500" /> : <ToggleLeft className="h-4 w-4 text-cream-500" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(supp)}>
                  <Edit className="h-4 w-4 text-cream-600" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleActive(supp.id)}>
                  <Archive className="h-4 w-4 text-cream-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplement</DialogTitle>
          </DialogHeader>
          {editItem && <SupplementForm supplement={editItem} onClose={() => setEditOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SupplementForm({ supplement, onClose }: { supplement?: Supplement; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Product Name</Label>
        <Input defaultValue={supplement?.name} placeholder="e.g. Magnesium Glycinate" />
      </div>
      <div className="space-y-2">
        <Label>Brand</Label>
        <Select defaultValue={supplement?.brand}>
          <SelectTrigger>
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent>
            {BRANDS.map(b => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Default Dosage</Label>
        <Input defaultValue={supplement?.dosage} placeholder="e.g. 1 capsule daily" />
      </div>
      <div className="space-y-2">
        <Label>Purchase URL</Label>
        <Input defaultValue={supplement?.url} placeholder="https://..." />
      </div>
      <div className="space-y-2">
        <Label>Discount Code <Badge variant="outline" className="ml-2 text-[10px]">Optional</Badge></Label>
        <Input defaultValue={supplement?.discountCode ?? ''} placeholder="e.g. DRSARAH30" />
      </div>
      <div className="space-y-2">
        <Label>Notes <Badge variant="outline" className="ml-2 text-[10px]">Optional</Badge></Label>
        <Textarea defaultValue={supplement?.notes ?? ''} placeholder="Internal notes" rows={2} />
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>{supplement ? 'Save Changes' : 'Add Product'}</Button>
      </div>
    </div>
  )
}
