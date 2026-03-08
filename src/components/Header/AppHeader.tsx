import ThemeToggleButton from "../Buttons/ThemeToggleButton";
import AppSidebarTrigger from "./AppSidebarTrigger";
import AvatarMenu from "./AvatarMenu";

const AppHeader = () => {
  return (
    <header className="flex items-center justify-between border-b p-4 shadow">
      <AppSidebarTrigger />

      <nav className="flex items-center gap-4">
        <AvatarMenu />

        <ThemeToggleButton />
      </nav>
    </header>
  );
};

export default AppHeader;
