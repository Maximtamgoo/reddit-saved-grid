import ContentLoader from 'react-content-loader'

export default function Placeholder() {
  return (
    <ContentLoader
      viewBox="0 0 100 100"
      backgroundColor="var(--grey)"
      foregroundColor="var(--blue)"
      style={{ width: '100%' }}>
      <rect x="0" y="0" rx="0" ry="0" width="100" height="100" />
    </ContentLoader>
  )
}