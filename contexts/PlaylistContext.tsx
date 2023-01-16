import { createContext, ReactNode, useContext, useState } from "react";

type playlistContextType = {
    playing?: playlistItem;
    setPlaying: (data?: playlistItem) => void;
    playlist: playlistItem[];
    setPlaylist: (data: playlistItem[]) => void;
    handleSetPlaylist: (playlist: playlistItem[]) => void;
}

export type playlistItem = {
    id: string;
    title: string;
    imgUrl: string;
}

const playlistContextDefaultValues: playlistContextType = {
    playing: undefined,
    setPlaying: async (data?: playlistItem) => null,
    playlist: [],
    setPlaylist: async (data: playlistItem[]) => null,
    handleSetPlaylist: (playlist: playlistItem[]) => null
}

const PlaylistContext = createContext<playlistContextType>(playlistContextDefaultValues)



type Props = {
    children: ReactNode;
};

export function PlaylistProvider({ children }: Props) {
    const [playing, setPlaying] = useState<playlistItem>();
    const [playlist, setPlaylist] = useState<playlistItem[]>([]);

    const handleSetPlaylist = (playlist: playlistItem[]) => {
        console.log("playlist", playlist);

        setPlaylist(playlist)
    }

    const value = {
        playing,
        setPlaying,
        playlist,
        setPlaylist,
        handleSetPlaylist,
    };

    return (
        <PlaylistContext.Provider value={
            {
                playing,
                setPlaying,
                playlist,
                setPlaylist,
                handleSetPlaylist,
            }
        }>
            {children}
        </PlaylistContext.Provider>
    );
}

export const usePlaylist = () => useContext(PlaylistContext);