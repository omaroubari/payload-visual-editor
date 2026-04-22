import styles from './styles.module.scss'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = ({ className = '', ...props }: CheckboxProps) => {
  return (
    <div className={`${styles.checkboxContainer} ${className}`}>
      <input className={styles.checkboxInput} type="checkbox" {...props} />
      <svg className={styles.checkboxCheck} fill="none" height="14" viewBox="0 0 14 14" width="14">
        <path
          className={styles.checkboxCheckPath}
          d="M3.94 7L6.13 9.19L10.5 4.81"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )
}
