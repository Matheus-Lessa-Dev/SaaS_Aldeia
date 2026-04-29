import './style.css'

type FormActionsProps = {
    onCancel?: () => void
    onSubmit: () => void
    submitLabel?: string
    loading?: boolean
}

export function FormActions({
    onCancel,
    onSubmit,
    submitLabel = 'Cadastrar',
    loading = false,
}: FormActionsProps) {
    return (
        <div className="form-actions">
            <button
                type="button"
                className="form-actions__cancel"
                onClick={onCancel}
                disabled={loading}
            >
                Cancelar
            </button>
            <button
                type="button"
                className="form-actions__submit"
                onClick={onSubmit}
                disabled={loading}
            >
                {loading ? 'Salvando...' : submitLabel}
            </button>
        </div>
    )
}