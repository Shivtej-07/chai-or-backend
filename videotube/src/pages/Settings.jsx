import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Settings() {
    const { user, setUser } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleFileChange = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append(type === 'avatar' ? 'avatar' : 'coverImage', file);

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const endpoint = type === 'avatar' ? '/users/avatar' : '/users/cover-image';
            const response = await api.patch(endpoint, formData);

            // Update local user state
            setUser(response.data.data);
            setMessage({ type: 'success', text: `${type === 'avatar' ? 'Avatar' : 'Cover image'} updated successfully!` });
        } catch (error) {
            console.error('Update failed:', error);
            setMessage({ type: 'error', text: 'Failed to update image. Please try again.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

            <div className="space-y-8">
                {/* Profile Section */}
                <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Profile Images</h2>

                    {message.text && (
                        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Avatar Update */}
                        <div className="flex items-start gap-6">
                            <div className="relative group">
                                <img
                                    src={user?.avatar}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
                                />
                                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-xs text-white">Change</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-300 mb-2">Profile Picture</h3>
                                <p className="text-xs text-gray-500 mb-4">
                                    PNG, JPG or WEBP. Max 2MB.
                                </p>
                                <label className="inline-block">
                                    <span className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${uploading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
                                        }`}>
                                        {uploading ? 'Uploading...' : 'Upload New Picture'}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'avatar')}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="h-px bg-gray-800" />

                        {/* Cover Image Update */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-300">Cover Image</h3>
                            <div className="relative aspect-[3/1] w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                                {user?.coverImage ? (
                                    <img
                                        src={user.coverImage}
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                        No cover image
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <label className="inline-block">
                                    <span className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${uploading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-white'
                                        }`}>
                                        {uploading ? 'Uploading...' : 'Change Cover Image'}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'coverImage')}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Info Placeholder */}
                <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 opacity-50 cursor-not-allowed">
                    <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
                    <p className="text-gray-500 text-sm">Update account details feature coming soon...</p>
                </div>
            </div>
        </div>
    );
}

export default Settings;
