import { cn } from '@/lib/utils'

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      className={cn(
        'flex items-center gap-1 text-sm font-medium leading-none text-foreground select-none',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
