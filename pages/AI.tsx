import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';

const AI: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setPrompt('');
  };

  return (
    <div className="min-h-[calc(100vh-theme(spacing.16)-theme(spacing.16))] flex flex-col">
      <div className="flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2 mb-8">
            <Sparkles className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-semibold text-gray-900">AI Assistant</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Quick Prompts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickPrompt text="Analyze system performance" />
              <QuickPrompt text="Generate API documentation" />
              <QuickPrompt text="Debug error logs" />
              <QuickPrompt text="Optimize database queries" />
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 bg-blue-500 rounded-lg p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-gray-700">Hello! I'm your AI assistant. How can I help you today?</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 pt-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything..."
              className="w-full rounded-lg border border-gray-200 py-3 pl-4 pr-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface QuickPromptProps {
  text: string;
}

const QuickPrompt: React.FC<QuickPromptProps> = ({ text }) => {
  return (
    <button className="text-left px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
      {text}
    </button>
  );
};

export default AI;