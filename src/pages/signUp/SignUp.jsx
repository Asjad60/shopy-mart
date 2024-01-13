import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate, Link } from "react-router-dom";
import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setSignupData } from "../../slices/authSlice";
import { sendOtp } from "../../services/operations/authApi";
import { ACCOUNT_TYPE } from "../../utils/constants";

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { SUPPLIER, VISITOR } = ACCOUNT_TYPE;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signupData = {
      name,
      email,
      password,
      accountType: accountType ? SUPPLIER : VISITOR,
    };

    dispatch(setSignupData(signupData));

    dispatch(sendOtp(email, navigate));

    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div className="signup-body">
        <form className="signup-page" onSubmit={handleSubmit}>
          <div className=" w-full">
            <h1 className="CreateAccount">Create Account</h1>
          </div>
          <div className="accountType max-w-max">
            {/* <label
              className={`${
                accountType === ACCOUNT_TYPE.VISITOR
                  ? "highlightBtn"
                  : "lowLightBtn"
              } btns`}
              onClick={() => setAccountType(ACCOUNT_TYPE.VISITOR)}
            >
              Visitor
            </label>
            <label
              className={`${
                accountType === ACCOUNT_TYPE.SUPPLIER
                  ? "highlightBtn"
                  : "lowLightBtn"
              } btns`}
              onClick={() => setAccountType(ACCOUNT_TYPE.SUPPLIER)}
            >
              Supplier
            </label> */}
            <p className="text-lg font-medium text-gray-400">Become a Supplier</p>
            <div className="supplierBox">
              <input
                type="checkbox"
                id="isSupplier"
                checked={accountType}
                onChange={(e) => setAccountType(e.target.checked)}
              />
              <label
                className={`${
                  accountType ? "highlightBtn" : "lowLightBtn"
                } btns`}
                htmlFor="isSupplier"
              >
                Supplier
              </label>
            </div>
          </div>
          <div className="input-boxes">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="input-boxes">
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-boxes">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <span
              className="eyebtn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
            </span>
          </div>
          <div className="signup-btn">
            <button>Create</button>
          </div>

          <div className="span-signup">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </>
  );
}
