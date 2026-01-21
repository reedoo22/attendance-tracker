import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LoginProvider, useLogin } from "./contexts/LoginContext";
import Home from "./pages/Home";

function Router() {
  const { isLoggedIn, loginAsEmployee, loginAsAdmin } = useLogin();

  if (!isLoggedIn) {
    return (
      <Login
        onEmployeeLogin={loginAsEmployee}
        onAdminLogin={loginAsAdmin}
      />
    );
  }

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <LoginProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LoginProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
