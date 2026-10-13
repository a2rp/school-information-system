import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading/index.jsx";

const Overview = lazy(() => import("./pages/overview/index.jsx"));
const Students = lazy(() => import("./pages/students/index.jsx"));
const Attendance = lazy(() => import("./pages/attendance/index.jsx"));
const Classes = lazy(() => import("./pages/classes/index.jsx"));
const Fees = lazy(() => import("./pages/fees/index.jsx"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppRoutes = ({ pageProps }) => (
  <>
    <ScrollToTop />
    <Suspense fallback={<div className="route-loading"><Loading /></div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview {...pageProps.overview} />} />
        <Route path="/students" element={<Students {...pageProps.students} />} />
        <Route path="/attendance" element={<Attendance {...pageProps.attendance} />} />
        <Route path="/classes" element={<Classes {...pageProps.classes} />} />
        <Route path="/fees" element={<Fees {...pageProps.fees} />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </Suspense>
  </>
);

export default AppRoutes;
