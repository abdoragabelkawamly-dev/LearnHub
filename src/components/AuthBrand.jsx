import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import "./AuthBrand.css";

const AuthBrand = () => (
  <Link to="/" className="auth-brand" aria-label="LearnHub home">
    <span className="auth-brand__mark">
      <GraduationCap className="auth-brand__icon" />
    </span>
    <span className="auth-brand__name">LearnHub</span>
  </Link>
);

export default AuthBrand;
