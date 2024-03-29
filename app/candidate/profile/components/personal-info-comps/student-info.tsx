import {ClassName} from "postcss-selector-parser";
import {Student} from "@/app/recruit/home/data/student-schema";



export function StudentInfo({can_data}: {can_data: any}) {
    //console.log('can data info', can_data);
    return (
        <div className="grid flex-1 items-center h-full grid-cols-1 xl:grid-cols-2">
    
        <p>
            <span className="font-bold">
                Year:
            </span>&nbsp;
            <span>
            {can_data? 
                <>{can_data.year}</> :
                <span>Loading...</span>
            }

            </span>
        </p>
        <p>
            <span className="font-bold">
                Major:
            </span>&nbsp;
            <span>
            {can_data? 
                <>{can_data.major}</> :
                <span>Loading...</span>
            }
            </span>
        </p>
        <p>
            <span className="font-bold">
                University:
            </span>&nbsp;
            <span>
            {can_data? 
                <>{can_data.university}</> :
                <span>Loading...</span>
            }
            </span>
        </p>
        <p>
            <span className="font-bold">
                GPA:
            </span>&nbsp;
            <span>
            {can_data? 
                <>{can_data.gpa}</> :
                <span>Loading...</span>
            }
            </span>
        </p>
        <p>
            <span className="font-bold">
                Email:
            </span>&nbsp;
            <span>
            {can_data? 
                <>{can_data.email}</> :
                <span>Loading...</span>
            }
            </span>
        </p>
        </div>
    )
}