import { useState, useEffect } from "react";

export function LazyBackgroundImage(props) {
  const { src, style } = props;
  const [source, setSource] = useState("preload.jpg");

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setSource(src);
  }, [src]);

  return <div {...props} style={{ backgroundImage: `url(${source})`, ...style }}></div>;
}
