// server/studentController.js
class Students {
    static count = 0;
    static studentsArray = [];
  
    constructor(id, name, email, pass) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.pass = pass;
      this.team = 0; // default team value
      Students.count++;
    }
  
    static addStudent(id, name, email, pass) {
      const student = new Students(id, name, email, pass);
      Students.studentsArray.push(student);
      return student;
    }
  
    static getStudents() {
      return Students.studentsArray;
    }
  
    static getCount() {
      return Students.count;
    }
  }
  
  module.exports = Students;