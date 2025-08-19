import './App.css'

function App() {

  return (
    <div className="profile-container">
      <div className="profile-card">
      <img
        src="https://res.cloudinary.com/dfcnz3uuh/image/upload/v1753369654/users/na8i6s7o5sd2qw4x0ch9.jpg"
        alt="Profile"
        style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
      />

        <h2>Đặng Đăng Duy</h2>
        <p><b>MSSV:</b> 22110295</p>
        <p><b>Ngày sinh:</b> 04/12/2004</p>
        <p><b>Trường:</b> Đại học Sư Phạm Kỹ Thuật TPHCM</p>
        <p><b>Chuyên ngành:</b> Công Nghệ Thông Tin</p>
        <p><b>Năm học:</b> Năm 4</p>
      </div>
    </div>
  )
}

export default App
