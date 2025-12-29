import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-gradient-to-r from-orange to-[#ffa500] text-deep-space hover:shadow-lg hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(254,179,60,0.3)]':
              variant === 'primary',
            'bg-cherry-rose text-ghost-white hover:bg-[#8f1635] hover:shadow-lg hover:-translate-y-0.5':
              variant === 'secondary',
            'border-2 border-orange text-orange hover:bg-orange hover:text-deep-space':
              variant === 'ghost',
          },
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'