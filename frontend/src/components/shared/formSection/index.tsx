import type { ReactNode } from 'react'
import './style.css'

type FormSectionProps = {
    title?: string
    icon?: ReactNode
    children: ReactNode
}

export function FormSection({ title, icon, children }: FormSectionProps) {
    return (
        <fieldset className="form-section">
            {title && (
                <legend className="form-section__legend">
                    {icon && <span className="form-section__icon-wrapper">{icon}</span>}
                    {title}
                </legend>
            )}
            <div className="form-section__grid">{children}</div>
        </fieldset>
    )
}