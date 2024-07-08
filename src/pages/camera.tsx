import { Box, Button, IconButton, Stack } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import api, { FacingMode, PhotoFormat, PhotoFrame, PhotoQuality, ZMACamera } from 'zmp-sdk';
import { EventName, StreamType, closeApp, configAppView, events } from 'zmp-sdk/apis';
import { Header } from 'zmp-ui';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useNavigate } from 'react-router-dom';
import eventEmitter from '../utils/event-emitter';
let timeout;
const CameraPage = () => {
    const cameraRef = useRef<ZMACamera | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [data, setData] = useState('');
    const navigate = useNavigate();
    const [vh, setVh] = useState(window.innerHeight);

    useEffect(() => {
        const updateVh = () => {
            setVh(window.innerHeight);
        };

        window.addEventListener('resize', updateVh);

        return () => window.removeEventListener('resize', updateVh);
    }, []);

    useEffect(() => {
        events.on(EventName.AppPaused, () => {
            console.log('App paused');
        });
        events.on(EventName.AppResumed, async () => {
            console.log('App resumed');
            await onStart();
        });
        return () => {
            events.removeAllListeners(EventName.AppPaused);
            events.removeAllListeners(EventName.AppResumed);
        };
    }, []);

    useEffect(() => {
        const videoElement = videoRef.current;
        console.log(videoElement, 'videoElement');

        if (!videoElement) {
            console.log('Media component not ready');
            return;
        }
        if (!cameraRef.current) {
            cameraRef.current = api.createCameraContext({
                videoElement: videoElement,
                mediaConstraints: { facingMode: FacingMode.BACK, audio: false, height: vh }
            });
            onStart();
        }

        return () => {
            console.log('unmount');
            const camera = cameraRef.current;
            camera?.stop();
        };
    }, []);

    const onStart = async () => {
        const camera = cameraRef.current;
        await camera
            ?.start()
            .then((t) => console.log(t, 'start'))
            .catch((e) =>
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Vui lòng khởi động lại app!',
                    icon: 'error',
                    customClass: {
                        container: 'my-swal'
                    },
                    confirmButtonColor: '#3085d6'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await closeApp({});
                    }
                })
            );
    };

    // useEffect(() => {
    //     timeout = setTimeout(() => {
    //         onStart();
    //     }, 500);
    //     return () => {
    //         clearTimeout(timeout);
    //     };
    // }, []);

    useEffect(() => {
        configAppView({
            hideIOSSafeAreaBottom: true
        });
    }, []);

    const onTakePhoto = async () => {
        let result: PhotoFrame = cameraRef.current?.takePhoto({
            quality: PhotoQuality.HIGH,
            format: PhotoFormat.JPEG,
            minScreenshotHeight: 1000
        });
        if (result) {
            setData(result.data);
            cameraRef.current?.stop();
        } else {
            console.log('No data');
        }
    };

    const handleClick = () => {
        eventEmitter.emit('QR_CODE_CHANGED', { data });
        navigate(-1);
    };

    const onRetake = async () => {
        if (cameraRef.current) {
            await cameraRef.current?.start();
        }
        setData('');
    };

    return (
        <Box display={'flex'} flexDirection={'column'} height={'100vh'}>
            <Header title="Chụp ảnh" textColor="white" style={{ background: 'transparent', position: 'absolute' }} />
            {Boolean(data) ? (
                <Box>
                    <Stack
                        direction={'row'}
                        sx={{
                            zIndex: 999,
                            position: 'absolute',
                            bottom: '5%',
                            left: '50%',
                            transform: 'translate(-50%, 0)',
                            width: '90%'
                        }}
                        spacing={2}
                        flex={1}
                    >
                        <Button size="large" fullWidth variant="outlined" onClick={onRetake}>{`Chụp lại`}</Button>
                        <Button size="large" fullWidth variant="contained" onClick={handleClick}>{`OK`}</Button>
                    </Stack>
                    <img src={data} alt={''} style={{ width: 'auto', height: 'auto', objectFit: 'fill', position: 'fixed' }} />
                </Box>
            ) : (
                <Box>
                    <IconButton
                        size="large"
                        onClick={onTakePhoto}
                        sx={{
                            zIndex: 999,
                            position: 'absolute',
                            bottom: '5%',
                            left: '50%',
                            transform: 'translate(-50%, 0)'
                        }}
                    >
                        <CameraAltIcon sx={{ width: 60, height: 60, color: 'white' }} />
                    </IconButton>
                </Box>
            )}

            <video style={{ position: 'fixed', width: 'auto', height: 'auto' }} ref={videoRef} muted playsInline webkit-playsinline />
        </Box>
    );
};

export default CameraPage;
