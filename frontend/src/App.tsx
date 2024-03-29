import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { ScoketPorvider } from "./Context/SocketWrapper";
import Chat from "./pages/Chat";
import { ThemeProvider } from "./components/Theme-Provider";
import { inject } from "@vercel/analytics";
import { Toaster } from "react-hot-toast";

function App() {
  inject();
  return (
    <BrowserRouter>
      <ScoketPorvider>
        <ThemeProvider defaultTheme="dark">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </ScoketPorvider>
    </BrowserRouter>
  );
}

export default App;
