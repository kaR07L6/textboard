import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, ArrowLeft, RefreshCw } from 'lucide-react';

export default function Textboard() {
  const [boards, setBoards] = useState([]);
  const [threads, setThreads] = useState([]);
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('boards');
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentThread, setCurrentThread] = useState(null);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newPost, setNewPost] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const result = await window.storage.list('board:');
      if (result && result.keys) {
        const boardData = await Promise.all(
          result.keys.map(async (key) => {
            const data = await window.storage.get(key);
            return data ? JSON.parse(data.value) : null;
          })
        );
        setBoards(boardData.filter(b => b !== null));
      } else {
        const defaultBoards = [
          { id: 'news', name: 'ニュース速報', description: '最新ニュースを語ろう' },
          { id: 'tech', name: '技術', description: 'プログラミング・IT技術' },
          { id: 'life', name: '生活', description: '日常生活の話題' }
        ];
        for (const board of defaultBoards) {
          await window.storage.set(`board:${board.id}`, JSON.stringify(board));
        }
        setBoards(defaultBoards);
      }
    } catch (e) {
      const defaultBoards = [
        { id: 'news', name: 'ニュース速報', description: '最新ニュースを語ろう' },
        { id: 'tech', name: '技術', description: 'プログラミング・IT技術' },
        { id: 'life', name: '生活', description: '日常生活の話題' }
      ];
      for (const board of defaultBoards) {
        await window.storage.set(`board:${board.id}`, JSON.stringify(board));
      }
      setBoards(defaultBoards);
    }
  };

  const loadThreads = async (boardId) => {
    try {
      const result = await window.storage.list(`thread:${boardId}:`);
      if (result && result.keys) {
        const threadData = await Promise.all(
          result.keys.map(async (key) => {
            const data = await window.storage.get(key);
            return data ? JSON.parse(data.value) : null;
          })
        );
        setThreads(threadData.filter(t => t !== null).sort((a, b) => b.updatedAt - a.updatedAt));
      } else {
        setThreads([]);
      }
    } catch (e) {
      setThreads([]);
    }
  };

  const loadPosts = async (threadId) => {
    try {
      const result = await window.storage.list(`post:${threadId}:`);
      if (result && result.keys) {
        const postData = await Promise.all(
          result.keys.map(async (key) => {
            const data = await window.storage.get(key);
            return data ? JSON.parse(data.value) : null;
          })
        );
        setPosts(postData.filter(p => p !== null).sort((a, b) => a.number - b.number));
      } else {
        setPosts([]);
      }
    } catch (e) {
      setPosts([]);
    }
  };

  const openBoard = (board) => {
    setCurrentBoard(board);
    loadThreads(board.id);
    setView('threads');
  };

  const openThread = (thread) => {
    setCurrentThread(thread);
    loadPosts(thread.id);
    setView('posts');
  };

  const createThread = async () => {
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

    await window.storage.set(`thread:${currentBoard.id}:${threadId}`, JSON.stringify(thread));
    await window.storage.set(`post:${threadId}:1`, JSON.stringify(post));

    setNewThreadTitle('');
    setNewPost('');
    setName('');
    loadThreads(currentBoard.id);
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    const postNumber = posts.length + 1;
    const post = {
      id: `${currentThread.id}_${postNumber}`,
      threadId: currentThread.id,
      number: postNumber,
      name: name.trim() || '名無しさん',
      content: newPost,
      timestamp: Date.now()
    };

    await window.storage.set(`post:${currentThread.id}:${postNumber}`, JSON.stringify(post));

    const updatedThread = {
      ...currentThread,
      updatedAt: Date.now(),
      postCount: postNumber
    };
    await window.storage.set(`thread:${currentThread.boardId}:${currentThread.id}`, JSON.stringify(updatedThread));

    setNewPost('');
    setName('');
    loadPosts(currentThread.id);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}(${['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}) ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-orange-600 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare size={28} />
            <h1 className="text-2xl font-bold">Textboard</h1>
          </div>
          {view !== 'boards' && (
            <button
              onClick={() => {
                if (view === 'posts') {
                  setView('threads');
                  setCurrentThread(null);
                } else {
                  setView('boards');
                  setCurrentBoard(null);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-700 hover:bg-orange-800 rounded"
            >
              <ArrowLeft size={18} />
              戻る
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Boards View */}
        {view === 'boards' && (
          <div className="bg-white rounded shadow">
            <div className="border-b p-4 bg-gray-50">
              <h2 className="text-xl font-bold">板一覧</h2>
            </div>
            <div className="divide-y">
              {boards.map((board) => (
                <div
                  key={board.id}
                  onClick={() => openBoard(board)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <h3 className="font-bold text-lg text-blue-600 hover:underline">
                    {board.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{board.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Threads View */}
        {view === 'threads' && currentBoard && (
          <div>
            <div className="bg-white rounded shadow mb-4">
              <div className="border-b p-4 bg-gray-50">
                <h2 className="text-xl font-bold">{currentBoard.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{currentBoard.description}</p>
              </div>

              {/* New Thread Form */}
              <div className="p-4 bg-yellow-50 border-b">
                <h3 className="font-bold mb-3">新規スレッド作成</h3>
                <input
                  type="text"
                  placeholder="スレッドタイトル"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="名前(省略可)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <textarea
                  placeholder="本文"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="w-full p-2 border rounded mb-2 h-24"
                />
                <button
                  onClick={createThread}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Send size={16} />
                  スレッド作成
                </button>
              </div>

              {/* Thread List */}
              <div className="divide-y">
                {threads.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    スレッドがありません。最初のスレッドを作成しましょう!
                  </div>
                ) : (
                  threads.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => openThread(thread)}
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <h3 className="font-bold text-blue-600 hover:underline">
                        {thread.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {thread.postCount}件のレス | 最終更新: {formatDate(thread.updatedAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Posts View */}
        {view === 'posts' && currentThread && (
          <div>
            <div className="bg-white rounded shadow mb-4">
              <div className="border-b p-4 bg-gray-50">
                <h2 className="text-xl font-bold">{currentThread.title}</h2>
              </div>

              {/* Posts */}
              <div className="divide-y">
                {posts.map((post) => (
                  <div key={post.id} className="p-4">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-bold text-green-700">{post.number}</span>
                      <span className="font-bold text-green-700">:</span>
                      <span className="font-bold text-green-700">{post.name}</span>
                      <span className="text-sm text-gray-600">{formatDate(post.timestamp)}</span>
                    </div>
                    <div className="ml-8 whitespace-pre-wrap">{post.content}</div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <div className="p-4 bg-yellow-50 border-t">
                <h3 className="font-bold mb-3">返信する</h3>
                <input
                  type="text"
                  placeholder="名前(省略可)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <textarea
                  placeholder="本文"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="w-full p-2 border rounded mb-2 h-24"
                />
                <button
                  onClick={createPost}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Send size={16} />
                  書き込む
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}