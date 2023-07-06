import { useScrollTrigger } from "@mui/material"
import { styled } from '@mui/material/styles';
import { ArrowUpward } from "@mui/icons-material"
import * as React from "react"
import { PlainButton } from "../Buttons"

const PREFIX = 'ScrollToTop';

const classes = {
  scrollToTop: `${PREFIX}-scrollToTop`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.scrollToTop}`]: {
    position: "fixed",
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  }
}));

const ScrollToTop = () => {
  const shouldScroll = useScrollTrigger({
    threshold: (window.screen.height || 200) / 2,
  })


  const onClick = React.useCallback(() => {
    document.body.scrollIntoView({ behavior: "smooth" })
  }, [])

  if (!shouldScroll) {
    return null
  }

  return (
    <Root className={classes.scrollToTop}>
      <PlainButton startIcon={<ArrowUpward />} onClick={onClick}>
        Back to Top
      </PlainButton>
    </Root>
  );
}

export default ScrollToTop
