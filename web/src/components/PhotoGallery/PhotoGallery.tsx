import Lightbox, {SlotStyles} from "yet-another-react-lightbox";
import {useState} from "react";
import {Captions, Fullscreen, Thumbnails, Zoom} from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

export default function PhotoGallery() {
    const [index, setIndex] = useState<string | undefined>(undefined);
    return (
        <>
            <Lightbox
                styles={{container: {slide: {captionSide: "bottom"}}} as SlotStyles}
                slides={[]}
                open={index !== undefined}
                index={0}
                close={() => setIndex(undefined)}
                // enable optional lightbox plugins
                plugins={[Fullscreen, Captions, Thumbnails, Zoom]}
            />
        </>
    );
}