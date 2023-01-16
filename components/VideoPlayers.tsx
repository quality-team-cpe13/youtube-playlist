import { playlistItem } from '@/contexts/PlaylistContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube';
import { Props } from './Navbar';

const styles = {
    playingStyle: {
        top: "-104px"
    },
    container: {
        top: "-104px",
        height: "calc(100vh - 5rem)"
    }
}

const VideoPlayers = ({ playlist, handleSetPlaylist }: Props) => {
    const [playing, setPlaying] = useState<playlistItem>();

    const onPlayerEnd: YouTubeProps['onEnd'] = (event: YouTubeEvent) => {
        setPlaying(undefined);
        genPlaying();
    }

    useEffect(() => {
        genPlaying();
    }, [])


    const genPlaying = () => {
        if (playlist.length > 0 && !playing) {
            const firstPlaylist = playlist.pop();
            if (firstPlaylist) setPlaying(firstPlaylist);
        }
    }

    const opts: YouTubeProps['opts'] = {
        height: '700px',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    return (
        <>
            <div className="flex flex-row w-full h-full">
                <div className="basis-9/12 p-4">
                    {playing
                        ? <YouTube videoId={playing?.id} opts={opts} onEnd={onPlayerEnd} />
                        : <div className='bg-zinc-800 h-full text-white flex justify-center items-center'><span>No video</span></div>
                    }
                </div>
                <div className="basis-1/4 p-4">
                    {playing ?
                        <div>
                            <div className='relative flex justify-center items-center w-full h-24 m-2 p-2 z-10 bg-white opacity-70 text-xl font-bold'>Playing</div>
                            <div className="relative flex flex-row w-full h-24 bg-white m-2 p-2 rounded opacity-50 overflow-y-hidden" style={styles.playingStyle}>
                                <div className="basis">
                                    <Image
                                        src={playing.imgUrl}
                                        alt="Picture of the song"
                                        width={150}
                                        height={150}
                                    />
                                </div>
                                <div className="basis text-left pl-1 max-w-xs">
                                    <span>{playing.title}</span>
                                </div>
                            </div>
                        </div>
                        : undefined}
                    <div style={styles.container}>
                        <ReactSortable
                            dragClass="sortableDrag"
                            list={playlist}
                            setList={handleSetPlaylist}
                            easing="ease-out"
                        >
                            {playlist.map((item, i) => (
                                <div key={i} className="flex flex-row w-full bg-white m-2 p-2 rounded cursor-row-resize">
                                    <div className="basis">
                                        <Image
                                            src={item.imgUrl}
                                            alt="Picture of the song"
                                            width={150}
                                            height={150}
                                        />
                                    </div>
                                    <div className="basis text-left pl-1 max-w-[50%] max-h-40 overflow-hidden">
                                        <span>{item.title}</span>
                                    </div>
                                </div>
                            ))}
                        </ReactSortable>
                        <div>test</div>
                        {playlist.map((item, i) => (
                            <div key={i}>{item.title}</div>
                        ))

                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default VideoPlayers;