import type { Token } from '../lib/highlight'

/** Renders one highlighted line. An empty line keeps its height with a zero-width space. */
export function CodeTokens({ tokens }: { tokens: Token[] }) {
  if (tokens.length === 0) return <>{'​'}</>
  return (
    <>
      {tokens.map((token, index) =>
        token.type === 'plain' ? token.text : <span key={index} className={`tok-${token.type}`}>{token.text}</span>,
      )}
    </>
  )
}
