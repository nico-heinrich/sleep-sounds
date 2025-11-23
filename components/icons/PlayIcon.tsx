import Svg, { Path } from "react-native-svg";

export default function PlayIcon({
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
        d="M20.625,10.284C21.165,10.689 21.483,11.325 21.483,12C21.483,12.675 21.165,13.311 20.625,13.716C17.598,15.987 12.236,20.008 8.722,22.644C8.072,23.131 7.202,23.209 6.475,22.846C5.749,22.483 5.29,21.74 5.29,20.927C5.29,16.008 5.29,7.992 5.29,3.073C5.29,2.26 5.749,1.517 6.475,1.154C7.202,0.791 8.072,0.869 8.722,1.356C12.236,3.992 17.598,8.013 20.625,10.284Z"
        fill={color || "white"}
      />
    </Svg>
  );
}
