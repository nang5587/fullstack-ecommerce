import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        selGhost:
          'bg-white text-kalani-ash border border-gray-200 hover:bg-gray-200',
        naver:
          'bg-[#03C75A] text-white hover:opacity-90',
        navy:
          'bg-kalani-navy text-white hover:opacity-80',
        gold:
          'bg-black text-white hover:bg-kalani-gold hover:text-black',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'selGhost',
      size: 'md',
      fullWidth: false,
    },
  }
);

export default function TailButton({
  children,
  variant,
  size,
  fullWidth,
  className,
  onClick,
  disabled,
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        buttonVariants({ variant, size, fullWidth }),
        disabled &&
        'opacity-50 cursor-not-allowed hover:bg-inherit hover:opacity-100',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
