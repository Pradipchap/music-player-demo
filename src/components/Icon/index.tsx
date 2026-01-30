import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from "@expo/vector-icons";
import { IconProps } from "@expo/vector-icons/build/createIconSet";

export default function CustomIcon({ name, color, size, style, ...rest }: IconProps<string>) {
  const defaultColor = color;
  const defaultSize = size || 24;

  switch (name) {
    case "Play":
      return <Feather name="play" {...rest} style={style} color={defaultColor} size={defaultSize} />;
    case "Pause":
      return <Feather name="pause" {...rest} style={style} color={defaultColor} size={defaultSize} />;
    case "Bookmark":
      return <FontAwesome name="bookmark-o" {...rest} style={style} color={defaultColor} size={defaultSize} />;
    case "Bookmarked":
      return <FontAwesome name="bookmark" {...rest} style={style} color={defaultColor} size={defaultSize} />;
    case "Notification":
      return <Ionicons name="notifications-outline" {...rest} style={style} color={defaultColor} size={defaultSize} />;
    case "Right":
      return <AntDesign name="right" {...rest} style={style} color={defaultColor} size={defaultSize} />;
    case "Left":
      return <AntDesign name="left" {...rest} style={style} color={defaultColor} size={defaultSize} />;
    case "SortReverse":
      return (
        <MaterialCommunityIcons name="sort-reverse-variant" {...rest} style={style} color={defaultColor} size={defaultSize} />
      );
    case "More":
      return <Ionicons name={"grid"} {...rest} style={style} color={defaultColor} size={defaultSize} />;
    case "ProgressClock":
      return <MaterialCommunityIcons name={"progress-clock"} {...rest} style={style} color={defaultColor} size={defaultSize} />;
    case "KeyDown":
      return <MaterialIcons name={"keyboard-arrow-down"} {...rest} style={style} color={defaultColor} size={defaultSize} />;
    case "LongRight":
      return <FontAwesome name={"long-arrow-right"} {...rest} style={style} color={defaultColor} size={defaultSize} />;
    case "Profile":
      return <FontAwesome5 name="user-alt" {...rest} style={style} color={defaultColor} size={defaultSize} />;
    case "Home":
      return <Entypo {...rest} style={style} name="home" color={defaultColor} size={defaultSize} />;
    case "Down":
      return <Entypo {...rest} style={style} name="chevron-thin-down" color={defaultColor} size={defaultSize} />;
    case "Up":
      return <Entypo {...rest} style={style} name="chevron-thin-up" color={defaultColor} size={defaultSize} />;
    case "ThreeDots":
      return <Entypo {...rest} style={style} name="dots-three-horizontal" color={defaultColor} size={defaultSize} />;
    case "Next":
      return <MaterialIcons {...rest} name="skip-next" size={defaultSize} color={defaultColor} style={style} />;
    case "Prev":
      return <MaterialIcons {...rest} name="skip-previous" size={defaultSize} color={defaultColor} style={style} />;
    case "Cross":
      return <AntDesign {...rest} name="close" size={defaultSize} color={defaultColor} style={style} />;
    case "Search":
      return <Feather {...rest} name="search" size={defaultSize} color={defaultColor} style={style} />;
    case "Music":
      return <Feather {...rest} name="music" size={defaultSize} color={defaultColor} style={style} />;
    case "Duration":
      return <Ionicons {...rest} name="timer-outline" size={defaultSize} color={defaultColor} style={style} />;
    case "Menu":
      return <Feather {...rest} name="menu" size={defaultSize} color={defaultColor} style={style} />;
    case "Sort":
      return <MaterialIcons {...rest} name="sort" size={defaultSize} color={defaultColor} style={style} />;
    case "PlayNext":
      return <Ionicons {...rest} name="play-skip-forward-outline" size={defaultSize} color={defaultColor} style={style} />;
    case "PlayBack":
      return <Ionicons {...rest} name="play-skip-back-outline" size={defaultSize} color={defaultColor} style={style} />;
    case "Plus":
      return <AntDesign {...rest} name="plus" size={defaultSize} color={defaultColor} style={style} />;
    case "Restart":
      return <MaterialIcons {...rest} name="restart-alt" size={defaultSize} color={defaultColor} style={style} />;
    case "Library":
      return <Ionicons {...rest} name="library-outline" size={defaultSize} color={defaultColor} style={style} />;
    case "Setting":
      return <Ionicons {...rest} name="settings-outline" size={defaultSize} color={defaultColor} style={style} />;
    case "Check":
      return <AntDesign {...rest} name="check" size={defaultSize} color={defaultColor} style={style} />;
    case "CheckCircle":
      return <AntDesign {...rest} name="check-circle" size={defaultSize} color={defaultColor} style={style} />;
    case "Filter":
      return <AntDesign {...rest} name="filter" size={defaultSize} color={defaultColor} style={style} />;
    default:
      return null;
  }
}
