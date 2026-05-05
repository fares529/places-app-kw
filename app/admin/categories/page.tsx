'use client';

import { useEffect, useState } from 'react';
import { Pencil, X, Check, RotateCcw } from 'lucide-react';
import { Category, Place, CategoryId } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { getPlaces } from '@/lib/store/placesStore';
import {
  getCategories,
  updateCategory,
  resetCategoryOverrides,
  colorPresets,
  iconPresets,
} from '@/lib/store/categoriesStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import clsx from 'clsx';

interface CategoryRowProps {
  category: Category;
  count: number;
  onEdit: () => void;
}

function CategoryRow({ category, count, onEdit }: CategoryRowProps) {
  const { locale } = useTranslation();
  return (
    <div className="bg-white rounded-2xl card-shadow p-3 flex items-center gap-3">
      <div
        className={`w-12 h-12 rounded-2xl ${category.bgColor} flex items-center justify-center shrink-0`}
      >
        <Icon name={category.icon} className={`w-6 h-6 ${category.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-sm truncate">
          {locale === 'ar' ? category.nameAr : category.nameEn}
        </h3>
        <p className="text-[11px] text-gray-500 mt-0.5">
          {count} {locale === 'ar' ? 'مكان' : 'places'}
        </p>
      </div>
      <button
        onClick={onEdit}
        className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 flex items-center justify-center shrink-0"
        aria-label="Edit"
      >
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  );
}

interface EditModalProps {
  category: Category;
  onClose: () => void;
  onSave: () => void;
}

function EditModal({ category, onClose, onSave }: EditModalProps) {
  const { locale } = useTranslation();
  const [nameAr, setNameAr] = useState(category.nameAr);
  const [nameEn, setNameEn] = useState(category.nameEn);
  const [icon, setIcon] = useState(category.icon);
  const [color, setColor] = useState({ color: category.color, bgColor: category.bgColor });

  const handleSave = async () => {
    await updateCategory(category.id, { nameAr, nameEn, icon, color: color.color, bgColor: color.bgColor });
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-stretch justify-center sm:items-center sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl flex flex-col max-h-screen sm:max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-base font-bold">{locale === 'ar' ? 'تعديل الفئة' : 'Edit Category'}</h2>
          </div>
          <Button size="sm" onClick={handleSave}>
            <Check className="w-4 h-4" />
            {locale === 'ar' ? 'حفظ' : 'Save'}
          </Button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl ${color.bgColor} flex items-center justify-center`}>
              <Icon name={icon} className={`w-7 h-7 ${color.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">{locale === 'ar' ? 'معاينة' : 'Preview'}</p>
              <p className="font-bold text-gray-900 truncate">
                {locale === 'ar' ? nameAr : nameEn}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              label={locale === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
            />
            <Input
              label={locale === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'}
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'ar' ? 'الأيقونة' : 'Icon'}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {iconPresets.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={clsx(
                    'aspect-square rounded-xl flex items-center justify-center transition-all',
                    icon === ic
                      ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon name={ic} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'ar' ? 'اللون' : 'Color'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colorPresets.map((c) => {
                const active = color.color === c.color;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor({ color: c.color, bgColor: c.bgColor })}
                    className={clsx(
                      'aspect-square rounded-xl flex items-center justify-center transition-all',
                      c.bgColor,
                      active ? 'ring-2 ring-offset-2 ring-gray-800' : ''
                    )}
                  >
                    <div className={clsx('w-5 h-5 rounded-full border-2 border-current', c.color)} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const { t, locale } = useTranslation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);

  const refresh = async () => {
    const [p, c] = await Promise.all([getPlaces(), getCategories()]);
    setPlaces(p);
    setCategories(c);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleResetAll = async () => {
    if (confirm(locale === 'ar' ? 'إعادة تعيين الفئات للافتراضي؟' : 'Reset categories to defaults?')) {
      await resetCategoryOverrides();
      await refresh();
    }
  };

  return (
    <AdminLayout>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {t('admin.manageCategories')}
          </h1>
          <p className="text-xs text-gray-500">
            {locale === 'ar'
              ? 'اضغط على فئة لتعديل اسمها أو لونها أو أيقونتها'
              : 'Tap a category to edit name, color or icon'}
          </p>
        </div>
        <button
          onClick={handleResetAll}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {categories.map((cat) => {
          const count = places.filter((p) => p.categoryId === cat.id).length;
          return (
            <CategoryRow
              key={cat.id}
              category={cat}
              count={count}
              onEdit={() => setEditing(cat)}
            />
          );
        })}
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-3 text-xs text-blue-800 leading-relaxed">
        💡{' '}
        {locale === 'ar'
          ? 'الفئات الخمس ثابتة لكن يمكنك تغيير الاسم/اللون/الأيقونة. التغييرات تُحفظ محلياً.'
          : 'The 5 categories are fixed but you can edit name/color/icon. Changes are saved locally.'}
      </div>

      {editing && (
        <EditModal
          category={editing}
          onClose={() => setEditing(null)}
          onSave={refresh}
        />
      )}
    </AdminLayout>
  );
}
