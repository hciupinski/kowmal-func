import React, {useState} from 'react';
import styles from './AdminUpload.module.scss';
import apiClient from "../../api/apiClient";

interface ProductData {
    name: string;
    description: string;
    images: FileList | null;
}

const AdminUpload: React.FC = () => {
    const [productData, setProductData] = useState<ProductData>({name: '', description: '', images: null});
    const [status, setStatus] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setProductData({...productData, [name]: value});
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProductData({...productData, images: e.target.files});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productData.images) {
            setStatus('Please select images to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        Array.from(productData.images).forEach((file, index) => {
            formData.append(`image${index}`, file);
        });

        apiClient.post('/UploadProduct', formData, {
            headers: {'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${localStorage.getItem('token')}`},
        })
            .then(response => {
                if (response.status === 200) {
                    setStatus('Product uploaded successfully!');
                    setProductData({name: '', description: '', images: null});
                } else {
                    setStatus('Failed to upload product.');
                }
            })
            .catch(() => setStatus('Failed to upload product.'));
    };

    return (
            <div className={`${styles.adminUpload} p-6 bg-gray-800 text-white`}>
                <h2 className="text-3xl mb-4">Upload New Product</h2>
                {status && <p className="status text-yellow-500 mb-4">{status}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        Product Name:
                        <input
                            type="text"
                            name="name"
                            value={productData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 text-white"
                        />
                    </label>

                    <label className="block">
                        Description:
                        <textarea
                            name="description"
                            value={productData.description}
                            onChange={handleInputChange}
                            required
                            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 text-white"
                            rows={5}
                        />
                    </label>

                    <label className="block">
                        Images:
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept="image/*"
                            required
                            className="mt-1 text-white"
                        />
                    </label>

                    <button type="submit" className="px-4 py-2 bg-yellow-500 text-black font-bold hover:bg-yellow-600">
                        Upload Product
                    </button>
                </form>
            </div>
    );
};

export default AdminUpload;