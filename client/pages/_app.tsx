import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "@/components/store/store";
import { ProSidebarProvider } from "react-pro-sidebar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <ProSidebarProvider>
          <Component {...pageProps} />
        </ProSidebarProvider>
        <Toaster />
      </ChakraProvider>
    </Provider>
  );
}
