const { useState, useEffect } = React;

// Icon Components
const MessageSquare = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);

const Send = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
);

const ArrowLeft = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
    </svg>
);

function Textboard() {
    const [boards, setBoards] = useState([
        { id: 'news', name: 'ニュース速報', description: '最新ニュースを語ろう' },
        { id: 'tech', name: '技術', description: 'プログラミング・IT技術' },
        { id: 'life', name: '生活', description: '日常生活の話題' },
        { id: 'hobby', name: '趣味', description: '趣味の話題' }
    ]);
    const [threads, setThreads] = useState({});
    const [posts, setPosts] = useState({});
    const [view, setView] = useState('boards');
    const [currentBoard, setCurrentBoard] = useState(null);
    const [currentThread, setCurrentThread] = useState(null);
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newPost, setNewPost] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const savedThreads = localStorage.getItem('textboard_threads');
        const savedPosts = localStorage.getItem('textboard_posts');
        if (savedThreads) setThreads(JSON.parse(savedThreads));
        if (savedPosts) setPosts(JSON.parse(savedPosts));
    }, []);

    useEffect(() => {
        localStorage.setItem('textboard_threads', JSON.stringify(threads));
    }, [threads]);

    useEffect(() => {
        localStorage.setItem('textboard_posts', JSON.stringify(posts));
    }, [posts]);

    const openBoard = (board) => {
        setCurrentBoard(board);
        setView('threads');
    };

    const openThread = (thread) => {
        setCurrentThread(thread);
        setView('posts');
    };

    const createThread = () => {
        if (!newThreadTitle.trim() || !newPost.trim()) return;

        const threadId = `${currentBoard.id}_${Date.now()}`;
        const thread = {
            id: threadId,
            boardId: currentBoard.id,
            title: newThreadTitle,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            postCount: 1
        };

        const post = {
            id: `${threadId}_1`,
            threadId: threadId,
            number: 1,
            name: name.trim() || '名無しさん',
            content: newPost,
            timestamp: Date.now()
        };

        setThreads(prev => ({
            ...prev,
            [threadId]: thread
        }));

        setPosts(prev => ({
            ...prev,
            [post.id]: post
        }));

        setNewThreadTitle('');
        setNewPost('');
        setName('');
    };

    const createPost = () => {
        if (!newPost.trim()) return;

        const threadPosts = Object.values(posts).filter(p => p.threadId === currentThread.id);
        const postNumber = threadPosts.length + 1;
        const postId = `${currentThread.id}_${postNumber}`;

        const post = {
            id: postId,
            threadId: currentThread.id,
            number: postNumber,
            name: name.trim() || '名無しさん',
            content: newPost,
            timestamp: Date.now()
        };

        setPosts(prev => ({
            ...prev,
            [postId]: post
        }));

        setThreads(prev => ({
            ...prev,
            [currentThread.id]: {
                ...prev[currentThread.id],
                updatedAt: Date.now(),
                postCount: postNumber
            }
        }));

        setNewPost('');
        setName('');
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}(${days[date.getDay()]}) ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    const getBoardThreads = () => {
        if (!currentBoard) return [];
        return Object.values(threads)
            .filter(t => t.boardId === currentBoard.id)
            .sort((a, b) => b.updatedAt - a.updatedAt);
    };

    const getThreadPosts = () => {
        if (!currentThread) return [];
        return Object.values(posts)
            .filter(p => p.threadId === currentThread.id)
            .sort((a, b) => a.number - b.number);
    };

    const goBack = () => {
        if (view === 'posts') {
            setView('threads');
            setCurrentThread(null);
        } else {
            setView('boards');
            setCurrentBoard(null);
        }
    };

    return (
        <div className="app-container">
            {/* Header */}
            <div className="header">
                <div className="header-content">
                    <div className="header-logo">
                        <MessageSquare className="icon" />
                        <h1 className="header-title">Textboard</h1>
                    </div>
                    {view !== 'boards' && (
                        <button onClick={goBack} className="btn btn-back">
                            <ArrowLeft className="icon-small" />
                            戻る
                        </button>
                    )}
                </div>
            </div>

            <div className="main-content">
                {/* Boards View */}
                {view === 'boards' && (
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">板一覧</h2>
                        </div>
                        <div>
                            {boards.map((board) => (
                                <div key={board.id} onClick={() => openBoard(board)} className="board-item">
                                    <h3 className="board-name">{board.name}</h3>
                                    <p className="card-description">{board.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Threads View */}
                {view === 'threads' && currentBoard && (
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">{currentBoard.name}</h2>
                            <p className="card-description">{currentBoard.description}</p>
                        </div>

                        {/* New Thread Form */}
                        <div className="form-container">
                            <h3 className="form-title">新規スレッド作成</h3>
                            <input
                                type="text"
                                placeholder="スレッドタイトル"
                                value={newThreadTitle}
                                onChange={(e) => setNewThreadTitle(e.target.value)}
                                className="form-input"
                            />
                            <input
                                type="text"
                                placeholder="名前(省略可)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input"
                            />
                            <textarea
                                placeholder="本文"
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                className="form-textarea"
                            />
                            <button onClick={createThread} className="btn btn-submit">
                                <Send className="icon-medium" />
                                スレッド作成
                            </button>
                        </div>

                        {/* Thread List */}
                        <div>
                            {getBoardThreads().length === 0 ? (
                                <div className="empty-state">
                                    スレッドがありません。最初のスレッドを作成しましょう!
                                </div>
                            ) : (
                                getBoardThreads().map((thread) => (
                                    <div key={thread.id} onClick={() => openThread(thread)} className="thread-item">
                                        <h3 className="thread-title">{thread.title}</h3>
                                        <p className="thread-meta">
                                            {thread.postCount}件のレス | 最終更新: {formatDate(thread.updatedAt)}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Posts View */}
                {view === 'posts' && currentThread && (
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">{currentThread.title}</h2>
                        </div>

                        {/* Posts */}
                        <div>
                            {getThreadPosts().map((post) => (
                                <div key={post.id} className="post-item">
                                    <div className="post-header">
                                        <span className="post-number">{post.number}</span>
                                        <span className="post-separator">:</span>
                                        <span className="post-name">{post.name}</span>
                                        <span className="post-timestamp">{formatDate(post.timestamp)}</span>
                                    </div>
                                    <div className="post-content">{post.content}</div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Form */}
                        <div className="reply-form">
                            <h3 className="form-title">返信する</h3>
                            <input
                                type="text"
                                placeholder="名前(省略可)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input"
                            />
                            <textarea
                                placeholder="本文"
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                className="form-textarea"
                            />
                            <button onClick={createPost} className="btn btn-submit">
                                <Send className="icon-medium" />
                                書き込む
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

ReactDOM.render(<Textboard />, document.getElementById('root'));