import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg"

interface Props {
  size?: number
}

export default function Logo({ size = 32 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="ff-bg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#3b82f6" />
          <Stop offset="100%" stopColor="#1d4ed8" />
        </LinearGradient>
      </Defs>
      <Rect width="100" height="100" rx="24" fill="url(#ff-bg)" />
      <Rect
        x="22"
        y="28"
        width="56"
        height="44"
        rx="8"
        fill="white"
        fillOpacity={0.35}
        transform="rotate(-12 50 50)"
      />
      <Rect
        x="22"
        y="28"
        width="56"
        height="44"
        rx="8"
        fill="white"
        transform="rotate(8 50 50)"
      />
    </Svg>
  )
}
