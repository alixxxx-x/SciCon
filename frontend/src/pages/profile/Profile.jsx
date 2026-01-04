export default function Profile() {
  // this to get user data from localstorage
  const userName = localStorage.getItem("user_name") || "User";
  const userEmail = localStorage.getItem("user_email") || "No email saved";
  
  return (
    <div style={{padding: "40px", color: "black"}}>
      <h1>👤 User Profile</h1>
      
      <div style={{ background: "#f8f9fa",  padding: "30px",  borderRadius: "10px", marginBottom: "20px"}}>
        <h3>Your Account Information</h3>
        <p><strong>Username:</strong> {userName}</p>
        <p><strong>Email:</strong> {userEmail}</p>
        <p><strong>Account Status:</strong> Active</p>
        <p><strong>Member since:</strong> {new Date().toLocaleDateString()}</p>
      </div>
      
     
    
    </div>
  );
}