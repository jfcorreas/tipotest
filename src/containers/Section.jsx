export const Section = ({
  title = 'Empty',
  headingLevel,
  children
}) => {
  let header
  switch (headingLevel) {
    case 1:
      header = <h1>{title}</h1>
      break
    case 2:
      header = <h2>{title}</h2>
      break
    case 4:
      header = <h4>{title}</h4>
      break
    case 5:
      header = <h5>{title}</h5>
      break
    default:
      header = <h3>{title}</h3>
      break
  }
  return (
    <section>
      {header}
      {children}
    </section>
  )
}
