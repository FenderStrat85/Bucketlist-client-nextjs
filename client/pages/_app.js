import "../styles/globals.css";
import { SessionProvider, signIn, useSession } from "next-auth/react";

import { useRouter } from "next/router";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import React from "react";
const client = new ApolloClient({
  uri: "http//localhost:4000",
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider>
        {/* {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : ( */}
        <Component {...pageProps} />
      </SessionProvider>
    </ApolloProvider>
  );
}

function Auth({ children }) {
  const { data: session, status } = useSession();

  const isLoggedIn = !!session?.user;
  React.useEffect(() => {
    if (status === "loading") return;
    if (!isLoggedIn) signIn();
  }, [isLoggedIn, status]);

  if (isLoggedIn) {
    return children;
  }
}

export default MyApp;
