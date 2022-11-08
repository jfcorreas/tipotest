import React, { useState } from 'react'

export const Section = ({
  title = 'Empty',
  headingLevel,
  children
}) => {
  const [busy, setBusy] = useState(null)

  let header
  switch (headingLevel) {
    case 4:
      header = <h4 aria-busy={busy}>{title}</h4>
      break
    case 5:
      header = <h5 aria-busy={busy}>{title}</h5>
      break
    default:
      header = <h3 aria-busy={busy}>{title}</h3>
      break
  }
  return (
    <section className={busy}>
      {header}
      {children}
    </section>
  )
}
