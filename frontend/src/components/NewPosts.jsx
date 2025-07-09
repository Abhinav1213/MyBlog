import { FileText, AlignLeft } from "lucide-react";

const NewPosts = () => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 max-w-lg mx-auto mt-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-500" />
                Create New Post
            </h2>
            <div className="mb-4">
                <label className="block text-blue-700 font-semibold mb-2 flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Title
                </label>
                <input
                    type="text"
                    className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter post title"
                />
            </div>
            <div className="mb-4">
                <label className="block text-blue-700 font-semibold mb-2 flex items-center gap-1">
                    <AlignLeft className="w-4 h-4" />
                    Description
                </label>
                <textarea
                    className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={4}
                    placeholder="Write your post description..."
                />
            </div>
        </div>
    );
};

export default NewPosts;