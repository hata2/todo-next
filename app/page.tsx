"use client";

import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [dueDate, setDueDate] = useState("");

  const addTodo = () => {
    if (inputValue.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      dueDate: dueDate || undefined,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
    setDueDate("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            TODOリスト
          </h1>

          <div className="mb-6">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="新しいタスクを入力..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={addTodo}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                追加
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <label htmlFor="dueDate" className="text-sm text-gray-600 font-medium">
                期限日:
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            {todos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                タスクがありません。新しいタスクを追加してください。
              </p>
            ) : (
              todos.map((todo) => {
                const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date(new Date().toDateString());

                return (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors ${
                      isOverdue ? "bg-red-50" : "bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <span
                        className={`block ${
                          todo.completed
                            ? "line-through text-gray-500"
                            : isOverdue
                            ? "text-red-700 font-medium"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.text}
                      </span>
                      {todo.dueDate && (
                        <span
                          className={`text-sm ${
                            todo.completed
                              ? "text-gray-400"
                              : isOverdue
                              ? "text-red-600 font-medium"
                              : "text-gray-500"
                          }`}
                        >
                          期限: {new Date(todo.dueDate).toLocaleDateString('ja-JP')}
                          {isOverdue && " (期限切れ)"}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      削除
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {todos.length > 0 && (
            <div className="mt-6 text-center text-gray-600">
              <p>
                完了: {todos.filter((todo) => todo.completed).length} / 全体:{" "}
                {todos.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
