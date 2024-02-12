"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
//import {set} from "yaml/dist/schema/yaml-1.1/set";
import { PossiblePlacement } from "@/app/student/profile/components/possible-placement";
import { cn as c } from "@/lib/utils";
import { EditButton } from "./edit-button";
import { ResumeButton } from "./resume-file";
import { StudentInfo } from "./student-info";

export function FeedbackCard() {
    const languages: Array<String> = ["Python", "Java", "Kotlin", "R", "Angular", ".NET", "Canva", "Adobe Photoshop", "Agile Philosophy", "Power BI", "Azure DevOps", "Waterfall Methodologies"]

    useEffect(() => { console.log(`RAHHH`) })

    return (
        <>
            <Card className="min-h-full ">
                <CardHeader className="flex flex-row items-center divide-x border-b mb-4">
                    <div className="flex flex-1 items-center space-x-4 pr-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="/avatars/01.png" alt="Avatar" />
                            <AvatarFallback className="text-3xl">JM</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-4xl">
                                Joe Mama
                            </CardTitle>
                            <CardDescription className="text-md">
                                Exercise Science Major
                            </CardDescription>

                        </div>
                    </div>
                    <div className="flex items-end space-x-4 pr-2">
                        <EditButton></EditButton>
                    </div>
                    <div className={c("hidden flex-1", "xl:flex")}>
                        something was here
                    </div>
                </CardHeader>
                <CardContent className={c("flex flex-col flex-wrap", "xl:grid xl:grid-cols-2 xl:gap-x-4")}>
                    {/*    Initial feedback */}
                    <div className="flex flex-col gap-6">
                        <div className={c("flex", "xl:hidden")}>
                        </div>
                        <div>
                            <p className="font-bold text-lg">
                                Personal Info
                            </p>
                            <StudentInfo func={c}></StudentInfo>
                        </div>
                        <PossiblePlacement />
                        {/* <div className="space-y-1">
                            <p className="font-bold text-lg">
                                Skills
                            </p>
                            {<ShowSkills/>}
                            
                        </div> */}
                        <div className="space-y-1 ">
                            <p className="font-bold text-lg col-start-2">
                                Resume
                            </p>
                        </div>
                        <div className="pt-0.01">
                            <ResumeButton />
                        </div>
                    </div>

                </CardContent>

            </Card>

        </>

    )
}