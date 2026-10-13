import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Users,
  X,
  ShieldCheck,
  Save,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { CategoryIcon } from '../../../components/common/CategoryIcon';
import { ServiceCategory } from '../../../types';

const COMMON_ICON_SUGGESTIONS = [
  'Package',
  'Sparkles',
  'Truck',
  'Bike',
  'HardHat',
  'Hammer',
  'Wrench',
  'Paintbrush',
  'Scissors',
  'Boxes',
  'Trees',
  'Users',
  'Zap',
  'Car',
  'Droplets',
  '📦',
  '⚡',
  '🧹',
  '🔨',
  '🚚',
];

export const ServiceCategoriesView: React.FC = () => {
  const {
    categories,
    toggleCategoryStatus,
    addCategory,
    deleteCategory,
    updateCategory,
    updateCategoryMinPrice,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Full edit modal state for custom category, icon & pricing
  const [categoryToEdit, setCategoryToEdit] = useState<ServiceCategory | null>(null);
  const [editModalName, setEditModalName] = useState('');
  const [editModalIcon, setEditModalIcon] = useState('Package');
  const [editModalDescription, setEditModalDescription] = useState('');
  const [editModalFloorPrice, setEditModalFloorPrice] = useState<number>(400);
  const [editModalHourlyRate, setEditModalHourlyRate] = useState<number>(250);
  const [editModalActive, setEditModalActive] = useState<boolean>(true);

  // Inline edit state for custom pricing
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editMinPrice, setEditMinPrice] = useState<number>(400);
  const [editBaseRate, setEditBaseRate] = useState<number>(250);

  // Delete confirmation modal state
  const [categoryToDelete, setCategoryToDelete] = useState<ServiceCategory | null>(null);

  // Form state for new category
  const [name, setName] = useState('');
  const [customIcon, setCustomIcon] = useState('Package');
  const [description, setDescription] = useState('');
  const [baseRatePerHour, setBaseRatePerHour] = useState<number>(250);
  const [minPricePerHead, setMinPricePerHead] = useState<number>(500);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCategory({
      name: name.trim(),
      icon: (customIcon.trim() || 'Package'),
      description: description.trim(),
      baseRatePerHour: Number(baseRatePerHour) || 200,
      minPricePerHead: Number(minPricePerHead) || 400,
      active: true,
    });

    setName('');
    setDescription('');
    setCustomIcon('Package');
    setBaseRatePerHour(250);
    setMinPricePerHead(500);
    setIsModalOpen(false);
  };

  const handleOpenEditModal = (category: ServiceCategory) => {
    setCategoryToEdit(category);
    setEditModalName(category.name);
    setEditModalIcon(category.icon || 'Package');
    setEditModalDescription(category.description || '');
    setEditModalFloorPrice(category.minPricePerHead || 400);
    setEditModalHourlyRate(category.baseRatePerHour || 250);
    setEditModalActive(category.active);
  };

  const handleSaveEditModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryToEdit || !editModalName.trim()) return;

    await updateCategory(categoryToEdit.id, {
      name: editModalName.trim(),
      icon: editModalIcon.trim() || 'Package',
      description: editModalDescription.trim(),
      minPricePerHead: Number(editModalFloorPrice) || 400,
      baseRatePerHour: Number(editModalHourlyRate) || 250,
      active: editModalActive,
    });

    setCategoryToEdit(null);
  };

  const handleStartEdit = (category: ServiceCategory) => {
    setEditingCategoryId(category.id);
    setEditMinPrice(category.minPricePerHead || 400);
    setEditBaseRate(category.baseRatePerHour || 250);
  };

  const handleSaveEdit = (categoryId: string) => {
    updateCategoryMinPrice(categoryId, Number(editMinPrice), Number(editBaseRate));
    setEditingCategoryId(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    await deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Service Categories & Custom Pricing
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage trade categories, custom client icons, floor pricing & hourly base rates with full create and delete control
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Category</span>
        </button>
      </div>

      {/* Info Card on Admin Min Price Control */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="text-xs text-yellow-950 leading-relaxed">
          <strong>Custom Pricing & Protected Floor Rates:</strong> Clients and administrators can freely define custom base rates and minimum booking floors per head. Customers cannot post jobs below these minimums, ensuring fair workforce payouts.
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-800">{categories.length} Total</span>
          <span>•</span>
          <span className="text-red-600 font-semibold">{categories.filter((c) => c.active).length} Active</span>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Category & Icon</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Admin Min Price (Floor)</th>
                <th className="py-3.5 px-6">Hourly Base Rate</th>
                <th className="py-3.5 px-6">Workers</th>
                <th className="py-3.5 px-6 text-center">Active Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No categories found. Click "Add Custom Category" to create one.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => {
                  const isEditing = editingCategoryId === category.id;

                  return (
                    <tr key={category.id} className="hover:bg-slate-50/70 transition">
                      {/* Name & Custom Icon */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-yellow-50 text-red-600 flex items-center justify-center border border-emerald-100 shrink-0">
                            <CategoryIcon name={category.icon} className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{category.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Icon: {category.icon || 'Default'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 max-w-xs text-slate-500 truncate" title={category.description}>
                        {category.description || 'No description provided'}
                      </td>

                      {/* Admin Floor Price with Custom Inline Edit */}
                      <td className="py-4 px-6">
                        {isEditing ? (
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-slate-500">₹</span>
                            <input
                              type="number"
                              min={0}
                              step={25}
                              value={editMinPrice}
                              onChange={(e) => setEditMinPrice(Number(e.target.value))}
                              className="w-20 px-2 py-1 text-xs font-bold rounded-lg border border-red-400 bg-red-50 focus:outline-none"
                              placeholder="Floor"
                              title="Custom Minimum Price per Head"
                            />
                            <span className="text-[10px] text-slate-400">/head</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-extrabold text-red-600 bg-yellow-50 px-2.5 py-1 rounded-lg border border-red-200 text-xs">
                              ₹{category.minPricePerHead || 400} / head
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Hourly Base Rate with Custom Inline Edit */}
                      <td className="py-4 px-6 font-semibold text-slate-900 font-mono">
                        {isEditing ? (
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-slate-500">₹</span>
                            <input
                              type="number"
                              min={0}
                              step={25}
                              value={editBaseRate}
                              onChange={(e) => setEditBaseRate(Number(e.target.value))}
                              className="w-20 px-2 py-1 text-xs font-bold rounded-lg border border-red-400 bg-red-50 focus:outline-none"
                              placeholder="Hourly"
                              title="Custom Hourly Base Rate"
                            />
                            <span className="text-[10px] text-slate-400">/hr</span>
                          </div>
                        ) : (
                          <span>₹{category.baseRatePerHour}/hr</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1.5 font-medium text-slate-700">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>{category.totalWorkers} Workers</span>
                        </div>
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => toggleCategoryStatus(category.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                            category.active ? 'bg-red-600' : 'bg-slate-300'
                          }`}
                          title={category.active ? 'Active (Click to disable)' : 'Disabled (Click to activate)'}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              category.active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions: Edit Custom Price & Delete Option */}
                      <td className="py-4 px-6 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleSaveEdit(category.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-yellow-500 font-bold text-xs flex items-center gap-1 shadow-xs transition"
                              title="Save Custom Pricing"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditingCategoryId(null)}
                              className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenEditModal(category)}
                              className="text-red-600 hover:text-red-700 hover:bg-yellow-50 px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-red-200/60"
                              title="Edit Category, Custom Icon & Pricing"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            {/* Option to Delete Category */}
                            <button
                              onClick={() => setCategoryToDelete(category)}
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition border border-rose-200/60"
                              title={`Delete ${category.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Delete Service Category?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete{' '}
                <strong className="text-slate-800 font-semibold">{categoryToDelete.name}</strong>?
                This will remove it from customer booking options and worker trades.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {categoryToEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Edit Service Category & Custom Pricing</h3>
                <p className="text-xs text-slate-500 mt-0.5">Customize client icon, trade name, floor rate & base pricing</p>
              </div>
              <button
                onClick={() => setCategoryToEdit(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditModal} className="p-6 space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical & Wiring Assistance, Plumbing, Painting..."
                  value={editModalName}
                  onChange={(e) => setEditModalName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Custom Icon Category Input by Client */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Icon Category (Custom Entry by Client) *
                </label>
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      required
                      placeholder="Type custom icon name or emoji (e.g. Hammer, Wrench, Zap, ⚡, 📦)..."
                      value={editModalIcon}
                      onChange={(e) => setEditModalIcon(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>
                  {/* Live Icon Preview Box */}
                  <div className="w-11 h-11 rounded-xl bg-yellow-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-xs" title="Live Icon Preview">
                    <CategoryIcon name={editModalIcon || 'Package'} className="w-6 h-6" />
                  </div>
                </div>

                {/* Quick Icon Suggestion Pills */}
                <div className="mt-2">
                  <span className="text-[10px] text-slate-400 block mb-1">Quick Suggestions (Click to apply or type custom above):</span>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {COMMON_ICON_SUGGESTIONS.map((sug) => (
                      <button
                        type="button"
                        key={sug}
                        onClick={() => setEditModalIcon(sug)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition flex items-center gap-1 ${
                          editModalIcon === sug
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <CategoryIcon name={sug} className="w-3 h-3" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Pricing Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Admin Min Price (Floor ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={25}
                    value={editModalFloorPrice}
                    onChange={(e) => setEditModalFloorPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-red-500"
                  />
                  <span className="text-[10px] text-slate-400">Custom floor price per head</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Hourly Base Rate (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={25}
                    value={editModalHourlyRate}
                    onChange={(e) => setEditModalHourlyRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-red-500"
                  />
                  <span className="text-[10px] text-slate-400">Custom hourly standard</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Responsibilities, tools required, and work scope..."
                  value={editModalDescription}
                  onChange={(e) => setEditModalDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Active Status Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="editModalActive"
                  checked={editModalActive}
                  onChange={(e) => setEditModalActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="editModalActive" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Category is Active on Platform
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryToEdit(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Create Custom Service Category</h3>
                <p className="text-xs text-slate-500 mt-0.5">Define category name, custom icon, floor rate & base pricing</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical & Wiring Assistance, Plumbing, Painting..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Custom Icon Category Input by Client */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Icon Category (Custom Entry by Client) *
                </label>
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      required
                      placeholder="Type custom icon name or emoji (e.g. Hammer, Wrench, Zap, ⚡, 📦)..."
                      value={customIcon}
                      onChange={(e) => setCustomIcon(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>
                  {/* Live Icon Preview Box */}
                  <div className="w-11 h-11 rounded-xl bg-yellow-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-xs" title="Live Icon Preview">
                    <CategoryIcon name={customIcon || 'Package'} className="w-6 h-6" />
                  </div>
                </div>

                {/* Quick Icon Suggestion Pills */}
                <div className="mt-2">
                  <span className="text-[10px] text-slate-400 block mb-1">Quick Suggestions (Click to apply or type custom above):</span>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {COMMON_ICON_SUGGESTIONS.map((sug) => (
                      <button
                        type="button"
                        key={sug}
                        onClick={() => setCustomIcon(sug)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition flex items-center gap-1 ${
                          customIcon === sug
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <CategoryIcon name={sug} className="w-3 h-3" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Pricing Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Admin Min Price (Floor ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={25}
                    value={minPricePerHead}
                    onChange={(e) => setMinPricePerHead(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-red-500"
                  />
                  <span className="text-[10px] text-slate-400">Custom floor price per head</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Hourly Base Rate (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={25}
                    value={baseRatePerHour}
                    onChange={(e) => setBaseRatePerHour(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-red-500"
                  />
                  <span className="text-[10px] text-slate-400">Custom hourly standard</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Responsibilities, tools required, and work scope..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition"
                >
                  Save & Publish Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
