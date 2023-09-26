import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import sendRequest from "../../../utilities/send-request";
import TitleBar from "../../../components/TitleBar/TitleBar";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
    
export default function PerformPasswordResetPage() {
    let query = useQuery();
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        setToken(query.get('token'));
    }, [query]);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          setMessage('Passwords do not match.');
          return;
        }
        try{
            const response = await sendRequest('/api/users/perform-password-reset', "PUT", {token: token, newPassword: password});
            if(response){
                setMessage("Password reset successfully.");
            }
        }catch(err){
            setMessage(err.message);
        }
    }

    return (
        <>
          <TitleBar title={"Set A New Password"}></TitleBar>
          <form onSubmit={handlePasswordReset}>
            <label>
              New Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Confirm New Password:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit">Reset Password</button>
          </form>
          {message && <p>{message}</p>}
        </>
      );

}