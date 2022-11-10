export const Section = ({
  title = 'Empty',
  headingLevel,
  isLoading,
  children
}) => {
  let header
  switch (headingLevel) {
    case 1:
      header = <h1 aria-busy={isLoading}>{title}</h1>
      break
    case 2:
      header = <h2 aria-busy={isLoading}>{title}</h2>
      break
    case 4:
      header = <h4 aria-busy={isLoading}>{title}</h4>
      break
    case 5:
      header = <h5 aria-busy={isLoading}>{title}</h5>
      break
    default:
      header = <h3 aria-busy={isLoading}>{title}</h3>
      break
  }
  return (
    <section className={isLoading ? 'componentBusy' : null}>
      {header}
      {children}
    </section>
  )
}
