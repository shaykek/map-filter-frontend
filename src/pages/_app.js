import { ApolloProvider } from "@apollo/client/react";
import { client } from "@/api/apollo";
import { GlobalDataProvider } from "@/store/global-context";
import { SelectedLocationProvider } from "@/store/location-context";
import "tailwindcss/tailwind.css";
// import "../styles/globals.css";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
});

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <GlobalDataProvider>
        <SelectedLocationProvider>
          <div className={`${montserrat.variable} font-mont`}>
            <Component {...pageProps} />
          </div>
        </SelectedLocationProvider>
      </GlobalDataProvider>
    </ApolloProvider>
  );
}
