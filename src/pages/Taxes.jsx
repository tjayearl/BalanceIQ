import React, { useState } from "react";
import "./Taxes.css";

const Taxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    dueDate: "",
    status: "Unpaid",
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    if(editIndex !== null) {
      const updatedTaxes = [...taxes];
      updatedTaxes[editIndex] = formData;
      setTaxes(updatedTaxes);
      setEditIndex(null);
    } else {
      setTaxes([...taxes, formData]);
    }
    setFormData({ type:"", amount:"", dueDate:"", status:"Unpaid" });
  }

  const handleEdit = (index) => setFormData(taxes[index]) || setEditIndex(index);

  const handleDelete = (index) => setTaxes(taxes.filter((_,i)=>i!==index));

  return (
    <div className="taxes-container">
      <h2>Taxes</h2>
      <form className="taxes-form" onSubmit={handleSubmit}>
        <input type="text" name="type" placeholder="Tax Type" value={formData.type} onChange={handleChange} required/>
        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required/>
        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required/>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
        </select>
        <button type="submit">{editIndex !== null ? "Update Tax" : "Add Tax"}</button>
      </form>

      <div className="total-taxes">
        Total Taxes: ${taxes.reduce((sum,t)=>sum+Number(t.amount),0)}
      </div>

      <table className="taxes-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxes.map((tax,index)=>(
            <tr key={index}>
              <td>{tax.type}</td>
              <td>${tax.amount}</td>
              <td>{tax.dueDate}</td>
              <td>{tax.status}</td>
              <td>
                <button onClick={()=>handleEdit(index)}>Edit</button>
                <button onClick={()=>handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
          {taxes.length===0 && <tr><td colSpan="5">No taxes added yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default Taxes;