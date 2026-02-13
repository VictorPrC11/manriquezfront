import { useState } from "react"
import noImage from "../assets/noImage.png"
interface imageProps {
    src?: string,
    alt?: string,
    className?: string,
    width?: number,
    height?: number
}
const ImageComponent = ({ src, alt, className, width, height, }: imageProps) => {
    const [error, setError] = useState(false);
    return <img style={{marginBottom:"10px"}} src={error ? noImage : src} alt={alt} className={className} width={width} height={height} onError={() => setError(true)} />
    


}

export default ImageComponent;