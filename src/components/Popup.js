import { getTimeObject } from "@/api/helpers";
import { useGlobalData } from "@/store/global-context";
import { useEffect, useState } from "react";

const Popup = () => {
  const { enableClosingHours, fromHour, toHour, closedPopup } = useGlobalData();
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    if (enableClosingHours) {
      const currentTime = new Date();
      const fromTime = getTimeObject(fromHour);
      const toTime = getTimeObject(toHour);

      const isBetweenTimes = currentTime >= fromTime && currentTime <= toTime;

      // Set the showPopup state based on the time condition
      setShowPopup(isBetweenTimes);
    }
  }, []);

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30">
          <div className="bg-white w-[50%] max-w-full p-6 text-center rounded-lg shadow-md animate-fade-in">
            <h2 className=" font-bold text-2xl mb-2">{closedPopup.title}</h2>
            <p className="text-xl">{closedPopup.content}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
