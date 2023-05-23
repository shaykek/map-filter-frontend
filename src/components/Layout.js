import Head from "next/head";
import Popup from "./Popup";
import { LoadScript } from "@react-google-maps/api";
import { useGlobalData } from "@/store/global-context";
import parse from "html-react-parser";

const LIBRARIES = ["places", "geometry"];

const Layout = ({ children, className, seo }) => {
  const { language } = useGlobalData();
  const headHTML = parse(seo.fullHead, "text/html");

  if (!language) return;
  return (
    <LoadScript
      id="script-loader"
      libraries={LIBRARIES}
      language={language}
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
    >
      <Head>
        <title>{seo.title}</title>
        {headHTML}
      </Head>
      <Popup />

      <main className={`${className ? className : ""} h-[100svh] `}>
        {children}
      </main>
    </LoadScript>
  );
};

export default Layout;
