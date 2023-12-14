import * as React from "react"
import { styled } from '@mui/material/styles';
import clsx from "classnames"
import Typography from "@mui/material/Typography"
import {PropsWithChildren} from 'react';

const PREFIX = 'WithHelpText';

const classes = {
  withHelpText: `${PREFIX}-withHelpText`,
  helpText: `${PREFIX}-helpText`,
  shrunk: `${PREFIX}-shrunk`,
  notchedContainer: `${PREFIX}-notchedContainer`,
  label: `${PREFIX}-label`,
  legend: `${PREFIX}-legend`,
  fieldset: `${PREFIX}-fieldset`,
  notchedChild: `${PREFIX}-notchedChild`,
  hr: `${PREFIX}-hr`,
  hrChildren: `${PREFIX}-hrChildren`,
  verticalHr: `${PREFIX}-verticalHr`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.withHelpText}`]: {
    marginTop: theme.spacing(1.5),
    display: "flex",
  },

  [`& .${classes.helpText}`]: {
    ...theme.typography.caption,
    marginTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(2),
    color: "rgba(0, 0, 0, 0.54)",
    marginLeft: theme.spacing(2),
    padding: "unset",
  },

  [`& .${classes.shrunk}`]: {
    flexShrink: 1,
  },

  [`& .${classes.notchedContainer}`]: {
    position: "relative",
    width: "100%",
  },
  [`& .${classes.label}`]: {
    color: "rgba(0, 0, 0, 0.54)",
    ...theme.typography.caption,
    marginBottom: theme.spacing(1),
  },

  [`& .${classes.legend}`]: {
    color: "rgba(0, 0, 0, 0.54)",
    ...theme.typography.caption,
  },

  [`& .${classes.fieldset}`]: {
    position: "absolute",
    top: theme.spacing(-1.5),
    left: 0,
    right: 0,
    bottom: 0,
    color: "rgba(0, 0, 0, 0.54)",
    borderColor: "rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: "1px",
    padding: theme.spacing(0, 1),
    margin: theme.spacing(0),
    pointerEvents: "none",
    "&> legend": {
      ...theme.typography.caption,
    },
  },

  [`& .${classes.notchedChild}`]: {
    padding: theme.spacing(1),
  },
  [`& .${classes.verticalHr}`]: {
    display: "flex",
    "&> hr": {
      marginRight: theme.spacing(1),
    },
    "&> :not(:first-child)": {
      flexGrow: 1,
    },
  },
  [`&.${classes.hr}`]: {
    width: "100%",
  },
  [`& .${classes.hrChildren}`]: {
    "&> :last-child": {
      paddingBottom: theme.spacing(2),
    },
  }
}));

interface WithHelpTextProps {
  label?: string | JSX.Element | undefined
  helpText?: string | JSX.Element
  afterHelp?: JSX.Element
  className?: string
  notched?: boolean
  shrink?: boolean
  hrGroup?: boolean
}
const WithHelpText: React.FC<PropsWithChildren<WithHelpTextProps>> = ({
  label,
  children,
  helpText,
  afterHelp,
  notched,
  shrink,
  className,
  hrGroup,
}) => {

  if (hrGroup) {
    return (
      <Root className={clsx(classes.hr, className)}>
        <div className={classes.verticalHr}>
          <hr />
          <div>
            <legend className={classes.legend}>{label}</legend>
            <div className={classes.hrChildren}>
              {children}
              {helpText !== undefined && (
                <div>
                  <Typography className={classes.helpText}>
                    {helpText}
                  </Typography>
                  {afterHelp}
                </div>
              )}
            </div>
          </div>
        </div>
      </Root>
    );
  }
  return (
    <Root className={clsx(classes.withHelpText, className)}>
      <div
        className={clsx({
          [classes.notchedContainer]: notched,
          [classes.shrunk]: shrink,
        })}
      >
        {!notched && <label className={classes.label}>{label}</label>}
        <div className={clsx({ [classes.notchedChild]: notched })}>
          {children}
        </div>
        {notched && (
          <fieldset className={classes.fieldset}>
            <legend>
              <span>{label}</span>
            </legend>
          </fieldset>
        )}
      </div>
      {helpText !== undefined && (
        <div>
          <Typography className={classes.helpText}>{helpText}</Typography>
          {afterHelp}
        </div>
      )}
    </Root>
  )
}

export default WithHelpText
