'use server'

import addData from "@/app/api/addData";
import getData from "@/app/api/getData.ts";
import { studentSchema } from "@/app/recruit/home/data/student-schema";

import * as z from 'zod';
export async function addCandidateData(student_id: string, value: object) {
    // ...
    // let obj = JSON.parse(value);
    // obj.Time = Timestamp.fromDate(new Date(obj.Time))
    console.log("being called")
    console.log("pushed")
    console.log(student_id)
    console.log(value)

    return await addData("users", student_id, value)
    // console.log("IT WORKED")
    // console.log(res)
}

export async function get_candidate_data(student_id: string) {
    console.log(student_id);
    const student = await getData({collection_name: "users", document_id: student_id})
    console.log(student)
    return studentSchema.parse(student);

}