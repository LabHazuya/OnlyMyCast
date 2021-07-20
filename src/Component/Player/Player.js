//react
import React, { useState, createRef, useEffect } from 'react';
//ui
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import Toolbar from '@material-ui/core/Toolbar'
import Avatar from '@material-ui/core/Avatar';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import Tooltip from '@material-ui/core/Tooltip';
import ReactPlayer from 'react-player'
import Typography from '@material-ui/core/Typography';
import Replay10Icon from '@material-ui/icons/Replay10';
import Forward10Icon from '@material-ui/icons/Forward10';
import LinearProgress from '@material-ui/core/LinearProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';


const useStyles = makeStyles((theme)=>({
  root: {
    width: "100%",
    position:"absolute",
    bottom:0
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    alignItems:"center"
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },  
  menuButton: {
    margin: theme.spacing(1),
  },
  epTitleBox:{
    width: "150px",
    overflow: "hidden",
    margin: theme.spacing(1),
  },
  epTitle:{
    display: "inline-block",
    whiteSpace: "nowrap",
    animation: "floatText 15s infinite linear",
    marginTop: "10px",
  },
}));


const Player = (props) => {
    const classes = useStyles();
    const [playState, setPlayState] = useState(true);
    const [playSec, setPlaySec] = useState(0);
    const [duration, setDuration] = useState(0);
    const playerRef = createRef();
    const [ready, setReady] = useState(false);
    const [singleName, setSingleName] = useState();
    const [podcastName, setPodcastName] = useState();
    const [playBackRate, setPlayBackRate] = useState(1);
    const [loadedRate, setLoadedRate] = useState();

    useEffect(
        ()=>{
            setReady(false);
            setPlayState(true);
            setSingleName(props.singleName);
            setPodcastName(props.podcastName)
        },[props.url]
    )

    const handleNextTenClick= (e)=>{
        playerRef.current.seekTo(playSec + 10)
    }

    const handleBackTenClick=(e)=>{
        playerRef.current.seekTo(playSec - 10)
    }

    const handlePlayClick=()=>{
        setPlayState(!playState);
    }

    const handlePauseClick=()=>{
        setPlayState(!playState);
    }

    const changePlayBackRate = (e) => {
        setPlayBackRate(e.target.value);
    }

    const setPlayerOnSeek = (e, newValue) => {
        playerRef.current.seekTo(newValue/100, "fraction");
    }

    const setPlayerSec = (e, newValue) => {
        setPlaySec(newValue/100*duration);
    }

    return (
        <>
        {props.children}
        {
        (props.url !== undefined && props.url !== "") &&
        <>
        <style>
            {`
                @keyframes floatText {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(-100%);
                    }
                }
            }`
            }
        </style>
            <ReactPlayer 
                ref={playerRef}
                url={props.url}
                onReady={()=>setReady(true)}
                onPause={()=>setPlayState(false)}
                onPlay={()=>setPlayState(true)}
                width="0"
                height="0"
                onProgress={(p)=>{
                    setPlaySec(p.playedSeconds);
                    setLoadedRate(p.loaded);
                }}
                onDuration={(d)=>(setDuration(d))}
                volume={1}
                playing={playState}
                config={{ file:{ forceAudio:true } }}
                playbackRate={playBackRate}
            />
            <AppBar position="fixed" color="inherit" className={classes.appBar}>
            { !ready ? <LinearProgress style={{width:"100%"}}/> : 
                <Slider 
                style={{marginTop: -15, marginBottom:-15}} 
                step={1} 
                min={0} 
                max={100} 
                onChangeCommitted={(e, newValue)=>{setPlayerOnSeek(e, newValue)}} 
                defaultValue={0} 
                onChange={(e, newValue)=>{setPlayerSec(e, newValue)}} 
                value={playSec!==undefined ? (playSec/duration)*100:0}/>}
                <Toolbar variant="dense">
                    <Avatar style={{ marginTop: "10px" } } variant="rounded" className={classes.large} alt={podcastName} src={props.coverUrl} />
                    <div className={classes.epTitleBox}>
                        <Typography className={classes.epTitle} variant="subtitle2">
                            {podcastName} - {singleName}
                        </Typography>     
                    </div>
                    <Typography style={{ marginTop: "10px" } } variant="subtitle2">
                        ({ "剩" + parseInt(((parseInt(duration, 10) - parseInt(playSec, 10))/60)) + ":" + Math.ceil(((parseInt(duration, 10) - parseInt(playSec, 10))%60))})
                    </Typography>
                </Toolbar>
                <Toolbar variant="dense">
                    <Tooltip onClick={ handleBackTenClick } title="倒退10秒" aria-label="back10s">
                        <IconButton className={classes.menuButton} edge="end" color="inherit">
                            <Replay10Icon />
                        </IconButton>  
                    </Tooltip>
                    { (playState) ? 
                    <Tooltip onClick={ handlePauseClick } title="暫停" aria-label="pause">
                        <IconButton className={classes.menuButton}  color="inherit" size="small">
                            <PauseCircleFilledIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    : 
                    <Tooltip onClick={ handlePlayClick } title="播放" aria-label="play">
                        <IconButton className={classes.menuButton}  color="inherit" size="small">
                            <PlayCircleFilledIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    }
                    <Tooltip onClick={ handleNextTenClick } title="向前10秒" aria-label="next10s">
                        <IconButton className={classes.menuButton}  edge="end" color="inherit">
                            <Forward10Icon />
                        </IconButton>
                    </Tooltip>
                    <Select
                    value={playBackRate}
                    onChange={(e)=>{changePlayBackRate(e)}}
                    >
                        <MenuItem value={0.5}>x0.5</MenuItem>
                        <MenuItem value={1}>x1.0</MenuItem>
                        <MenuItem value={1.5}>x1.5</MenuItem>
                        <MenuItem value={2.0}>x2.0</MenuItem>
                    </Select>                    
                </Toolbar>
            </AppBar>
        </>
        }
        </>
    );
    }
export default Player;