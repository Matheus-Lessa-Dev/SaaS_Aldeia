import type { ChangeEventHandler, FocusEventHandler, HTMLInputTypeAttribute } from 'react'
import './style.css'

type FormFieldProps = {
    label: string
    id: string
    type?: HTMLInputTypeAttribute
    placeholder?: string
    value: string
    onChange: ChangeEventHandler<HTMLInputElement>
    onBlur?: FocusEventHandler<HTMLInputElement>
    error?: string
    required?: boolean
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
    pattern?: string
    maxLength?: number
}

export function FormField({
    label,
    id,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    required = false,
    inputMode,
    pattern,
    maxLength,
}: FormFieldProps) {
    return (
        <div className="form-field">
            <label htmlFor={id} className="form-field__label">
                {label}
                {required && <span className="form-field__required">*</span>}
            </label>
            <div className={`form-field__input-wrapper ${error ? 'form-field__input--error' : ''}`.trim()}>
                <input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    inputMode={inputMode}
                    pattern={pattern}
                    maxLength={maxLength}
                    className="form-field__input"
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
            </div>
            {error && (
                <span id={`${id}-error`} className="form-field__error-message" role="alert">
                    {error}
                </span>
            )}
        </div>
    )
}
