import React from 'react';
// import "./Custom.css";
// import logo from './logo.svg';
// MEDIUM GUIDE: https://medium.com/@johndyer24/building-a-production-electron-create-react-app-application-with-shared-code-using-electron-builder-c1f70f0e2649
import {
  Grid,
  // Paper,
  TextField,
  Button,
  ButtonGroup,
  IconButton,
  // Select,
  // MenuItem,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Toolbar,
  Card,
  CardContent,
  // CardActions,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@material-ui/core';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from "@material-ui/icons/Close";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "typeface-roboto"


// import {
//     BrowserRouter as Router,
//     Switch,
//     Route,
//     Link
//   } from "react-router-dom";

// import { clipboard } from 'electron'; // MAY BE USING THIS THIS TIME AROUND!

const {
  ipcRenderer,
  clipboard,
  Notification
} = window;

const innerViewTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#1d537a"
    },
    secondary: {
      main: "#d6931f",

    }
  }
});

const cardMargin = 8;
const cardStyle = {
  marginTop: `${cardMargin}px`,
  marginLeft: `${cardMargin}px`,
  marginRight: `${cardMargin}px`
}; const cardStyleLast = {
  margin: `${cardMargin}px`
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Video
      videoTitle: "BABY ",
      videoDescription: "Video provided by InnerView Ultrasound\nMalvern, PA\nPh: (610) 408-9100\nText: (302) 648-2229\nwww.innerviewultrasound.com",
      videoIsPublic: false,
      videoIsReadyToUpload: false,
      // Accordion Control
      expandedAccordion: 1,
      // Processing
      processingStatus: null,
      // Video Preview
      videoPreviewSrc: null,
      // Debugging
      debugModeEnabled: false,
      // YouTube Video
      youtubeVideoUrl: null
    };
  }

  componentDidMount = () => {
    ipcRenderer.on("notification-event", (event, data) => {
      new Notification(data.title, { body: data.body }).onclick = () => { }
    });
    ipcRenderer.on("alert-event", (event, data) => {
      alert(data);
    });
    ipcRenderer.on("processing-event", (event, data) => {
      this.setState({ processingStatus: data });
    });
    ipcRenderer.on("removableStorage-event", (event, data) => {
      this.setState({ removableStorageIsMounted: (data.event === "inserted"), removableStorageType: data.storageType });
    });
    ipcRenderer.on("upload-event", (event, data) => {
      this.setState({ youtubeVideoUrl: data });
    });
  }

  toggleDebugMode = () => {
    if (!this.state.debugModeEnabled) {
      ipcRenderer.send("debug-enable");
    } else {
      ipcRenderer.send("debug-disable");
    }
    this.setState({ debugModeEnabled: !this.state.debugModeEnabled });
  };

  render() {
    return (
      <ThemeProvider theme={innerViewTheme}>
        <AppBar className="drag" position="sticky" color="primary">
          <Toolbar variant="dense">
            <IconButton className="no-drag" edge="start" color="inherit" onContextMenu={this.toggleDebugMode} onClick={() => {
              ipcRenderer.send("button-hide");
            }}>
              <CloseIcon />
            </IconButton>
            <Typography className={"no-select"} variant="h6" style={{ fontFamily: "roboto" }}>InnerView Ultrasound - Media Manager</Typography>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={12}>
            <Card style={cardStyle}>
              <CardContent>




              {/* <Typography variant="h5" color="textPrimary" gutterBottom>Video Settings</Typography>
                <TextField error={!this.state.videoTitle.length} helperText={!this.state.videoTitle.length ? "You must enter a title for the video." : ""} value={this.state.videoTitle} margin={"dense"} onChange={e => {
                  this.setState({ videoTitle: e.target.value.toUpperCase() });
                }} fullWidth label="Title" variant="outlined" />
                <TextField value={this.state.videoDescription} margin={"dense"} onChange={e => {
                  this.setState({ videoDescription: e.target.value });
                }} multiline fullWidth label="Description" variant="outlined" />
                <FormControlLabel control={<Checkbox checked={this.state.videoIsPublic} color="primary" onChange={e => {
                  this.setState({ videoIsPublic: e.target.checked });
                }} />} label={<Typography color="textSecondary">Post video publically on YouTube</Typography>} /> */}





                <Accordion expanded={this.state.expandedAccordion === 1} onChange={() => {
                  this.setState({ expandedAccordion: (this.state.expandedAccordion === 1) ? 0 : 1 });
                }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="accordion1"
                  >
                    <Typography variant="h5" color="textPrimary" gutterBottom>STEP 1: Provide Client Information</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Provide information on the client.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={this.state.expandedAccordion === 2} onChange={() => {
                  this.setState({ expandedAccordion: (this.state.expandedAccordion === 2) ? 0 : 2 });
                }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="accordion2"
                  >
                    <Typography variant="h5" color="textPrimary" gutterBottom>STEP 2: Capture Video/Images</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={this.state.expandedAccordion === 3} onChange={() => {
                  this.setState({ expandedAccordion: (this.state.expandedAccordion === 3) ? 0 : 3 });
                }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="accordion3"
                  >
                    <Typography variant="h5" color="textPrimary" gutterBottom>STEP 3: Share Media from Session</Typography>
                  </AccordionSummary>
                </Accordion>











              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* <Grid container>
          <Grid item xs={7}>
            <Card style={cardStyle}>
              <CardContent>
                <Typography variant="h5" color="textPrimary" gutterBottom>Processing Information</Typography>
                <Typography variant="subtitle2" color="textSecondary"><strong>Removable storage inserted:</strong> {this.state.removableStorageIsMounted ? "Yes" : "No"}</Typography>
                <Typography variant="subtitle2" color="textSecondary"><strong>Storage type:</strong> {Boolean(this.state.removableStorageType) ? this.state.removableStorageType : "(Not inserted)"}</Typography>
                <Typography variant="subtitle2" color="textSecondary"><strong>Processing status:</strong> {this.state.processingStatus ? this.state.processingStatus : "Idle"}</Typography>

                <br hidden={!this.state.debugModeEnabled} />
                <Typography hidden={!this.state.debugModeEnabled} variant="h5" color="textPrimary" gutterBottom>Debug Information</Typography>
                <Typography hidden={!this.state.debugModeEnabled} variant="subtitle2" color="textSecondary"><strong>Window location:</strong> {window.location.href}</Typography>
              </CardContent>
            </Card>
            <Card style={cardStyleLast}>
              <CardContent>
                <Typography variant="h5" color="textPrimary" gutterBottom>Video Settings</Typography>
                <TextField error={!this.state.videoTitle.length} helperText={!this.state.videoTitle.length ? "You must enter a title for the video." : ""} value={this.state.videoTitle} margin={"dense"} onChange={e => {
                  this.setState({ videoTitle: e.target.value.toUpperCase() });
                }} fullWidth label="Title" variant="outlined" />
                <TextField value={this.state.videoDescription} margin={"dense"} onChange={e => {
                  this.setState({ videoDescription: e.target.value });
                }} multiline fullWidth label="Description" variant="outlined" />
                <FormControlLabel control={<Checkbox checked={this.state.videoIsPublic} color="primary" onChange={e => {
                  this.setState({ videoIsPublic: e.target.checked });
                }} />} label={<Typography color="textSecondary">Post video publically on YouTube</Typography>} />
                <br />
                <Button variant="contained" color="secondary" disabled={!this.state.videoIsReadyToUpload} startIcon={<CloudUploadIcon />} onClick={() => {
                  this.setState({ videoIsReadyToUpload: false });
                  ipcRenderer.send("button-upload", {
                    "videoTitle": this.state.videoTitle,
                    "videoDescription": this.state.videoDescription,
                    "videoIsPublic": this.state.videoIsPublic
                  });
                }}>Upload</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={5}>
            <Card style={{ marginTop: `${cardMargin}px`, marginRight: `${cardMargin}px` }} hidden={this.state.videoPreviewSrc}>
              <CardContent>
                <Typography variant="h5" color="textPrimary" gutterBottom>Video Preview</Typography>
                <Typography variant="subtitle2" color="textSecondary">Your video will be displayed here when processing is finished.</Typography>
              </CardContent>
            </Card>
            <Card style={{ marginTop: `${cardMargin}px`, marginRight: `${cardMargin}px` }} hidden={!this.state.videoPreviewSrc} style={{ marginTop: `${cardMargin}px`, marginRight: `${cardMargin}px`, marginBottom: `${cardMargin}px` }}>
              <CardContent>
                <Typography variant="h5" color="textPrimary" gutterBottom>Video Preview</Typography>
              </CardContent>
            </Card>
            <Card style={{ marginTop: `${cardMargin}px`, marginRight: `${cardMargin}px`, marginBottom: `${cardMargin}px` }}>
              <CardContent>
                <Typography variant="h5" color="textPrimary" gutterBottom>Video Information</Typography>
                <Typography variant="subtitle2" color="textSecondary"><strong>Video Title:</strong> {this.state.videoTitle}</Typography>
                <Typography variant="subtitle2" color="textSecondary"><strong>Description:</strong></Typography>
                {this.state.videoDescription.split("\n").map((item, i) => {
                  return <Typography key={i} variant="subtitle2" color="textSecondary">{item.trim() ? item : <br />}</Typography>;
                })}
                <Typography variant="subtitle2" color="textSecondary"><strong>Visibility:</strong> {this.state.videoIsPublic ? "Public" : "Unlisted"}</Typography>
                <Typography variant="subtitle2" color="textSecondary"><strong>Video URL:</strong> {this.state.youtubeVideoUrl ? this.state.youtubeVideoUrl : "(Not available)"}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid> */}
      </ThemeProvider>
    );
  }
}