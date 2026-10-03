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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';

export const ServiceCategoriesView: React.FC = () => {
  const { categories, toggleCategoryStatus, addCategory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for new category
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Package');
  const [description, setDescription] = useState('');
  const [baseRatePerHour, setBaseRatePerHour] = useState(250);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCategory({
      name,
      icon,
      description,
      baseRatePerHour: Number(baseRatePerHour),
      active: true,
    });

    setName('');
    setDescription('');
    setBaseRatePerHour(250);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header matching Screenshot 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Service Categories Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure temporary manpower roles, standard base rates, and platform service availability
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-800">{categories.length} Total</span>
          <span>•</span>
          <span className="text-emerald-600 font-semibold">{categories.filter((c) => c.active).length} Active</span>
        </div>
      </div>

      {/* Categories Table matching Mockup 2 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Category Name</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Standard Base Rate</th>
                <th className="py-3.5 px-6">Registered Workers</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                        <CategoryIcon name={category.icon} className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-900">{category.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 max-w-xs text-slate-500 truncate" title={category.description}>
                    {category.description}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    ₹{category.baseRatePerHour}/hr
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1.5 font-medium text-slate-700">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>{category.totalWorkers} Workers</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleCategoryStatus(category.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        category.active ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          category.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        title="Edit category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Add New Service Category</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Assistance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Icon Category
                </label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Package">Package (Loading/Unloading)</option>
                  <option value="Sparkles">Sparkles (Cleaning/Sanitation)</option>
                  <option value="Truck">Truck (Packing/Relocation)</option>
                  <option value="Bike">Bike (Delivery Helper)</option>
                  <option value="HardHat">HardHat (Construction)</option>
                  <option value="Users">Users (Events/Hospitality)</option>
                  <option value="Trees">Trees (Gardening)</option>
                  <option value="Boxes">Boxes (Warehouse)</option>
                  <option value="Wrench">Wrench (Plumbing/Maintenance)</option>
                  <option value="Zap">Zap (Electrical)</option>
                  <option value="Paintbrush">Paintbrush (Painting)</option>
                  <option value="Shield">Shield (Security)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Base Hourly Rate (₹/hr)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    min="100"
                    step="20"
                    required
                    value={baseRatePerHour}
                    onChange={(e) => setBaseRatePerHour(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Scope & Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the nature of temporary labor needed in this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
