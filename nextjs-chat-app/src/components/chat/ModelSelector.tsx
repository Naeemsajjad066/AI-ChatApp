'use client';

import { Select } from '@/components/ui/Select';
import { trpc } from '@/lib/trpc';
import { useChatStore } from '@/lib/store';

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChatStore();
  const { data: models, isLoading } = trpc.model.getAvailable.useQuery();

  if (isLoading || !models) {
    return <div className="animate-pulse h-10 bg-muted rounded-md" />;
  }

  const options = models.map((model) => ({
    value: model.tag,
    label: model.name,
  }));

  return (
    <Select
      label="AI Model"
      options={options}
      value={selectedModel || ''}
      onChange={(e) => setSelectedModel(e.target.value)}
    />
  );
}