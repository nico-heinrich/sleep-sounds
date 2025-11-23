import Svg, { Path } from "react-native-svg";

export default function StopIcon({
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
        d="M20.812,6.656L20.812,17.344C20.812,19.258 19.258,20.812 17.344,20.812L6.656,20.812C4.742,20.812 3.188,19.258 3.188,17.344L3.188,6.656C3.188,4.742 4.742,3.188 6.656,3.188L17.344,3.188C19.258,3.188 20.812,4.742 20.812,6.656Z"
        fill={color || "white"}
      />
    </Svg>
  );
}
