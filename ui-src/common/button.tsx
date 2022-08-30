import clsx from "clsx"
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react"

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  content: ReactNode
}

const Button = ({content, className, ...props}: Props) => {
  return <button {...props} className={clsx('button', className)}>{content}</button>
}

export {Button}
