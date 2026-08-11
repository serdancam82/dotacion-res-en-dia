const styles = {

  container:{
    background:"#ffffff",
    borderRadius:"16px",
    padding:"25px",
    boxShadow:"0 8px 25px rgba(0,0,0,0.08)",
    border:"1px solid #e5e7eb",
    marginBottom:"25px",
  },

  title:{
    margin:"0 0 20px",
    fontSize:"24px",
    fontWeight:"700",
    color:"#1f2937",
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
    gap:"15px",
    marginBottom:"20px",
  },

  input:{
    padding:"12px",
    border:"1px solid #d1d5db",
    borderRadius:"10px",
    fontSize:"15px",
    outline:"none",
  },

  select:{
    padding:"12px",
    border:"1px solid #d1d5db",
    borderRadius:"10px",
    fontSize:"15px",
    outline:"none",
  },

  actions:{
    display:"flex",
    gap:"10px",
  },

  saveButton:{
    background:"#2563eb",
    color:"#fff",
    border:"none",
    borderRadius:"10px",
    padding:"12px 22px",
    cursor:"pointer",
    fontWeight:"600",
  },

  cancelButton:{
    background:"#ef4444",
    color:"#fff",
    border:"none",
    borderRadius:"10px",
    padding:"12px 22px",
    cursor:"pointer",
    fontWeight:"600",
  },

};

export default styles;