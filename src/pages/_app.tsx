import "../styles/globals.css";

import { Center, ChakraProvider, Link, Spinner, Text } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { Link1Icon } from "@radix-ui/react-icons";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import type { AppProps } from "next/app";
import NextLink from "next/link";
import React from "react";

import { trpc } from "@/lib/trpc";
import { NextPageWithAuth } from "@/lib/types";

type AppPropsWithAuth = AppProps & {
  Component: NextPageWithAuth;
};

function MyApp({ Component, pageProps }: AppPropsWithAuth) {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider>
        {Component.auth ? (
          <Auth
            {...(typeof Component.auth === "object"
              ? { can: Component.auth.can }
              : {})}
          >
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </ChakraProvider>
    </SessionProvider>
  );
}

type AuthProps = {
  children: React.ReactNode;
  can?: Role[];
};

function Auth(props: AuthProps) {
  const { t } = useTranslation("common");
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  if (status === "loading")
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (!isUser) {
    signIn();
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (!props.can) return <>{props.children}</>;
  if (props.can.includes(session.user.role)) return <>{props.children}</>;

  return (
    <Center>
      <Text mr="2">{t("no_permission")}</Text>

      <NextLink href={{ pathname: "/" }} passHref legacyBehavior>
        <Link color="blue.500" display="flex" alignItems="center" gap="1">
          <Link1Icon />
          {t("back_to_home")}
        </Link>
      </NextLink>
    </Center>
  );
}

export default trpc.withTRPC(MyApp);
