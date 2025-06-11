import { toast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function useToast() {
  return {
    toast: ({ title, description, action }: ToastProps) => {
      if (action) {
        toast(title || description, {
          action: {
            label: action.label,
            onClick: action.onClick,
          },
        })
      } else {
        toast(title || description)
      }
    },
    dismiss: toast.dismiss,
  }
}

export { toast }
