'use client'
import {Button} from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {EventsListCard} from "@/app/recruiter/events/components/events-list-card";
import {RecruiterEvent} from "@/app/recruiter/events/data/events-schema";
import {EventCreationDialog} from "@/app/recruiter/events/components/event-creation-dialog";


export default function ClientComponent({events} : {events: any}) {
    return (
        <div className="flex flex-col gap-4 p-4 ">
            <div className="">
                <EventCreationDialog />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="">
                    <EventsListCard title="Past Events" events={events}/>
                </div>
                <div className="">
                    <EventsListCard title="Current Events" events={events}/>
                </div>
            </div>
        </div>

    )
}