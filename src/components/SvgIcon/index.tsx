import React, { FC } from 'react'
import './style.less'

interface IProps {
    className?: string,
    iconClass: string,
    onClick?: (event: React.MouseEvent<SVGElement>) => void
}

const SvgIcon: FC<IProps> = ({ iconClass, className, onClick }) => (
    <svg className={`svg-icon ${className}`} aria-hidden="true" onClick={event => {
        if (onClick) {
            onClick(event)
        }
    }}>
        <use xlinkHref={`#${iconClass}`} />
    </svg>
)

SvgIcon.defaultProps = {
    className: '',
    onClick: () => false
}

export default SvgIcon
