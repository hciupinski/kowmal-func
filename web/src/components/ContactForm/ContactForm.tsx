import React, { useState } from 'react';
import styles from './ContactForm.module.scss';
import apiClient from "../../api/apiClient";

interface FormData {
    name: string;
    email: string;
    message: string;
}

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        apiClient.post('/SendEmail', formData)
            .then(response => {
                if (response.status === 200) {
                    setStatus('Message sent successfully!');
                    setFormData({ name: '', email: '', message: '' });
                } else {
                    setStatus('Failed to send message.');
                }
            })
            .catch(() => setStatus('Failed to send message.'));
    };

    return (
        <div className={`${styles.contactForm} mt-16 mx-2 md:mx-auto p-6 text-white bg-amber-900 bg-opacity-60 rounded-2xl max-w-[1000px]`}>
            <h2 className="text-3xl mb-4">Contact the Master</h2>
            {status && <p className="status text-yellow-500 mb-4">{status}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className={'w-100 md:w-96'}>
                    <label className="block">
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 text-white"
                            placeholder={'How should I address You?'}
                        />
                    </label>
    
                    <label className="block">
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 text-white"
                            placeholder={'Your email'}
                        />
                    </label>
                </div>
                <label className="block">
                    Message:
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 text-white"
                        rows={5}
                        maxLength={1200}
                        placeholder={'Please provide some details of what You are looking for...'}
                    />
                </label>

                <button type="submit" className="px-4 py-2 bg-amber-500 text-black font-bold hover:bg-amber-400 rounded">
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default ContactForm;