import Svg, { Path } from "react-native-svg";

export default function CloseIcon({
  size,
  color,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={size || "100%"}
      height={size || "100%"}
      viewBox="0 0 24 24"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
    >
      <Path
        d="M3.662,18.365L18.365,3.662C18.905,3.122 19.781,3.122 20.321,3.662L20.338,3.679C20.878,4.219 20.878,5.095 20.338,5.635L5.635,20.338C5.095,20.878 4.219,20.878 3.679,20.338L3.662,20.321C3.122,19.781 3.122,18.905 3.662,18.365Z"
        fill={color || "white"}
      />
      <Path
        d="M5.635,3.662L20.338,18.365C20.878,18.905 20.878,19.781 20.338,20.321L20.321,20.338C19.781,20.878 18.905,20.878 18.365,20.338L3.662,5.635C3.122,5.095 3.122,4.219 3.662,3.679L3.679,3.662C4.219,3.122 5.095,3.122 5.635,3.662Z"
        fill={color || "white"}
      />
    </Svg>
  );
}
