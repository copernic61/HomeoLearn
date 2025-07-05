import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '../App';
import { generateWithOpenAI } from '../utils/openai';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
// npm install uuid

const DiscussionChatPage = ({ view, navigate, data, onAddMessage, currentUser }) => {
    const { courseId, discussionId } = view;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!discussionId) return;
        const fetchMessages = async () => {
            const { data: messagesData, error } = await supabase
                .from('messages')
                .select('*')
                .eq('discussion_id', discussionId)
                .order('timestamp', { ascending: true });

            if (error) {
                // Ако искаш напълно да скриеш грешката:
                // return;

                // Или, ако искаш да виждаш грешки само в development:
                if (process.env.NODE_ENV === 'development') {
                    console.error("Error fetching discussion messages:", error);
                }
                return;
            }
            setMessages(messagesData);
        };
        fetchMessages();

        const subscription = supabase
            .channel(`messages-${discussionId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messages',
                filter: `discussion_id=eq.${discussionId}`,
            }, (payload) => {
                fetchMessages(); // винаги презареждай целия списък!
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [discussionId]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        const message = {
            id: uuidv4(),
            text: newMessage,
            author_id: currentUser?.id,
            discussion_id: discussionId,
            timestamp: new Date()
        };
        const { data: newMessageData, error } = await supabase
            .from('messages')
            .insert(message)
            .select()
            .single();

        setNewMessage('');
        // НЕ викай onAddMessage или не добавяй съобщението локално!

        // --- OpenAI интеграция ---
        const topic = data.courses.flatMap(c => c.modules || []).flatMap(m => m.topics || []).find(t => t.discussionId === discussionId);
        const lessonContext = topic?.lessonParts?.map(lp => lp.content || lp.title || '').join('\n') || '';
        if (lessonContext) {
            setAiLoading(true);
            const aiText = await generateWithOpenAI(newMessage, lessonContext);
            const aiResponse = {
                id: uuidv4(),
                text: aiText,
                author_id: 'ai-assistant',
                discussion_id: discussionId,
                timestamp: new Date()
            };
            await supabase.from('messages').insert(aiResponse);
            setAiLoading(false);
        }
    };
    
    const topic = data.courses.flatMap(c => c.modules || []).flatMap(m => m.topics || []).find(t => t.discussionId === discussionId);

    const handleDeleteAllMessages = async () => {
        if (!window.confirm("Сигурен ли си, че искаш да изтриеш всички съобщения в този чат?")) return;
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('discussion_id', discussionId);
        if (error) {
            alert("Грешка при изтриване: " + error.message);
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b flex items-center justify-between">
                <div>
                    <button onClick={() => navigate({ page: 'courseDetail', courseId })} className="mb-2 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center text-sm"><ArrowLeft size={16} className="mr-2" />Обратно към курса</button>
                    <h2 className="text-xl font-bold text-gray-800">Q&A: {topic?.title}</h2>
                </div>
                <button
                    onClick={handleDeleteAllMessages}
                    className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                >
                    Изчисти чата
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map(msg => {
                    const isUser = msg.author_id === currentUser?.id;
                    const isAI = msg.author_id === 'ai-assistant';
                    const author = isUser ? data.user : { name: 'HomeoLearn AI', avatar_url: 'https://placehold.co/100x100/818CF8/FFFFFF?text=AI' };
                    return (
                        <div key={msg.id} className={`flex items-end gap-2 my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                            {!isUser && <img src={author.avatar_url} alt={author.name} className="w-8 h-8 rounded-full"/>}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isUser ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                {isAI ? (
                                  <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                  </div>
                                ) : (
                                  <p className="text-sm">{msg.text}</p>
                                )}
                                <p className={`text-xs mt-1 ${isUser ? 'text-indigo-200' : 'text-gray-500'}`}>{msg.timestamp?.toDate?.() ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                            </div>
                            {isUser && <img src={currentUser?.user_metadata?.avatar_url || `https://placehold.co/100x100/E2E8F0/4A5568?text=${currentUser?.email?.[0]?.toUpperCase()}`} alt={author.name} className="w-8 h-8 rounded-full"/>}
                        </div>
                    );
                })}
                {aiLoading && (
                  <div className="flex items-end gap-2 my-2 justify-start">
                    <img src="https://placehold.co/100x100/818CF8/FFFFFF?text=AI" alt="AI" className="w-8 h-8 rounded-full"/>
                    <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                      <p className="text-sm italic text-gray-500">AI пише отговор...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50"><div className="flex items-center gap-2"><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Напишете въпроса си тук..." className="flex-1 w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" /><button type="submit" className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700" disabled={aiLoading}><Send size={20} /></button></div></form>
        </div>
    );
};

export default DiscussionChatPage; 