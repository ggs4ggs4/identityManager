import React, {useState, useLayoutEffect} from 'react'
import {ReactSession} from 'react-client-session';
import { toast } from 'react-hot-toast';
import { lastHumanVerified, saveHumanVerification } from '../blockchain/interact';
const HumanVerification = () => {

    const [verified, setVerified] = useState(0);

    useLayoutEffect(() => {
      (async () => {
        try
        {
            var latest = await lastHumanVerified(ReactSession.get('adhaar'));
            if(!latest)
                setVerified(-1);
            else
            {
                var date = new Date(1970, 0, 1);
                date.setSeconds(latest);
                var today = new Date();
                var Difference_In_Time = today.getTime() - date.getTime();
                var Difference_In_Days = parseInt(Difference_In_Time / (1000 * 3600 * 24));
                if(Difference_In_Days >= 100)
                    setVerified(0);
                else
                    setVerified(100-Difference_In_Days);
            }
        }
        catch(err)
        {
            console.log(err);
            setVerified(-1);
        }
      })();
    }, [])

    const verifyHuman = async () => {
        // Link with Python API 
        var result = true;
        if(result)
        {
            var saved = await saveHumanVerification(ReactSession.get('adhaar'));
            if(saved)
            {
                toast.success('Human Verification Successful!');
                setTimeout(() => {
                    window.location.href = '/profile';
                }, 1000);
            }
            else
            {
                toast.error('Human Verification Failed');
                setTimeout(() => {
                    window.location.href = '/profile';
                }, 2000);
            }
        }
        else
        {
            toast.error('Human Verification Failed');
            setTimeout(() => {
                window.location.href = '/profile';
            }, 1000);
        }
    }

  return (
    <div className='w-100 flex flex-col min-h-[70vh]'>
        <span className='text-2xl text-center p-5'>Human Verification</span>
        {verified > 0 && (
            <>
            <progress className="progress progress-warning w-100 my-5" value={verified} max="100"></progress>
            <span>{verified} days remaining before next verification.</span>
            </>
        )}
        {verified <= 0 && (
            <>
            <p className='px-10'>Human verification pending! Complete this to enable usage of identity across platforms.</p>
            <button type='button' className='btn btn-primary w-[20vw] mx-auto m-5' onClick={verifyHuman}>Start human verification</button>
            </>
        )}
    </div>
  )
}

export default HumanVerification