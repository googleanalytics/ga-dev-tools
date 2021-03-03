import React from "react"
import { TextField } from "@material-ui/core"
import ExternalLink from "./ExternalLink"

interface GADateProps {
  href: string
  title: string
  label: string
  helperText: string | JSX.Element
  onDateChanged: (date: string) => void
  initialValue?: string
}

const GADate: React.FC<GADateProps> = ({
  title,
  href,
  helperText,
  label,
  initialValue,
  onDateChanged,
}) => {
  const [date, setDate] = React.useState(initialValue || "")

  React.useEffect(() => {
    onDateChanged(date)
  }, [date])

  return (
    <TextField
      InputProps={{
        endAdornment: <ExternalLink href={href} title={title} />,
      }}
      size="small"
      variant="outlined"
      fullWidth
      label={label}
      value={date}
      onChange={e => setDate(e.target.value)}
      required
      helperText={helperText}
    />
  )
}

export default GADate
