import React from 'react';
// import "./Custom.css";
// import logo from './logo.svg';
// MEDIUM GUIDE: https://medium.com/@johndyer24/building-a-production-electron-create-react-app-application-with-shared-code-using-electron-builder-c1f70f0e2649
// Also check out his github if this project gets screwed up
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
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from "@material-ui/icons/Close";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "typeface-roboto"
// import ReactPlayer from "react-player";
import "video-react/dist/video-react.css";
import { Player, BigPlayButton } from "video-react";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

// import { clipboard } from 'electron';

const {
    ipcRenderer,
    clipboard,
    Notification
} = window;

// const IFTTT_KEY = "dwl7jute0JZoYsaUx3fRsqpZ_0d9PR3pF8bjTTt37aB"; // TEST KEY
const IFTTT_KEY = "RLR-Vg87HK_055uHEhUpU"; // PROD KEY

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
            // Removable Storage
            removableStorageIsMounted: false,
            removableStorageType: "",
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

    componentDidMount = ()=> {
        ipcRenderer.on("notification-event", (event, data)=>{
            new Notification(data.title, {body: data.body}).onclick=()=>{}
        });
        ipcRenderer.on("alert-event", (event, data)=>{
            alert(data);
        });
        ipcRenderer.on("iosNotificationCopying-event", (event, data)=>{
            fetch(`https://maker.ifttt.com/trigger/iuvu-copying-complete/with/key/${IFTTT_KEY}`);
        });
        ipcRenderer.on("iosNotificationProcessing-event", (event, data)=>{
            fetch(`https://maker.ifttt.com/trigger/iuvu-processing-complete/with/key/${IFTTT_KEY}`);
        });
        ipcRenderer.on("processing-event", (event, data)=>{
            this.setState({processingStatus: data});
        });
        ipcRenderer.on("removableStorage-event", (event, data)=>{
            this.setState({removableStorageIsMounted: (data.event === "inserted"), removableStorageType: data.storageType});
        });
        ipcRenderer.on("uploadButton-event", (event, data)=>{
            this.setState({videoIsReadyToUpload: data});
        });
        ipcRenderer.on("video-event", (event, data)=>{
            this.setState({videoPreviewSrc: data});
        });
        ipcRenderer.on("upload-event", (event, data)=>{
            this.setState({youtubeVideoUrl: data});
        });
    }

    toggleDebugMode = ()=>{
        if (!this.state.debugModeEnabled) {
            ipcRenderer.send("debug-enable");
        } else {
            ipcRenderer.send("debug-disable");
        }
        this.setState({debugModeEnabled: !this.state.debugModeEnabled});
    };

    render() {
        return (
            <ThemeProvider theme={innerViewTheme}>
                <AppBar className="drag" position={"sticky"} color={"primary"}>
                    <Toolbar variant="dense">
                        <IconButton className="no-drag" edge="start" color="inherit" onContextMenu={this.toggleDebugMode} onClick={()=>{
                            ipcRenderer.send("button-hide");
                        }}>
                            <CloseIcon/>
                        </IconButton>
                        <Typography className={"no-select"} variant="h6" style={{fontFamily: "roboto"}}>InnerView Ultrasound - Video Uploader</Typography>
                    </Toolbar>
                </AppBar>
                <Grid container>
                    <Grid item xs={7}>
                        <Card style={cardStyle}>
                            <CardContent>
                                <Typography variant="h5" color="textPrimary" gutterBottom>Processing Information</Typography>
                                <Typography variant="subtitle2" color="textSecondary"><strong>Removable storage inserted:</strong> {this.state.removableStorageIsMounted ? "Yes" : "No"}</Typography>
                                <Typography variant="subtitle2" color="textSecondary"><strong>Storage type:</strong> {Boolean(this.state.removableStorageType) ? this.state.removableStorageType : "(Not inserted)"}</Typography>
                                <Typography variant="subtitle2" color="textSecondary"><strong>Processing status:</strong> {this.state.processingStatus ? this.state.processingStatus : "Idle"}</Typography>

                                <br hidden={!this.state.debugModeEnabled}/>
                                <Typography hidden={!this.state.debugModeEnabled} variant="h5" color="textPrimary" gutterBottom>Debug Information</Typography>
                                <Typography hidden={!this.state.debugModeEnabled} variant="subtitle2" color="textSecondary"><strong>Window location:</strong> {window.location.href}</Typography>
                            </CardContent>
                        </Card>
                        <Card style={cardStyleLast}>
                            <CardContent>
                                <Typography variant="h5" color="textPrimary" gutterBottom>Video Settings</Typography>
                                <TextField error={!this.state.videoTitle.length} helperText={!this.state.videoTitle.length ? "You must enter a title for the video.":""} value={this.state.videoTitle} margin={"dense"} onChange={e=>{
                                        this.setState({videoTitle: e.target.value.toUpperCase()});
                                        // console.log(e.target.value);
                                    }} fullWidth label="Title" variant="outlined" />
                                <TextField value={this.state.videoDescription} margin={"dense"} onChange={e=>{
                                        this.setState({videoDescription: e.target.value});
                                        // console.log(e.target.value);
                                    }} multiline fullWidth label="Description" variant="outlined" />
                                <FormControlLabel control={<Checkbox checked={this.state.videoIsPublic} color="primary" onChange={e=>{
                                        this.setState({videoIsPublic: e.target.checked});
                                        // console.log(e.target.checked);
                                    }} />} label={<Typography color="textSecondary">Post video publically on YouTube</Typography>} />
                                {/* <ButtonGroup color="primary" size="large" variant="outlined" >
                                    <Button onClick={()=>{
                                        ipcRenderer.send("channel1", "TEST MESSAGE");
                                    }}>SEND TEST MESSAGE</Button>
                                    <Button onClick={()=>{
                                        ipcRenderer.send("button-eject", "drutil tray eject");
                                    }}>Eject Disk</Button>
                                </ButtonGroup>
                                <br/>
                                <Button color="primary" variant="outlined">Test Button<h4>text</h4><CircularProgress/></Button> */}
                                <br/>
                                <Button variant="contained" color="secondary" disabled={!this.state.videoIsReadyToUpload} startIcon={<CloudUploadIcon />} onClick={()=>{
                                    this.setState({videoIsReadyToUpload: false});
                                    ipcRenderer.send("button-upload", {
                                        "videoTitle": this.state.videoTitle,
                                        "videoDescription": this.state.videoDescription,
                                        "videoIsPublic": this.state.videoIsPublic
                                    });
                                }}>Upload</Button>
                            </CardContent>
                        </Card>
                        {/* <Button variant="outlined" color="secondary" onClick={()=>{
                            ipcRenderer.send("button-test-copying");
                        }}>Test Copying</Button>
                        <Button variant="outlined" color="secondary" onClick={()=>{
                            ipcRenderer.send("button-test-processing");
                        }}>Test Processing</Button>
                        <Button variant="outlined" color="secondary" onClick={()=>{
                            ipcRenderer.send("button-loadVideoSrc");
                        }}>Load Video Source</Button>
                        <Button variant="outlined" color="secondary" onClick={()=>{
                            ipcRenderer.send("button-clearVideoSrc");
                        }}>Clear Video Source</Button> */}
                    </Grid>
                    <Grid item xs={5}>
                        <Card style={{marginTop: `${cardMargin}px`, marginRight: `${cardMargin}px`}} hidden={this.state.videoPreviewSrc}>
                            <CardContent>
                                <Typography variant="h5" color="textPrimary" gutterBottom>Video Preview</Typography>
                                <Typography variant="subtitle2" color="textSecondary">Your video will be displayed here when processing is finished.</Typography>
                            </CardContent>
                        </Card>
                        <Card style={{marginTop: `${cardMargin}px`, marginRight: `${cardMargin}px`}} hidden={!this.state.videoPreviewSrc} style={{marginTop: `${cardMargin}px`, marginRight: `${cardMargin}px`, marginBottom: `${cardMargin}px`}}>
                            <CardContent>
                                <Typography variant="h5" color="textPrimary" gutterBottom>Video Preview</Typography>
                                {/* <ReactPlayer url={this.state.videoPreviewSrc} loop volume={1} playing controls width="100%" height="100%"/> */}
                                <Player muted={!this.state.videoPreviewSrc} src={this.state.videoPreviewSrc} autoPlay loop>
                                    <BigPlayButton position="center"/>
                                </Player>
                            </CardContent>
                        </Card>
                        <Card style={{marginTop: `${cardMargin}px`, marginRight: `${cardMargin}px`, marginBottom: `${cardMargin}px`}}>
                            <CardContent>
                            <Typography variant="h5" color="textPrimary" gutterBottom>Video Information</Typography>
                            <Typography variant="subtitle2" color="textSecondary"><strong>Video Title:</strong> {this.state.videoTitle}</Typography>
                            <Typography variant="subtitle2" color="textSecondary"><strong>Description:</strong></Typography>
                            {this.state.videoDescription.split("\n").map((item, i)=> {
                                return <Typography key={i} variant="subtitle2" color="textSecondary">{item.trim() ? item : <br/>}</Typography>;
                            })}
                            <Typography variant="subtitle2" color="textSecondary"><strong>Visibility:</strong> {this.state.videoIsPublic ? "Public" : "Unlisted"}</Typography>
                            <Typography variant="subtitle2" color="textSecondary"><strong>Video URL:</strong> {this.state.youtubeVideoUrl ? this.state.youtubeVideoUrl : "(Not available)"}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}