import { useDisplayName } from '../auth/useDisplayName'
import { useUser } from '../auth/useUser'

export function UserAvatar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const { user, profile } = useUser()
  const name = useDisplayName()
  const photo = profile?.photoURL || user?.photoURL
  const dimension = size === 'sm' ? 'size-8 text-xs' : 'size-10 text-sm'

  if (photo) {
    return <img src={photo} alt="" referrerPolicy="no-referrer" className={`${dimension} rounded-full border border-ink-600 object-cover`} />
  }
  return (
    <span aria-hidden="true" className={`${dimension} grid place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 font-bold text-ink-950`}>
      {name.slice(0, 1).toUpperCase()}
    </span>
  )
}
