import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

function UserDetailsCard({ userDets }: any) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">Contact User</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogDescription>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">Email:</h3>
                                <p className="text-gray-600">{userDets.email}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Mobile Number:</h3>
                                <p className="text-gray-600">{userDets.phone ? userDets.phone : "NA"}</p>
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export default UserDetailsCard