import LiMenuItem from "./LiMenuItem";
import Autocomplete from "./AutoComplete";
import { useGlobalData } from "@/store/global-context";

const Sidebar = ({ branches, onItemClick, selectedMarker }) => {
  const { textColor } = useGlobalData();
  return (
    <div
      className="bg-white w-[20%] px-4 py-32 flex flex-col  md:w-full md:py-4 xl:w-[35%] "
      style={{ color: textColor }}
    >
      <h1 className="mb-4 text-2xl text-center font-bold">The WWW Corp</h1>
      <Autocomplete />
      <div className="my-4 font-semibold text-xs">
        Found: {branches.length} results
      </div>
      <div className=" max-h-[400px] overflow-scroll pr-3 md:h-[200px]">
        <ul>
          {branches &&
            branches.map((marker, i) => (
              <LiMenuItem
                id={i}
                marker={marker}
                key={marker.title}
                selectedMarker={selectedMarker}
                onClick={() => onItemClick(marker)}
              />
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
