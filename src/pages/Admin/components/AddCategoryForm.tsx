import React, { useState, useEffect } from 'react';
import { Plus, X, AlertCircle, CheckCircle, Loader2, Edit } from 'lucide-react';
import { createCategory, updateCategory, type CategoryData } from '../../../api/category';
import { AxiosError } from 'axios';

interface AddCategoryFormProps {
    onClose: () => void;
    onSubmit: (category: CategoryData, isEdit: boolean) => void;
    initialData?: CategoryData
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onClose, onSubmit, initialData }) => {
    const [categoryName, setCategoryName] = useState(initialData?.name || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Efecto para precargar datos si estamos en modo edición
    useEffect(() => {
        if (initialData) {
            setCategoryName(initialData.name);
        } else {
            setCategoryName('');
        }
        setError(null);
        setSuccessMessage(null);
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!categoryName.trim()) {
            setError('El nombre de la categoría es obligatorio.');
            return;
        }

        setLoading(true);
        try {
            let resultCategory: CategoryData;
            const isEditMode = !!initialData;

            if (isEditMode && initialData?.id) {
                // Modo edición
                resultCategory = await updateCategory(initialData.id, { name: categoryName.trim() });
                setSuccessMessage(`Categoría "${resultCategory.name}" actualizada exitosamente.`);
            } else {
                // Modo creación
                resultCategory = await createCategory({ name: categoryName.trim() });
                setSuccessMessage(`Categoría "${resultCategory.name}" creada exitosamente.`);
                setCategoryName('');
            }

            onSubmit(resultCategory, isEditMode);
        } catch (e: unknown) {
            console.error('Error al guardar categoría:', e);
            if (e instanceof AxiosError && e.response && e.response.data && e.response.data.message) {
                setError(e.response.data.message);
            } else if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('Error desconocido al guardar la categoría. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formTitle = initialData ? 'Editar Categoría' : 'Agregar Nueva Categoría';
    const submitButtonText = initialData ? 'Guardar Cambios' : 'Crear Categoría';
    const submitButtonIcon = initialData ? <Edit size={16} /> : <Plus size={16} />;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">{formTitle}</h3>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Cerrar formulario"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Categoría *
                    </label>
                    <input
                        type="text"
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Ej. Conciertos, Deportes, Teatro"
                        className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                        <AlertCircle size={16} className="text-red-600 mr-2" />
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
                        <CheckCircle size={16} className="text-green-600 mr-2" />
                        <p className="text-green-600 text-sm">{successMessage}</p>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:bg-red-400"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                {submitButtonIcon}
                                {submitButtonText}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCategoryForm;
