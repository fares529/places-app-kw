'use client';

import { useState } from 'react';
import { X, Plus, Wand2, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { CategoryId } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { Button } from '@/components/ui/Button';

interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  categoryId: CategoryId;
  placeName: string;
}

const categoryColor: Record<CategoryId, string> = {
  tourist: '7c3aed',
  restaurants: 'dc2626',
  cafes: 'b45309',
  services: '2563eb',
  malls: '059669',
};

export function ImageManager({ images, onChange, categoryId, placeName }: ImageManagerProps) {
  const { locale } = useTranslation();
  const [newUrl, setNewUrl] = useState('');

  const addImage = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setNewUrl('');
  };

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    const next = [...images];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const generatePlaceholder = () => {
    const color = categoryColor[categoryId];
    const name = placeName.trim() || (locale === 'ar' ? 'مكان جديد' : 'New Place');
    const slug = encodeURIComponent(name);
    const variants = [
      `https://placehold.co/800x600/${color}/ffffff.png?text=${slug}&font=montserrat`,
      `https://placehold.co/800x600/0f172a/${color}.png?text=${slug}&font=montserrat`,
      `https://placehold.co/800x600/f1f5f9/${color}.png?text=${slug}&font=montserrat`,
      `https://placehold.co/800x600/${color}/fef3c7.png?text=${slug}&font=montserrat`,
    ];
    onChange([...images, variants[images.length % variants.length]]);
  };

  const replaceAllAuto = () => {
    const color = categoryColor[categoryId];
    const name = placeName.trim() || (locale === 'ar' ? 'مكان جديد' : 'New Place');
    const slug = encodeURIComponent(name);
    onChange([
      `https://placehold.co/800x600/${color}/ffffff.png?text=${slug}&font=montserrat`,
      `https://placehold.co/800x600/0f172a/${color}.png?text=${slug}&font=montserrat`,
    ]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {locale === 'ar' ? 'صور المكان' : 'Place Images'}
          <span className="text-xs text-gray-400 mr-1">({images.length})</span>
        </label>
        <button
          type="button"
          onClick={replaceAllAuto}
          className="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded-lg"
        >
          <Wand2 className="w-3 h-3" />
          {locale === 'ar' ? 'توليد تلقائي' : 'Auto generate'}
        </button>
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
          <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500">
            {locale === 'ar' ? 'لا توجد صور حالياً' : 'No images yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                <img
                  src={src}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 0 && (
                  <span className="absolute top-0 start-0 bg-primary-600 text-white text-[9px] font-bold px-1 rounded-br-md">
                    {locale === 'ar' ? 'رئيسية' : 'Main'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 truncate" dir="ltr">
                  {src.replace(/^https?:\/\//, '')}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() => moveImage(idx, -1)}
                    disabled={idx === 0}
                    className="w-6 h-6 rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 1)}
                    disabled={idx === images.length - 1}
                    className="w-6 h-6 rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center shrink-0"
                aria-label="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addImage(newUrl);
            }
          }}
          placeholder={locale === 'ar' ? 'الصق رابط صورة...' : 'Paste image URL...'}
          dir="ltr"
          className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => addImage(newUrl)}
          disabled={!newUrl.trim()}
        >
          <Plus className="w-3.5 h-3.5" />
          {locale === 'ar' ? 'إضافة' : 'Add'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={generatePlaceholder}
        >
          <Wand2 className="w-3.5 h-3.5" />
          {locale === 'ar' ? 'توليد' : 'Gen'}
        </Button>
      </div>

      <p className="text-[11px] text-gray-400 mt-2">
        {locale === 'ar'
          ? 'الصورة الأولى هي الرئيسية. استخدم الأسهم لتغيير الترتيب.'
          : 'First image is the main one. Use arrows to reorder.'}
      </p>
    </div>
  );
}
