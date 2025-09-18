import { Routes, Route, BrowserRouter  } from "react-router-dom"
import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost"


function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
      <Route path="create-post" element={<CreatePost />} />
      
        
      
    </Routes>
    </BrowserRouter>
  )
}

export default App
