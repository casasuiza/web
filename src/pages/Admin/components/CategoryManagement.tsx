import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Tag } from 'lucide-react';
import { getCategories, deleteCategory, type CategoryData } from '../../../api/category';
import AddCategoryForm from './AddCategoryForm';

interface CategoryManagementProps {
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const CategoryManagement: React.FC<CategoryManagementProps> = () => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [uiMessage, setUiMessage] = useState<string | null>(null);
    const [uiMessageType, setUiMessageType] = useState<'success' | 'error' | ''>('');

    const showUiMessage = useCallback((message: string, type: 'success' | 'error') => {
        setUiMessage(message);
        setUiMessageType(type);
        setTimeout(() => {
            setUiMessage(null);
            setUiMessageType('');
        }, 5000);
    }, []);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Error desconocido al cargar categorías.';
            setError(errorMessage);
            showUiMessage(`Error al cargar categorías: ${errorMessage}`, 'error');

            // Fallback a categorías dummy si la API falla
            setCategories([
                { id: 'dummy-cat-1', name: 'Música' },
                { id: 'dummy-cat-2', name: 'Deportes' },
                { id: 'dummy-cat-3', name: 'Teatro' },
            ]);
        } finally {
            setLoading(false);
        }
    }, [showUiMessage]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro que deseas eliminar esta categoría? Esta acción es irreversible.')) return;

        setLoading(true);
        try {
            await deleteCategory(id);
            setCategories(prev => prev.filter(cat => cat.id !== id));
            showUiMessage('Categoría eliminada exitosamente.', 'success');
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Error desconocido al eliminar la categoría.';
            showUiMessage(`Error al eliminar categoría: ${errorMessage}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category: CategoryData) => {
        setEditingCategory(category);
        setShowForm(true); 
    };

    const handleFormSubmit = (updatedCategory: CategoryData, isEdit: boolean) => {
        if (isEdit) { 
            setCategories(prev => prev.map(cat =>
                cat.id === updatedCategory.id ? updatedCategory : cat
            ));
            showUiMessage('Categoría actualizada exitosamente.', 'success');
        } else { 
            setCategories(prev => [...prev, updatedCategory]);
            showUiMessage('Categoría creada exitosamente.', 'success');
        }
        setEditingCategory(null); 
        setShowForm(false); 
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Categorías</h2>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    onClick={() => {
                        setEditingCategory(null); 
                        setShowForm(true); 
                    }}
                >
                    <Plus className="w-4 h-4" />
                    Nueva Categoría
                </button>
            </div>

            {uiMessage && (
                <div className={`p-3 rounded-lg text-white ${uiMessageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {uiMessage}
                </div>
            )}

            {showForm && (
                <AddCategoryForm
                    initialData={editingCategory || undefined} 
                    onClose={() => {
                        setShowForm(false);
                        setEditingCategory(null); 
                    }}
                    onSubmit={handleFormSubmit}
                />
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar categorías..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {loading && <p className="text-center text-gray-600">Cargando categorías...</p>}
                {error && <p className="text-center text-red-600">{error}</p>}

                {!loading && (
                    <div className="space-y-3">
                        {filteredCategories.length === 0 ? (
                            <p className="text-center text-gray-600">No hay categorías para mostrar.</p>
                        ) : (
                            filteredCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex-1 flex items-center">
                                        <Tag className="w-5 h-5 mr-3 text-gray-600" />
                                        <h3 className="font-semibold text-gray-800">{category.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                            onClick={() => handleEdit(category)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManagement;
