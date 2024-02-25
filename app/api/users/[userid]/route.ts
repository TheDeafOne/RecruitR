import Roles from "@/app/types/roles";
import { auth, firestore } from '@/firebase/server';
import { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";
import validateUser from "../../validateUser";


export async function GET(
    request: NextRequest,
    { params }: { params: { userid: string } }
) {
    // const whiteListedCoordinators = new Set(['coordinator@example.com'])
    // const whiteListedRecruiters = new Set(['recruiter@example.com'])
    try {
        if (!firestore)
            return new NextResponse("No Firestore", { status: 500 });

        const authToken =
            request.headers.get("authorization")?.split("Bearer ")[1] || undefined;

        let user: DecodedIdToken | null = await validateUser(authToken) ?? null;

        // validate that user requesting role type is requesting it for themselves
        const valid = user?.uid === params.userid;
        if (!valid) return new NextResponse("Unauthorized", { status: 401 });


        const userDocument = await firestore
            .collection("users")
            .doc(params.userid)
            .get();


        if (!userDocument.exists) {
            const whiteList = await firestore.collection("whitelist").get();
            const whiteListedCoordinators = new Set(whiteList.docs.map((doc) => doc.data().role == Roles.COORDINATOR ? doc.data().email : null).filter((email) => email));
            const whiteListedRecruiters = new Set(whiteList.docs.map((doc) => doc.data().role == Roles.RECRUITER ? doc.data().email : null).filter((email) => email));
            const role = whiteListedCoordinators.has(user!.email!) ? Roles.COORDINATOR : whiteListedRecruiters.has(user!.email!) ? Roles.RECRUITER : Roles.CANDIDATE;
            const customClaims = { role: role };
            await firestore.doc(`users/${user!.uid}`).create({
                role: role
            });
            await auth!.setCustomUserClaims(user!.uid, customClaims);
            return NextResponse.json({ role });
        }

        const userData = userDocument.data();

        return NextResponse.json(userData);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
