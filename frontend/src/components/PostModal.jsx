import { X, FileText, AlignLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/authContext";

const topics = [
    "Technology",
    "Health",
    "Education",
    "Travel",
    "Food",
    "Finance",
    "Lifestyle",
    "Science",
    "Sports",
    "Entertainment"
];

const PostModal = ({ setClose }) => {
    const [topic, setTopic] = useState(topics[0]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const {loginCred}=useAuth();
    const [loading, setLoading]=useState(false)

    const handleSubmit = async(e) => {
        e.preventDefault();
        // Handle post creation logic here
        // ...
        const{username, token}=loginCred;
        console.log(token);
        
        try{
            const response=await fetch('http://localhost:8080/post/postBlog', {
                method:"POST",
                headers:{
                    'content-type':'application/json',
                    'authorization':`Bearer ${token}`
                },
                body:JSON.stringify({
                    author:username,
                    title:title,
                    des:description
                })
            })
            console.log(response);

        }catch(err){
            console.log('Error in creating post.');
        }
        // setClose(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative border border-blue-200">
                {/* Close button */}
                <button
                    className="absolute top-4 right-4 text-blue-500 hover:text-blue-700 transition"
                    onClick={() => setClose(false)}
                >
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-500" />
                    Create Post
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Topic Dropdown */}
                    <div className="mb-4">
                        <label className="block text-blue-700 font-semibold mb-2">
                            Topic
                        </label>
                        <div className="relative">
                            <select
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                            >
                                {topics.map((t, idx) => (
                                    <option key={idx} value={t}>{t}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none" />
                        </div>
                    </div>
                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-blue-700 font-semibold mb-2 flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter post title"
                            required
                        />
                    </div>
                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-blue-700 font-semibold mb-2 flex items-center gap-1">
                            <AlignLeft className="w-4 h-4" />
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows={4}
                            placeholder="Write your post description..."
                            required
                        />
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition"
                    >
                        Create Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostModal;