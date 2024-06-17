import { PreviewData } from "next";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <div className="container">
      <div className="main">
        <div className="img">
          <img src="owner.png" alt="" />
        </div>
        <h1>Hey {username}</h1>
        <h3>Your verification code is {otp}</h3>
        <h1 className="code" >{otp}</h1>
      </div>
    </div>
  )
}