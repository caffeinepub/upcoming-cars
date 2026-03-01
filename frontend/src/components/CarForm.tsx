import React, { useState, useRef } from 'react';
import { Plus, X, Upload, Loader2 } from 'lucide-react';
import { Car, CarType, ExternalBlob } from '../backend';
import { formatLaunchDate } from '../lib/utils';

interface CarFormData {
  name: string;
  brand: string;
  carType: CarType;
  expectedLaunchDate: bigint;
  expectedPriceInr: bigint;
  engineOrBatterySpecs: string;
  range: bigint;
  mileage: bigint;
  topSpeed: bigint;
  interiorFeatures: string[];
  exteriorFeatures: string[];
  safetyFeatures: string[];
  pros: string[];
  cons: string[];
  expertReview: string;
  images: ExternalBlob[];
  isTrending: boolean;
  isFeatured: boolean;
}

interface CarFormProps {
  initialData?: Car;
  onSubmit: (data: CarFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

function ArrayInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('');
  const add = () => {
    if (input.trim()) { onChange([...values, input.trim()]); setInput(''); }
  };
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={`Add ${label.toLowerCase()}…`}
          className="flex-1 px-3 py-1.5 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
        />
        <button type="button" onClick={add} className="px-3 py-1.5 bg-auto-red text-white rounded text-sm hover:opacity-90">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v, i) => (
          <span key={i} className="flex items-center gap-1 bg-secondary text-xs px-2 py-1 rounded-full">
            {v}
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))}>
              <X className="w-3 h-3 hover:text-auto-red" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export function CarForm({ initialData, onSubmit, onCancel, isLoading }: CarFormProps) {
  const [form, setForm] = useState<CarFormData>({
    name: initialData?.name || '',
    brand: initialData?.brand || '',
    carType: initialData?.carType || CarType.petrol,
    expectedLaunchDate: initialData?.expectedLaunchDate || BigInt(Date.now()) * 1_000_000n,
    expectedPriceInr: initialData?.expectedPriceInr || 0n,
    engineOrBatterySpecs: initialData?.engineOrBatterySpecs || '',
    range: initialData?.range || 0n,
    mileage: initialData?.mileage || 0n,
    topSpeed: initialData?.topSpeed || 0n,
    interiorFeatures: initialData?.interiorFeatures || [],
    exteriorFeatures: initialData?.exteriorFeatures || [],
    safetyFeatures: initialData?.safetyFeatures || [],
    pros: initialData?.pros || [],
    cons: initialData?.cons || [],
    expertReview: initialData?.expertReview || '',
    images: initialData?.images || [],
    isTrending: initialData?.isTrending || false,
    isFeatured: initialData?.isFeatured || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.brand.trim()) e.brand = 'Brand is required';
    if (form.expectedPriceInr <= 0n) e.price = 'Price must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const newBlobs: ExternalBlob[] = [];
    for (const file of Array.from(files)) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => setUploadProgress(pct));
      newBlobs.push(blob);
    }
    setForm(f => ({ ...f, images: [...f.images, ...newBlobs] }));
    setUploading(false);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const isEV = form.carType === CarType.ev || (form.carType as unknown as { ev?: unknown })?.ev !== undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Car Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
            placeholder="e.g. Tata Nexon EV"
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>

        {/* Brand */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Brand *</label>
          <input
            type="text"
            value={form.brand}
            onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
            className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
            placeholder="e.g. Tata"
          />
          {errors.brand && <p className="text-xs text-destructive mt-1">{errors.brand}</p>}
        </div>

        {/* Type */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Type</label>
          <div className="flex gap-2">
            {[CarType.ev, CarType.petrol].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setForm(f => ({ ...f, carType: t }))}
                className={`flex-1 py-2 text-sm font-bold uppercase rounded border transition-all ${
                  form.carType === t ? 'bg-auto-red text-white border-auto-red' : 'border-border text-muted-foreground hover:border-auto-red'
                }`}
              >
                {t === CarType.ev ? '⚡ EV' : '⛽ Petrol'}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Expected Price (₹) *</label>
          <input
            type="number"
            value={form.expectedPriceInr.toString()}
            onChange={e => setForm(f => ({ ...f, expectedPriceInr: BigInt(e.target.value || '0') }))}
            className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
            placeholder="e.g. 1500000"
            min="0"
          />
          {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
        </div>

        {/* Launch Date */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Expected Launch Date</label>
          <input
            type="date"
            value={new Date(Number(form.expectedLaunchDate) / 1_000_000).toISOString().split('T')[0]}
            onChange={e => setForm(f => ({ ...f, expectedLaunchDate: BigInt(new Date(e.target.value).getTime()) * 1_000_000n }))}
            className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
          />
        </div>

        {/* Top Speed */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Top Speed (km/h)</label>
          <input
            type="number"
            value={form.topSpeed.toString()}
            onChange={e => setForm(f => ({ ...f, topSpeed: BigInt(e.target.value || '0') }))}
            className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
            min="0"
          />
        </div>

        {/* Range / Mileage */}
        {isEV ? (
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Range (km)</label>
            <input
              type="number"
              value={form.range.toString()}
              onChange={e => setForm(f => ({ ...f, range: BigInt(e.target.value || '0') }))}
              className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
              min="0"
            />
          </div>
        ) : (
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Mileage (kmpl)</label>
            <input
              type="number"
              value={form.mileage.toString()}
              onChange={e => setForm(f => ({ ...f, mileage: BigInt(e.target.value || '0') }))}
              className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
              min="0"
            />
          </div>
        )}
      </div>

      {/* Engine/Battery Specs */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Engine / Battery Specs</label>
        <input
          type="text"
          value={form.engineOrBatterySpecs}
          onChange={e => setForm(f => ({ ...f, engineOrBatterySpecs: e.target.value }))}
          className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
          placeholder="e.g. 40.5 kWh battery, 130 kW motor"
        />
      </div>

      {/* Array fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ArrayInput label="Interior Features" values={form.interiorFeatures} onChange={v => setForm(f => ({ ...f, interiorFeatures: v }))} />
        <ArrayInput label="Exterior Features" values={form.exteriorFeatures} onChange={v => setForm(f => ({ ...f, exteriorFeatures: v }))} />
        <ArrayInput label="Safety Features" values={form.safetyFeatures} onChange={v => setForm(f => ({ ...f, safetyFeatures: v }))} />
        <ArrayInput label="Pros" values={form.pros} onChange={v => setForm(f => ({ ...f, pros: v }))} />
        <ArrayInput label="Cons" values={form.cons} onChange={v => setForm(f => ({ ...f, cons: v }))} />
      </div>

      {/* Expert Review */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Expert Review</label>
        <textarea
          value={form.expertReview}
          onChange={e => setForm(f => ({ ...f, expertReview: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red resize-none"
          placeholder="Write an expert review…"
        />
      </div>

      {/* Images */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Images</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-auto-red transition-colors"
        >
          <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Click to upload images</p>
          {uploading && <p className="text-xs text-auto-red mt-1">Uploading… {uploadProgress}%</p>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
        {form.images.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">{form.images.length} image(s) selected</p>
        )}
      </div>

      {/* Flags */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isTrending}
            onChange={e => setForm(f => ({ ...f, isTrending: e.target.checked }))}
            className="accent-auto-red w-4 h-4"
          />
          <span className="text-sm font-semibold">Trending</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
            className="accent-auto-red w-4 h-4"
          />
          <span className="text-sm font-semibold">Featured (Hero)</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading} className="btn-auto-primary flex items-center gap-2 disabled:opacity-60">
          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Car'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-border rounded font-heading font-semibold uppercase tracking-wider text-sm hover:border-auto-red transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}
