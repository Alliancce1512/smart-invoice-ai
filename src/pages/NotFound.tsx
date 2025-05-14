
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-smartinvoice-purple mb-6">404</h1>
          <p className="text-xl text-gray-700 mb-8">Oops! We couldn't find the page you're looking for</p>
          <Link to="/">
            <Button className="bg-smartinvoice-purple hover:bg-smartinvoice-purple-dark">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
