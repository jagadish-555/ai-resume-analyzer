import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/AuthProvider.jsx"
import { InterviewProvider } from "./features/interview/InterviewProvider.jsx"
import ErrorBoundary from "./components/ErrorBoundary"

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
