import { playlistItem } from "@/contexts/PlaylistContext";
import Image from "next/image";
import { useEffect, useState } from "react";

export type Props = {
    playlist: playlistItem[];
    handleSetPlaylist: (data: playlistItem[]) => void;
}

const Navbar = ({ playlist, handleSetPlaylist }: Props) => {



    useEffect(() => {
        console.log('playlist', playlist); console.log('playlist', playlist);
    }, [playlist])



    const [item, setItem] = useState<playlistItem | undefined>();
    const [search, setSearch] = useState('');

    const KEY = "AIzaSyBaRLJ1y3S9wKpnRfXhHOMVRAfyLHo4XjQ"


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
        }
        setSearch('');
        setItem(undefined);
    }

    return (
        <>
            <nav className='w-full flex items-center flex-wrap bg-black p-3 h-12 text-white'>
                <div className="flex flex-row w-full">
                    <div className="basis-9/12 text-right">
                        <input className="w-1/2 rounded-sm bg-zinc-800 text-white p-0.5" type="text" placeholder="Enter YouTube URL here" value={search} onChange={handleInputSearch} />
                        {item ?
                            <div className="relative w-max p-2 top-2 left-2/4 bg-zinc-500">
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
                    <div className="basis-1/4"></div>
                </div>
            </nav>
            {playlist.map(m => {
                <div style={{ color: 'red' }}>test</div>
            })

            }
        </>
    )
}

export default Navbar;