'use client';
import { useState } from 'react';
import { FaArrowLeft, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Help() {
    const router = useRouter();
    const [topic, setTopic] = useState('');
    const [desc, setDesc] = useState('');
    const [success, setSuccess] = useState(false);

    const sendEmail = () => {
        if (!topic || !desc) {
            alert('Please fill in both the topic and description.');
            return;
        }

        const subject = encodeURIComponent(`Help Request: ${topic}`);
        const body = encodeURIComponent(
            `Hello,\n\nI need help with the following:\n\nTopic: ${topic}\n\nDescription:\n${desc}\n\nThank you.`
        );

        // Open user's email app
        const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=customerservicewishwell@gmail.com&su=${subject}&body=${body}`;
        window.open(mailtoLink, '_blank');

        // Show success and clear form
        setSuccess(true);
        setTopic('');
        setDesc('');

        // Hide notification after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="min-h-screen px-4 pt-6 pb-24 bg-gradient-to-b from-white to-gray-100 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 transition"
                >
                    <FaArrowLeft className="text-sky-600" />
                </button>
                <h1 className="text-xl font-bold text-sky-700 tracking-wide">Help Center</h1>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl p-5 space-y-5 border border-gray-100">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Topic</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e: any) => setTopic(e.target.value)}
                        placeholder="e.g. Account issue"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 transition"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Describe your problem</label>
                    <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Write your issue clearly..."
                        rows={5}
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-sky-400 transition"
                    />
                </div>

                <button
                    onClick={sendEmail}
                    className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 active:scale-95"
                >
                    <FaPaperPlane />
                    Send
                </button>
            </div>

            {/* ✅ Success Notification */}
            {success && (
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-full shadow-md flex items-center gap-2 animate-fade-in mt-4">
                    <FaCheckCircle />
                    <span>Message sent successfully!</span>
                </div>
            )}

            {/* Note */}
            <p className="text-xs text-gray-500 text-center mt-6">
                ✉️ We'll respond within <span className="font-semibold">1 hour</span>.
            </p>
        </div>
    );
}