import type { KeyboardEvent } from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Sparkles } from 'lucide-react'

type CreateFormPromptProps = {
  newTitle: string
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onCreate: () => void
}

export function CreateFormPrompt({ newTitle, onTitleChange, onKeyDown, onCreate }: CreateFormPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 relative z-10 p-4">
      <div className="p-10 rounded-3xl bg-card/70 backdrop-blur-2xl shadow-2xl shadow-primary/5 border border-border/50 max-w-lg text-center w-full">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-foreground tracking-tight">
          Create a Form
        </h2>
        <p className="text-base text-muted-foreground mb-8">
          Give your form a name to get started with the builder.
        </p>

        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <Input
            autoFocus
            placeholder="E.g. Customer Feedback Survey"
            value={newTitle}
            onChange={onTitleChange}
            onKeyDown={onKeyDown}
            className="text-base py-6 px-4 transition-all focus:ring-primary/30 bg-background/60 border-border/60 rounded-xl"
          />
          <Button
            onClick={onCreate}
            size="lg"
            className="w-full text-base shadow-md hover:shadow-lg hover:shadow-primary/10 transition-all py-6 rounded-xl font-semibold"
          >
            Start Building
          </Button>
        </div>
      </div>
    </div>
  )
}
