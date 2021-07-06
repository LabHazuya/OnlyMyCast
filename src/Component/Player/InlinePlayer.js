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
import Paper from '@material-ui/core/Paper';

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
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginTop: theme.spacing(2)
  },  
  menuButton: {
    margin: theme.spacing(1),
  },
}));

const InlinePlayer = (props) => {
    const classes = useStyles();
    const [playState, setPlayState] = useState(true);
    const [playSec, setPlaySec] = useState(0);
    const [duration, setDuration] = useState(0);
    const playerRef = createRef();
    const [ready, setReady] = useState(false);

    useEffect(
        ()=>{
            setReady(false);
            setPlayState(true);
        },[props.url]
    )

    useEffect(
        ()=>{props.returnDuration(duration);}
    )
    

    const handleNextTenClick= (e)=>{
        playerRef.current.seekTo(playSec.playedSeconds + 10)
    }

    const handleBackTenClick=(e)=>{
        playerRef.current.seekTo(playSec.playedSeconds - 10)
    }

    const handlePlayClick=()=>{
        setPlayState(!playState);
    }

    const handlePauseClick=()=>{
        setPlayState(!playState);
    }

    return (
        <>
        {props.children}
        {
        (props.url !== undefined && props.url !== "") &&
        <>
            <ReactPlayer 
                ref={playerRef}
                url={props.url}
                onReady={()=>setReady(true)}
                onPause={()=>setPlayState(false)}
                onPlay={()=>setPlayState(true)}
                width="0"
                height="0"
                onProgress={(p)=>(setPlaySec(p))}
                onDuration={(d)=>(setDuration(d))}
                volume={1}
                playing={playState}
                config={{ file:{ forceAudio:true } }}
            />
            { !ready && <LinearProgress style={{width:"100%"}}/>}
            
            <Paper variant="outlined" >
                <Typography className="playTime" style={{ marginTop: "10px" } } variant="subtitle2">
                    { "剩" + parseInt(((parseInt(duration, 10) - parseInt(playSec.playedSeconds, 10))/60)) + "分" + Math.ceil(((parseInt(duration, 10) - parseInt(playSec.playedSeconds, 10))%60)) +"秒"}
                    { "，總長" + parseInt(duration/60, 10) + "分" + Math.ceil(parseInt(duration, 10)%60) +"秒"}
                    {"，總容量：" + Math.round((props.fileSize/1024/1024)*100)/100 + "MB"}
                </Typography>
                <Tooltip onClick={ handleBackTenClick } title="倒退10秒" aria-label="back10s">
                    <IconButton className={classes.menuButton} edge="end" color="inherit">
                        <Replay10Icon />
                    </IconButton>  
                </Tooltip>
                { (playState) ? 
                <Tooltip onClick={ handlePauseClick } title="暫停" aria-label="pause">
                    <IconButton className={classes.menuButton}  color="inherit">
                        <PauseCircleFilledIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
                : 
                <Tooltip onClick={ handlePlayClick } title="播放" aria-label="play">
                    <IconButton className={classes.menuButton}  color="inherit">
                        <PlayCircleFilledIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
                }
                <Tooltip onClick={ handleNextTenClick } title="向前10秒" aria-label="next10s">
                    <IconButton className={classes.menuButton}  edge="end" color="inherit">
                        <Forward10Icon />
                    </IconButton>
                </Tooltip>
            </Paper>
        </>
        }
        </>
    );
    }
export default InlinePlayer;