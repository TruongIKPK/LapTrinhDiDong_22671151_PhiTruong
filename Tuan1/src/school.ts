// 30. Create a class School with list of Students and Teachers. Add method to display info.

import { Student } from "./student";
import { Teacher } from "./teacher";

export class School {
    private students: Student[] = [];
    private teachers: Teacher[] = [];
    
    addStudent(student: Student) {
        this.students.push(student);
    }
    
    addTeacher(teacher: Teacher) {
        this.teachers.push(teacher);
    }
    
    displayInfo() {
        console.log("Students:");
        this.students.forEach(student => student.display());
        console.log("Teachers:");
        this.teachers.forEach(teacher => teacher.display());
    }
}