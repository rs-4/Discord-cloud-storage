'use client'
import Providers from "../../../components/layout/provider";
import Sidebar from "../../../components/layout/sidebar";
import Header from "../../../components/layout/header";
import { Provider } from "react-redux";
import { store, persistor } from "../../app/redux/store/dataStore";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner"
import { ScrollArea } from "../../../components/ui/scroll-area";
import  ThemeProvider  from "../../../components/theme/themeProvider"

export default function RootLayout({ children }: { children: React.ReactNode}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
        <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <ScrollArea className="w-full">
        <main className="w-full pt-16">{children}</main>
        </ScrollArea>
      </div>
                </PersistGate>
        </Provider>
        <Toaster richColors />
        </body>
      </html>
    </>
  );
}
