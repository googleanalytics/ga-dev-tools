import React from "react"
import { styled } from '@mui/material/styles';
import LinkedTextField, { LinkedTextFieldProps } from "./LinkedTextField"
import { TextField } from "@mui/material"

const PREFIX = 'GADate';

const classes = {
  dateRange: `${PREFIX}-dateRange`,
  wideInput: `${PREFIX}-wideInput`
};

const Root = styled('span')((
  {
    theme
  }
) => ({
  [`&.${classes.dateRange}`]: {
    display: "inline-flex",
    "&> :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },

  [`& .${classes.wideInput}`]: {
    flexGrow: 1,
  }
}));

interface GADateProps extends LinkedTextFieldProps {}

export const GADate: React.FC<GADateProps> = ({
  linkTitle,
  href,
  helperText,
  label,
  value,
  onChange,
  required,
}) => {
  return (
    <LinkedTextField
      href={href}
      linkTitle={linkTitle}
      label={label}
      value={value}
      onChange={onChange}
      required={required}
      helperText={helperText}
    />
  )
}

type DateRange = gapi.client.analyticsdata.DateRange
interface GADateRangeProps {
  value: DateRange
  setValue: (update: (old: DateRange) => DateRange) => void
  showName?: true | undefined
}
export const GADateRange: React.FC<GADateRangeProps> = ({
  value,
  setValue,
  showName,
}) => {


  return (
    <Root className={classes.dateRange}>
      {showName && (
        <TextField
          label="name"
          variant="outlined"
          size="small"
          value={value.name || ""}
          onChange={e => {
            const name = e.target.value
            setValue(old => ({ ...old, name }))
          }}
        />
      )}
      <TextField
        label="start date"
        className={classes.wideInput}
        variant="outlined"
        size="small"
        value={value.startDate || ""}
        onChange={e => {
          const startDate = e.target.value
          setValue(old => ({ ...old, startDate }))
        }}
      />
      <TextField
        label="end date"
        className={classes.wideInput}
        variant="outlined"
        size="small"
        value={value.endDate || ""}
        onChange={e => {
          const endDate = e.target.value
          setValue(old => ({ ...old, endDate }))
        }}
      />
    </Root>
  );
}

export default GADate
