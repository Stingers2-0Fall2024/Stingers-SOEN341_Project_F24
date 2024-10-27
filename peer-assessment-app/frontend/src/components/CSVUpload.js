import React, { useState } from 'react';

const port = process.env.PORT || 5001;

const CSVUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:'+port+'/api/students/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log(data.message);
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" onChange={handleFileChange} accept=".csv" />
      <button type="submit">Upload CSV</button>
    </form>
  );
};

export default CSVUpload;
