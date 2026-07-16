import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdminRegister() {

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [error,setError] = useState("");



  const handleRegister = async(e)=>{

    e.preventDefault();
    setError("");

    try{

      await API.post("/auth/register",{
        name,
        email,
        password,
        role:"ADMIN"
      });


      alert("Admin Account Created Successfully");

      navigate("/admin/login");


    }catch(err){

      console.log(err);
      setError("Admin registration failed");

    }

  };



const styles={

container:{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"linear-gradient(135deg,#1e293b,#0f172a)",
fontFamily:"Segoe UI, sans-serif"
},


card:{
background:"rgba(255,255,255,0.15)",
backdropFilter:"blur(12px)",
padding:"45px 35px",
borderRadius:"18px",
width:"380px",
boxShadow:"0 15px 40px rgba(0,0,0,0.2)",
display:"flex",
flexDirection:"column",
gap:"18px"
},


title:{
fontSize:"30px",
fontWeight:"600",
textAlign:"center",
color:"white",
display:"flex",
justifyContent:"center",
gap:"10px"
},


label:{
fontSize:"14px",
color:"white",
fontWeight:"500"
},


input:{
width:"100%",
padding:"14px",
borderRadius:"12px",
border:"1px solid rgba(255,255,255,0.4)",
outline:"none",
fontSize:"14px",
background:"rgba(255,255,255,0.95)",
boxSizing:"border-box"
},


inputWrapper:{
position:"relative"
},


eye:{
position:"absolute",
right:"15px",
top:"14px",
cursor:"pointer",
color:"#444"
},


button:{
marginTop:"10px",
padding:"13px",
borderRadius:"10px",
border:"none",
background:"linear-gradient(90deg,#f59e0b,#d97706)",
color:"white",
fontSize:"16px",
fontWeight:"600",
cursor:"pointer"
},


link:{
textAlign:"center",
color:"white",
cursor:"pointer",
textDecoration:"underline",
fontSize:"14px"
},


error:{
color:"#fee2e2",
background:"rgba(239,68,68,.3)",
padding:"10px",
borderRadius:"8px",
textAlign:"center"
}

};



return(

<div style={styles.container}>


<form style={styles.card} onSubmit={handleRegister}>


<div style={styles.title}>
<span>🔐</span>
Create Admin Account
</div>


{error && 
<div style={styles.error}>
{error}
</div>
}



<label style={styles.label}>
Admin Name
</label>

<input
style={styles.input}
placeholder="Enter admin name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>



<label style={styles.label}>
Admin Email
</label>

<input
type="email"
style={styles.input}
placeholder="Enter admin email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>



<label style={styles.label}>
Password
</label>


<div style={styles.inputWrapper}>

<input
type={showPassword?"text":"password"}
style={styles.input}
placeholder="Create password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>


<span
style={styles.eye}
onClick={()=>setShowPassword(!showPassword)}
>

{
showPassword?
<FaEyeSlash/>:
<FaEye/>
}

</span>


</div>



<button style={styles.button}>
Create Admin Account
</button>



<div 
style={styles.link}
onClick={()=>navigate("/admin/login")}
>
Already have admin account? Login
</div>



<div 
style={styles.link}
onClick={()=>navigate("/")}
>
← Back to User Login
</div>


</form>


</div>

)

}

export default AdminRegister;