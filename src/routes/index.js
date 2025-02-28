import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

function RouterConfig() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPages />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/vents" element={<VentFeed />} />
          <Route path="/matches" element={<MatchPage />} />
          <Route path="/chat/:chatId" element={<ChatInterface />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}