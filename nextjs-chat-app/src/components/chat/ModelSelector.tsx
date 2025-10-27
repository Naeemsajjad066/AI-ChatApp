'use client';

import { useEffect, useRef } from 'react';
import { Select } from '@/components/ui/Select';
import { trpc } from '@/lib/trpc';
import { useChatStore } from '@/lib/store';

export function ModelSelector() {
  const { selectedModel, setSelectedModel, setSidebarOpen, setModelSwitching } = useChatStore();
  const { data: models, isLoading } = trpc.model.getAvailable.useQuery();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (isLoading || !models) {
    return <div className="animate-pulse h-10 bg-muted rounded-md" />;
  }

  // Only include the two allowed models
  const allowed = ['gemini', 'chatgpt'];
  const filtered = models.filter((m) => allowed.includes(m.tag));

  // If backend doesn't return them, use a fallback list
  const options =
    filtered.length > 0
      ? filtered.map((model) => ({ value: model.tag, label: model.name }))
      : [
          { value: 'chatgpt', label: 'ChatGPT' },
          { value: 'gemini', label: 'Gemini' },
        ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Show loading state when switching models
    if (newModel !== selectedModel) {
      setModelSwitching(true);
      
      // Set model after a brief delay to show loader
      timeoutRef.current = setTimeout(() => {
        setSelectedModel(newModel);
        setModelSwitching(false);
        timeoutRef.current = null;
      }, 500);
    }
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <Select
      label="AI Model"
      options={options}
      value={selectedModel || ''}
      onChange={handleChange}
    />
  );
}