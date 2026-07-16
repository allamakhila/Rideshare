import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminRegister() {

  const navigate = useNavigate();

  const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:""
  });

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });
  };


  const handleRegister=async()=>{

    try{

      await API.post("/auth/register",{
        name:formData.name,
        email:formData.email,
        password:formData.password,
        role:"ADMIN"
      });


      alert("Admin Account Created Successfully");

      navigate("/admin/login");


    }catch(error){

      console.log(error);
      alert("Admin Registration Failed");

    }

  };


return(

<div style={{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#0f172a"
}}>


<div style={{
background:"white",
padding:"40px",
borderRadius:"15px",
width:"350px"
}}>


<h2>Create Admin Account</h2>


<input
placeholder="Admin Name"
name="name"
value={formData.name}
onChange={handleChange}
/>


<br/><br/>


<input
placeholder="Admin Email"
name="email"
value={formData.email}
onChange={handleChange}
/>


<br/><br/>


<input
placeholder="Password"
type="password"
name="password"
value={formData.password}
onChange={handleChange}
/>


<br/><br/>


<button onClick={handleRegister}>
Create Admin
</button>


</div>

</div>

)

}


export default AdminRegister;