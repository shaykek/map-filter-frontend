import { client } from "../api/apollo";
import { lazy, Suspense } from "react";

import { gql } from "@apollo/client";
import { useGlobalData } from "@/store/global-context";
import Layout from "@/components/Layout";

const LazyAutoComplete = lazy(() => import("@/components/AutoComplete"));

const GET_PAGE = gql`
  query {
    pageBy(uri: "/home") {
      seo {
        fullHead
        title
      }
    }
  }
`;

export default function Home({ page }) {
  const { textColor } = useGlobalData();
  const { seo } = page;

  return (
    <Layout
      seo={seo}
      className="bg-slate-400 dark:bg-dark min-h-screen flex items-center justify-center"
    >
      <div
        style={{ color: textColor }}
        className="w-1/3 text-center md:w-full md:p-4"
      >
        <h1 className="text-4xl font-bold mb-8">The WWW Corp</h1>
        <div className="font-semibold text-2xl mb-2">Enter Your Location</div>
        <Suspense fallback={<div>Loading...</div>}>
          <LazyAutoComplete />
        </Suspense>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const response = await client.query({
    query: GET_PAGE,
  });

  const page = response?.data?.pageBy;

  return {
    props: {
      page,
    },
  };
}
