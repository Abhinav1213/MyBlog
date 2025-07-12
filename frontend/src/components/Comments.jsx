import { useState } from "react";
import { Send } from "lucide-react";

const Comments = ({ value }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([
        { id: 1, user: "Aryan", text: "Great post! 👏" },
        { id: 2, user: "Abhinav", text: "Thanks for sharing this." }
    ]);

    const handleSend = () => {
        if (comment.trim() === "") return;
        setComments(prev => [
            ...prev,
            { id: prev.length + 1, user: "You", text: comment }
        ]);
        setComment("");
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-4 mt-2">
            <h4 className="text-lg font-bold text-blue-700 mb-3">Comments</h4>
            <div className="flex flex-col gap-3 mb-4 max-h-48 overflow-y-auto">
                {comments.map(c => (
                    <div key={c.id} className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                            {c.user[0]}
                        </div>
                        <div>
                            <span className="font-semibold text-blue-700">{c.user}</span>
                            <p className="text-gray-700">{c.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 border-t pt-2">
                <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition flex items-center justify-center"
                    onClick={handleSend}
                    aria-label="Send"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Comments;