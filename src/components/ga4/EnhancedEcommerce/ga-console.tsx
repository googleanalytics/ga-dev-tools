import * as React from "react"
import {StoreContext} from "./store-context"
import {emptyEvents, eventDescription, eventLine, eventName, eventSnippet, eventTimestamp, gaConsoleStyle} from "@/components/ga4/EnhancedEcommerce/ga-console.module.css";
import Dialog from '@material-ui/core/Dialog';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {Link} from "gatsby";
import {Box, Typography} from "@material-ui/core";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export function GaConsole({className}) {
    const {events} = React.useContext(StoreContext)
    const [open, setOpen] = React.useState(false);

    const [selectedEvent, setSelectedEvent] = React.useState({
        key: 0,
        timestamp: '',
        name: '',
        description: '',
        snippet: ''
    });

    const [value, setValue] = React.useState(0);

    const handleClickOpen = (eventKey) => () => {
        setSelectedEvent(events[events.length - eventKey - 1])
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={[gaConsoleStyle, className].join(" ")}>
            {events.length ? events.map((event) => (
                <div key={event.key} className={eventLine}>
                    <div className={eventTimestamp}>{event.timestamp}</div>
                    <div className={eventName}>
                        <Link
                            to={`https://developers.google.com/gtagjs/reference/ga4-events#${event.name}`}
                            aria-label={`GA4 event reference documentation`}
                            target='_blank'
                        >
                            {event.name}
                        </Link></div>
                    <div
                        className={eventDescription}>{event.description}</div>
                    <div onClick={handleClickOpen(event.key)}
                         className={eventSnippet}>{event.snippet}</div>
                </div>
            )) : <div className={emptyEvents}>Start interacting with the store
                to see Google Analytics eCommerce events here.</div>}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Google Analytics eCommerce
                    event details</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        tabIndex={-1}
                    >
                        <p>{selectedEvent?.timestamp}&nbsp;
                            <Link
                                to={`https://developers.google.com/gtagjs/reference/ga4-events#${selectedEvent?.name}`}
                                aria-label={`GA4 event reference documentation`}
                                target='_blank'
                            >
                                {selectedEvent?.name}
                            </Link> {selectedEvent?.description}</p>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="gtag.js Code"/>
                            <Tab label="Google Tag Manager Code" disabled/>

                        </Tabs>
                        <TabPanel index={0}>
                            Item One
                        </TabPanel>
                        <TextField
                            multiline
                            defaultValue={selectedEvent?.snippet}
                            variant="filled"
                            fullWidth={true}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary">
                        Copy
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
