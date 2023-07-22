import { useState, useRef, useEffect } from 'react';
import beep from "./assets/beep.wav";


const TimerClock = () => {
    const defaultBreakLength = 5;
    const defaultSessionLength = 25;
    const defaultLabel = "Focus!"
    const defaultRunningState = false;
    const intervalRef = useRef(0);
    const audioElement = useRef<HTMLAudioElement>(null);
    const startBtnRef = useRef<HTMLButtonElement>(null);

    const [breakLength, setBreakLength] = useState(defaultBreakLength);
    const [sessionLength, setSessionLength] = useState(defaultSessionLength);
    const [timerLabel, setTimerLabel] = useState(defaultLabel);
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(defaultSessionLength * 60 * 1000);


    useEffect(() => {
        // Update timeLeft whenever sessionLength changes
        setTimeLeft(sessionLength * 60 * 1000);
      }, [sessionLength]);


    if (timeLeft < 0) {
        
        void handlePlayAudio();

        if (timerLabel === "Focus!") {
            setTimerLabel("Now take a break!");
            setTimeLeft(breakLength * 60 * 1000);
        } else {
            setTimerLabel("Focus!");
            setTimeLeft(sessionLength * 60 * 1000);
        }
    }


    async function handlePlayAudio() {
        if (audioElement.current) {
            try {
                await audioElement.current.play();
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        }
    }

    function resetTimer() {
        setBreakLength(defaultBreakLength);
        setSessionLength(defaultSessionLength);
        setTimerLabel(defaultLabel);
        setIsRunning(defaultRunningState);
        clearInterval(intervalRef.current); // Stop the countdown
        setTimeLeft(sessionLength * 60 * 1000);

        if (audioElement.current != null) {
            audioElement.current.pause();
            audioElement.current.currentTime = 0;
        }
    }


    function shakePlayBtn() {

    
        if (startBtnRef.current != null){
            startBtnRef.current.classList.remove("shake-anim");
      
            setTimeout(() => { // // Trigger reflow to reset the animation
                startBtnRef?.current?.classList.add("shake-anim");
            }, 10);
        }
    }


    function handleSessionClick(deviation: number) {
        
        if (isRunning) { // Do nothing if timer is running
            shakePlayBtn();
            return
        } 

        setSessionLength(prevSessionLength => {
            const newValue = prevSessionLength + deviation
            if (newValue > 60 || newValue <= 0) { // I should not be able to set a session or break length to <= 0. I should not be able to set a session or break length to > 60.
                return prevSessionLength // no changes
            } else {
                return newValue // update value
            }
        });
    }
    

    function handleBreakClick(deviation: number) {

        // Do nothing if timer is running
        if (isRunning) {
            shakePlayBtn();
            return
        } 

        setBreakLength(prevBreakLength => {
            const newValue = prevBreakLength + deviation
            if (newValue > 60 || newValue <=0) { // I should not be able to set a session or break length to <= 0. I should not be able to set a session or break length to > 60.
                return prevBreakLength // no changes
            } else {
                return newValue // update value
            }
        });
    }


    function handleStartStop() {

        if (!isRunning) { // If timer is not yet running, start the timer
            intervalRef.current = setInterval(deductOneSecond , 1000);
        } else { // If timer is not yet running, start the timer
            clearInterval(intervalRef.current);
        }

        setIsRunning(prevIsRunning => !prevIsRunning); // Toggle the running state
    }


    function deductOneSecond() {
        setTimeLeft(prevTimeLeft => {
            return prevTimeLeft - 1000
        });
    }


    function formatTime (milliseconds: number) {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }


    return  (
        <div>
            <div id='session-label'>Session Length</div> 
            <div id='session-length'>{sessionLength}</div>
            <button id='session-increment' onClick={() => handleSessionClick(1)}><span className="material-symbols-outlined">expand_less</span></button>
            <button id='session-decrement' onClick={() => handleSessionClick(-1)}><span className="material-symbols-outlined">expand_more</span></button>

            <div id='break-label'>Break Length</div>
            <div id='break-length'>{breakLength}</div>
            <button id='break-increment' onClick={() => handleBreakClick(1)}><span className="material-symbols-outlined">expand_less</span></button>
            <button id='break-decrement' onClick={() => handleBreakClick(-1)}><span className="material-symbols-outlined">expand_more</span></button>

            <div id='timer-label'>{timerLabel}</div>
            <div id='time-left'>{formatTime(timeLeft)}</div>
            <button id='start_stop' onClick={handleStartStop} ref={startBtnRef}><span className="material-symbols-outlined">{isRunning ? 'pause_circle' : 'play_circle'}</span></button>
            <button id='reset' onClick={resetTimer}><span className="material-symbols-outlined">restart_alt</span></button>
            <audio id='beep' ref={audioElement} src={beep}></audio>
        </div>
    );
};

export default TimerClock;