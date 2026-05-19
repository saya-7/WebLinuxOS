import React from 'react'
import { Icons, type IconComponentType } from '../icons'

interface IconProps {
  iconId: string
  size?: number | string
  color?: string
  className?: string
}

export function Icon({ iconId, size = 24, color = 'currentColor', className = '' }: IconProps) {
  const IconComponent = Icons[iconId] as IconComponentType | undefined
  if (!IconComponent) {
    console.warn(`Icon not found: ${iconId}`)
    return null
  }
  return <IconComponent size={size} color={color} className={className} />
}

export default Icon
