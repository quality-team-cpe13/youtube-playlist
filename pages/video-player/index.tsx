import Navbar from '@/components/Navbar'
import VideoPlayers from '@/components/VideoPlayers'
import { playlistItem } from '@/contexts/PlaylistContext';
import React, { useCallback, useState } from 'react'

export default function VideoPlayer() {
    const [playlist, setPlaylist] = useState<playlistItem[]>([]);

    // const handleSetPlaylist = (itemList: playlistItem[]) => {
    //     console.log("itemList", itemList);

    //     setPlaylist(itemList);
    // }

    const handleSetPlaylist = useCallback(
        (itemList: playlistItem[]) => {
            console.log("itemList", itemList);

            setPlaylist(itemList);
        },
        [],
    )


    return (
        <>
            <Navbar playlist={playlist} handleSetPlaylist={handleSetPlaylist} />
            <VideoPlayers playlist={playlist} handleSetPlaylist={handleSetPlaylist} />
        </>
    )
}
