import { minidenticon } from "minidenticons";
import { useMemo } from "react";

interface MinidenticonImgProps {
  username: string;
  saturation: number;
  lightness?: number;
  [key: string]: any;
}

export const MinidenticonImg: React.FC<MinidenticonImgProps> = ({
  username,
  saturation,
  lightness,
  ...props
}) => {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness]
  );
  return <img src={svgURI} alt={username} {...props} />;
};
