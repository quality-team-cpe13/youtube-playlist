import { playlistItem } from '@/contexts/PlaylistContext';
import { faChevronLeft, faChevronRight, faForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube';

export default function VideoPlayer() {
    const KEY = "AIzaSyBaRLJ1y3S9wKpnRfXhHOMVRAfyLHo4XjQ";

    const [item, setItem] = useState<playlistItem | undefined>();
    const [search, setSearch] = useState('');
    const [playlist, setPlaylist] = useState<playlistItem[]>([]);
    const [playing, setPlaying] = useState<playlistItem>();
    const [isExpand, setIsExpand] = useState(false)

    const styles = {
        input: {
            maxHeight: "35px"
        },
        playingStyle: {
            top: "-104px"
        },
        container: {
            top: playing ? "-104px" : "0",
            height: "calc(100vh - 5rem)",
            maxHeight: "587px"
        },
        video: {
            width: isExpand ? "100%" : "75%",
            padding: "1rem"
        },
        videoList: {
            width: isExpand ? "0" : "25%",
            padding: isExpand ? "0" : "1rem"
        }
    }

    const handleSetPlaylist = (itemList: playlistItem[]) => {
        setPlaylist(itemList);
    }

    useEffect(() => {
        genPlaying()
    }, [playing])

    async function getInfoYoutube(id: string) {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${KEY}&part=snippet`);
        const data = await res.json();
        if (data?.items?.length > 0) {
            setItem({
                id: data?.items[0]?.id,
                title: data?.items[0]?.snippet?.title,
                imgUrl: data?.items[0]?.snippet?.thumbnails?.medium?.url
            })
        } else {
            setItem(undefined);
        }
    }

    const handleInputSearch = (event: React.FormEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value
        setSearch(value);
        const id = value.split("v=")[1]?.split("&")[0];
        if (id) {
            getInfoYoutube(id)
        } else {
            setItem(undefined);
        }
    }

    const handleAddItem = () => {
        let newPlaylist = playlist
        if (item) {
            newPlaylist.push(item)
            handleSetPlaylist(newPlaylist)
            genPlaying()
        }
        setSearch('');
        setItem(undefined);
    }


    const onPlayerEnd: YouTubeProps['onEnd'] = (event: YouTubeEvent) => {
        setPlaying(undefined);
    }

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

    const handleClickExpan = () => {
        setIsExpand(!isExpand);
    }

    const handleClickSkip = () => {
        setPlaying(undefined);
    }

    return (
        <div className='bg-zinc-700'>
            {/* ================================= navbar ================================= */}
            <nav className='w-full flex items-center flex-wrap bg-black p-3 h-14 text-white'>
                <div className="flex flex-row w-full">
                    <div className="basis-9/12 text-right">
                        <input className="w-1/2 h-full rounded-sm bg-zinc-800 text-white p-0.5" style={styles.input} type="text" placeholder="Enter YouTube URL here" value={search} onChange={handleInputSearch} />
                        {item ?
                            <div className="relative w-max p-2 top-2 left-2/4 bg-zinc-500 z-20 backdrop-opacity-50">
                                <div className="flex flex-row w-full cursor-pointer" onClick={handleAddItem}>
                                    <div className="basis">
                                        <Image
                                            src={item.imgUrl}
                                            alt="Picture of the song"
                                            width={150}
                                            height={150}
                                        />
                                    </div>
                                    <div className="basis text-left pl-1 max-w-xs">
                                        <span>{item.title}</span>
                                    </div>
                                </div>
                            </div>
                            : undefined}
                    </div>
                    <div className="basis-1/4">
                        <div className='flex justify-end'>
                            <button
                                className='w-8 h-8 mr-1 font-bold text-white bg-zinc-600 rounded-full hover:bg-zinc-700'
                                onClick={handleClickSkip}
                            >
                                <FontAwesomeIcon icon={faForward} />
                            </button>
                            <button
                                className='w-8 h-8 font-bold text-white bg-zinc-600 rounded-full hover:bg-zinc-700'
                                onClick={handleClickExpan}
                            >
                                {!isExpand ? <FontAwesomeIcon icon={faChevronRight} /> : <FontAwesomeIcon icon={faChevronLeft} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {/* ========================== content ==================== */}
            <div className="flex flex-row w-full h-full">
                <div style={styles.video}>
                    {playing
                        ? <YouTube videoId={playing?.id} opts={opts} onEnd={onPlayerEnd} />
                        : <div className='bg-zinc-800 h-full text-white flex justify-center items-center'><span>No video</span></div>
                    }
                </div>
                <div style={styles.videoList}>
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
                    <div className='relative' style={styles.container}>
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
                    </div>
                </div>
            </div>
        </div>
    )
}
