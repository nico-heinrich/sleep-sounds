import IconBase from "./IconBase";

export default function StopIcon({
  mini = false,
  color = "white",
}: {
  mini?: boolean;
  color?: string;
}) {
  return (
    <IconBase
      paths={[
        "M19.259,7.63L19.259,16.37C19.259,17.934 17.989,19.205 16.424,19.205L7.685,19.205C6.12,19.205 4.85,17.934 4.85,16.37L4.85,7.63C4.85,6.066 6.12,4.795 7.685,4.795L16.424,4.795C17.989,4.795 19.259,6.066 19.259,7.63Z",
      ]}
      mini={mini}
      color={color}
    />
  );
}
