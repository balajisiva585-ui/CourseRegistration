const app = document.getElementById("app");
let token = localStorage.getItem("token");
let me = JSON.parse(localStorage.getItem("me") || "null");

async function api(url, options={}) {
  options.headers = {...options.headers, "Content-Type":"application/json"};
  if(token) options.headers.Authorization = `Bearer ${token}`;
  const r = await fetch(url, options);
  const data = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(data.message || "Request failed");
  return data;
}

function loginPage(msg="") {
  app.innerHTML = `<div class="login"><div class="login-card">
    <h1>🎓 Course Registration</h1>
    <p class="muted">Smart Academic Planning System</p>
    ${msg?`<div class="msg error">${msg}</div>`:""}
    <input id="email" placeholder="Email" value="student@example.com">
    <input id="password" type="password" placeholder="Password" value="Student@123">
    <button class="primary" style="width:100%" onclick="login()">Login</button>
    <p class="muted">Student: student@example.com / Student@123</p>
    <p class="muted">Admin: admin@example.com / Admin@123</p>
  </div></div>`;
}
async function login(){
  try{
    const data=await api("/api/auth/login",{method:"POST",body:JSON.stringify({email:email.value,password:password.value})});
    token=data.token; me=data.user; localStorage.setItem("token",token);localStorage.setItem("me",JSON.stringify(me)); render();
  }catch(e){loginPage(e.message)}
}
function logout(){localStorage.clear();token=null;me=null;loginPage()}
function shell(content){
  app.innerHTML=`<div class="app"><header class="top"><strong>🎓 Smart Course Registration</strong><span>${me.name} (${me.role}) <button onclick="logout()" class="danger">Logout</button></span></header>
  <div class="layout"><aside>
    <button onclick="dashboard()">📊 Dashboard</button>
    ${me.role==="student"?`<button onclick="courses()">📚 Browse Courses</button><button onclick="myCourses()">✅ My Courses</button><button onclick="timetable()">🗓 Timetable</button>`:""}
    ${me.role==="admin"?`<button onclick="courses()">📚 Courses</button><button onclick="adminRegs()">📝 Registrations</button>`:""}
  </aside><main class="main">${content}</main></div></div>`;
}
async function dashboard(){
  if(me.role==="admin"){
    const s=await api("/api/admin/stats");
    shell(`<h1>Admin Dashboard</h1><div class="cards">
      <div class="card"><h3>Students</h3><b>${s.students}</b></div><div class="card"><h3>Faculty</h3><b>${s.faculty}</b></div>
      <div class="card"><h3>Courses</h3><b>${s.courses}</b></div><div class="card"><h3>Registrations</h3><b>${s.registrations}</b></div></div>
      <div class="section"><h2>System Overview</h2><p class="muted">Manage courses and monitor student registrations from the sidebar.</p></div>`);
  } else {
    const rows=await api("/api/registrations/my");
    const active=rows.filter(r=>r.status==="Registered");
    const credits=active.reduce((s,r)=>s+(r.course?.credits||0),0);
    shell(`<h1>Welcome, ${me.name}</h1><div class="cards">
      <div class="card"><h3>Student ID</h3><b>${me.studentId||"-"}</b></div><div class="card"><h3>Semester</h3><b>${me.semester||"-"}</b></div>
      <div class="card"><h3>Registered Courses</h3><b>${active.length}</b></div><div class="card"><h3>Current Credits</h3><b>${credits}</b></div></div>
      <div class="section"><h2>Academic Planning</h2><p class="muted">Browse courses to check prerequisites, seats, credit limits and timetable conflicts before registering.</p></div>`);
  }
}
async function courses(){
  const rows=await api("/api/courses");
  shell(`<h1>Courses</h1><div class="toolbar"><input id="search" placeholder="Search course..." oninput="filterCourses()"></div><div id="courseGrid" class="grid"></div>`);
  window.courseRows=rows; drawCourses(rows);
}
function drawCourses(rows){
  document.getElementById("courseGrid").innerHTML=rows.map(c=>`<div class="course">
    <span class="badge">${c.courseCode}</span><span class="badge">${c.credits} Credits</span>
    <h3>${c.courseName}</h3><p class="muted">${c.description||""}</p>
    <p><b>Department:</b> ${c.department}</p><p><b>Faculty:</b> ${c.faculty}</p>
    <p><b>Seats:</b> ${c.enrolled}/${c.capacity} (${Math.max(0,c.capacity-c.enrolled)} available)</p>
    <p><b>Schedule:</b> ${c.schedule?.day} ${c.schedule?.startTime}-${c.schedule?.endTime}</p>
    ${me.role==="student"?`<button class="primary" onclick="registerCourse('${c._id}')">Register</button>`:""}
    ${me.role==="admin"?`<button class="danger" onclick="deleteCourse('${c._id}')">Delete</button>`:""}
  </div>`).join("");
}
function filterCourses(){const q=document.getElementById("search").value.toLowerCase();drawCourses(window.courseRows.filter(c=>(c.courseName+c.courseCode+c.department).toLowerCase().includes(q)))}
async function registerCourse(id){
  try{const d=await api("/api/registrations",{method:"POST",body:JSON.stringify({courseId:id})});alert(d.message);myCourses()}catch(e){alert(e.message)}
}
async function myCourses(){
  const rows=await api("/api/registrations/my");
  shell(`<h1>My Courses</h1><div class="table-wrap"><table class="table"><tr><th>Code</th><th>Course</th><th>Credits</th><th>Schedule</th><th>Status</th><th>Action</th></tr>
  ${rows.map(r=>`<tr><td>${r.course?.courseCode}</td><td>${r.course?.courseName}</td><td>${r.course?.credits}</td><td>${r.course?.schedule?.day} ${r.course?.schedule?.startTime}-${r.course?.schedule?.endTime}</td><td>${r.status}</td><td>${r.status==="Registered"?`<button class="danger" onclick="dropCourse('${r._id}')">Drop</button>`:"-"}</td></tr>`).join("")}</table></div>`);
}
async function dropCourse(id){if(!confirm("Drop this course?"))return;try{alert((await api("/api/registrations/"+id,{method:"DELETE"})).message);myCourses()}catch(e){alert(e.message)}}
async function timetable(){
  const rows=(await api("/api/registrations/my")).filter(r=>r.status==="Registered");
  shell(`<h1>My Timetable</h1><div class="grid">${rows.map(r=>`<div class="card"><h3>${r.course.courseName}</h3><p><b>${r.course.schedule.day}</b></p><p>${r.course.schedule.startTime} - ${r.course.schedule.endTime}</p><p>Room: ${r.course.schedule.room}</p></div>`).join("")||"<p>No registered courses.</p>"}</div>`);
}
async function adminRegs(){
  const rows=await api("/api/admin/registrations");
  shell(`<h1>Registration Management</h1><div class="table-wrap"><table class="table"><tr><th>Student</th><th>ID</th><th>Course</th><th>Status</th><th>Date</th></tr>
  ${rows.map(r=>`<tr><td>${r.student?.name}</td><td>${r.student?.studentId||"-"}</td><td>${r.course?.courseCode} - ${r.course?.courseName}</td><td>${r.status}</td><td>${new Date(r.createdAt).toLocaleString()}</td></tr>`).join("")}</table></div>`);
}
async function deleteCourse(id){if(!confirm("Delete course?"))return;try{alert((await api("/api/courses/"+id,{method:"DELETE"})).message);courses()}catch(e){alert(e.message)}}
function render(){if(!token)return loginPage();dashboard()}
render();
