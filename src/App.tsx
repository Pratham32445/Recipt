import Recipt from "./components/Recipt";
import Search from "./components/Search";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./components/theme-provider";
import { Button } from "./components/ui/button";

const App = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="pb-5">
      <div className="flex justify-end p-5">
        <Button
          onClick={() =>
            setTheme(theme == "light" ? "dark" : "light")
          }
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>
      <Search />
      <Recipt />
    </div>
  );
};

export default App;
