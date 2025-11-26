import { useState, useRef } from 'react';
import { Camera, X, Check, RotateCcw, Loader2 } from 'lucide-react';
import * as aiServiceManager from '../services/aiServiceManager';

export default function CameraCapture({ onCapture, onCancel }) {
    const [capturedImage, setCapturedImage] = useState(null);
    const [identifying, setIdentifying] = useState(false);
    const fileInputRef = useRef(null);

    // 将文件转换为Base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // 压缩图片
    const compressImage = (base64, maxWidth = 800) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // 按比例缩放
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
        });
    };

    // 处理拍照
    const handleCapture = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // 转换为Base64
            const base64 = await fileToBase64(file);
            // 压缩图片
            const compressed = await compressImage(base64);
            setCapturedImage(compressed);
        } catch (error) {
            console.error('图片处理失败:', error);
            alert('图片处理失败,请重试');
        }
    };

    // 确认并识别
    const handleConfirm = async () => {
        if (!capturedImage) return;

        setIdentifying(true);
        try {
            const result = await aiServiceManager.identifyImage(capturedImage);
            onCapture(result);
        } catch (error) {
            console.error('AI识别失败:', error);
            alert('AI识别失败,请重试或手动输入');
            onCapture({ name: '', category: 'Other', emoji: '📦', shelfLifeDays: 7 });
        } finally {
            setIdentifying(false);
        }
    };

    // 重拍
    const handleRetake = () => {
        setCapturedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // 触发拍照
    const triggerCapture = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">拍照识别</h3>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!capturedImage ? (
                        /* 拍照按钮 */
                        <div className="text-center">
                            <div className="mb-6">
                                <div className="w-32 h-32 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                    <Camera size={48} className="text-emerald-500" />
                                </div>
                                <p className="text-gray-600 mb-2">拍摄物品照片</p>
                                <p className="text-sm text-gray-400">AI将自动识别物品信息</p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleCapture}
                                className="hidden"
                            />

                            <button
                                onClick={triggerCapture}
                                className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <Camera size={20} />
                                打开相机
                            </button>

                            <button
                                onClick={onCancel}
                                className="w-full mt-3 bg-gray-100 text-gray-600 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                取消
                            </button>
                        </div>
                    ) : (
                        /* 预览和确认 */
                        <div>
                            <div className="mb-4">
                                <img
                                    src={capturedImage}
                                    alt="拍摄的照片"
                                    className="w-full rounded-2xl"
                                />
                            </div>

                            {identifying ? (
                                <div className="text-center py-4">
                                    <Loader2 size={32} className="animate-spin text-emerald-500 mx-auto mb-2" />
                                    <p className="text-gray-600">AI识别中...</p>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleRetake}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={18} />
                                        重拍
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className="flex-1 bg-emerald-500 text-white py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Check size={18} />
                                        确认识别
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
