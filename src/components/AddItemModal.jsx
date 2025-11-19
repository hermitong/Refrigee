import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictItemDetails } from '../utils/aiMock';
import { format } from 'date-fns';

export default function AddItemModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState('pcs');
    const [category, setCategory] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [emoji, setEmoji] = useState('📦');

    // "AI" Auto-complete effect
    useEffect(() => {
        if (name.length > 2) {
            const prediction = predictItemDetails(name);
            setCategory(prediction.category);
            setEmoji(prediction.emoji);
            // Only set date if not already manually set (simple heuristic)
            if (!expirationDate) {
                setExpirationDate(format(prediction.defaultExpiration, 'yyyy-MM-dd'));
            }
        }
    }, [name]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            name,
            quantity: Number(quantity),
            unit,
            category,
            expirationDate,
            emoji
        });
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setName('');
        setQuantity('1');
        setUnit('pcs');
        setCategory('');
        setExpirationDate('');
        setEmoji('📦');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-w-md mx-auto shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                Add Item <span className="text-2xl">{emoji}</span>
                            </h2>
                            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Milk, Apple..."
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        autoFocus
                                        required
                                    />
                                    {name.length > 2 && (
                                        <Sparkles className="absolute right-3 top-3 text-emerald-500 animate-pulse" size={20} />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <div className="flex">
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                            required
                                            min="0.1"
                                            step="0.1"
                                        />
                                        <select
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                            className="bg-gray-100 border-y border-r border-gray-200 rounded-r-xl px-2 text-sm text-gray-600 outline-none"
                                        >
                                            <option value="pcs">pcs</option>
                                            <option value="kg">kg</option>
                                            <option value="g">g</option>
                                            <option value="L">L</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Fruit">Fruit</option>
                                        <option value="Vegetable">Vegetable</option>
                                        <option value="Dairy">Dairy</option>
                                        <option value="Meat">Meat</option>
                                        <option value="Bakery">Bakery</option>
                                        <option value="Pantry">Pantry</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                                <input
                                    type="date"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 active:scale-95 transition-all mt-4"
                            >
                                Add to Fridge
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
