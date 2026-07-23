import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import TaskProvider from './context/TaskContext.jsx'
import BoardContextProvider from './context/BoardContext.jsx'
import ListContextProvider from './context/ListContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AttendanceProvider } from './context/AttendenceContext.jsx'
import LeadsProvider from './context/LeadsContext.jsx'
import ContactsProvider from './context/ContactsContext.jsx'
import DealsProvider from './context/DealsContext.jsx'
const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BoardContextProvider>
        <TaskProvider>
          <ListContextProvider>
            <AttendanceProvider>
              <LeadsProvider>
                <ContactsProvider>
                  <DealsProvider>
                    <BrowserRouter basename={import.meta.env.BASE_URL}>
                      <QueryClientProvider client={queryClient}>
                        <App />
                        <ToastContainer
                          position="top-right"
                          autoClose={3000}
                          hideProgressBar={false}
                          closeOnClick
                          pauseOnHover
                          draggable
                          theme="light"
                        />
                      </QueryClientProvider>
                    </BrowserRouter>
                  </DealsProvider>
                </ContactsProvider>
              </LeadsProvider>
            </AttendanceProvider>
          </ListContextProvider>
        </TaskProvider>
      </BoardContextProvider>
    </AuthProvider>

  </StrictMode>
)
