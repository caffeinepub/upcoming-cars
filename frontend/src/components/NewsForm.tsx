import React, { useState, useRef } from 'react';
import { Upload, Loader2, X, Plus } from 'lucide-react';
import { NewsArticle, ExternalBlob } from '../backend';

const CATEGORIES = [
  'EV Market Trends',
  'Petrol vs EV',
  'Government Policies',
  'Launch Announcements',
  'General News',
];

interface NewsFormData {
  title: string;
  category: string;
  content: string;
  image: ExternalBlob | null;
  tags: string[];
}

interface NewsFormProps {
  initialData?: NewsArticle;
  onSubmit: (data: NewsFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function NewsForm({ initialData, onSubmit, onCancel, isLoading }: NewsFormProps) {
  const [form, setForm] = useState<NewsFormData>({
    title: initialData?.title || '',
    category: initialData?.category || CATEGORIES[0],
    content: initialData?.content || '',
    image: initialData?.image || null,
    tags: initialData?.tags || [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.content.trim()) e.content = 'Content is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => setUploadProgress(pct));
    setForm(f => ({ ...f, image: blob }));
    setUploading(false);
    setUploadProgress(0);
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
          placeholder="Article title…"
        />
        {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Category</label>
        <select
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Content */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Content *</label>
        <textarea
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          rows={6}
          className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red resize-none"
          placeholder="Write the article content…"
        />
        {errors.content && <p className="text-xs text-destructive mt-1">{errors.content}</p>}
      </div>

      {/* Image */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Cover Image</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-5 text-center cursor-pointer hover:border-auto-red transition-colors"
        >
          <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
          <p className="text-sm text-muted-foreground">
            {form.image ? 'Image selected ✓' : 'Click to upload cover image'}
          </p>
          {uploading && <p className="text-xs text-auto-red mt-1">Uploading… {uploadProgress}%</p>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      {/* Tags */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add tag…"
            className="flex-1 px-3 py-1.5 bg-secondary border border-border rounded text-sm focus:outline-none focus:border-auto-red"
          />
          <button type="button" onClick={addTag} className="px-3 py-1.5 bg-auto-red text-white rounded text-sm hover:opacity-90">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.tags.map((tag, i) => (
            <span key={i} className="flex items-center gap-1 bg-secondary text-xs px-2 py-1 rounded-full">
              {tag}
              <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter((_, j) => j !== i) }))}>
                <X className="w-3 h-3 hover:text-auto-red" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading} className="btn-auto-primary flex items-center gap-2 disabled:opacity-60">
          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Article'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-border rounded font-heading font-semibold uppercase tracking-wider text-sm hover:border-auto-red transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}
