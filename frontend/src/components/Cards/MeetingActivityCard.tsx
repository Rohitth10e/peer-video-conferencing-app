import api from "../../api/api.ts";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import { fetchMeeting } from "../../features/meeting/meetingSlice.ts";

function MeetingActivityCard(){

    const dispatch = useDispatch();
    const meeting = useSelector((state)=> state.meeting);

    useEffect(() => {
        dispatch(fetchMeeting());
    }, [dispatch]);

    const status = meeting.status;

    return(
        <>
            {status === "ended"? (
                <div>
                    <div className="flex justify-center items-center">
                        <p>Past Meetings</p>
                        <button>View all</button>
                    </div>
                </div>
            ): (
                <div>
                    <div className="flex justify-center items-center">
                        <p>Recent Activity</p>
                        <button>Schedule</button>
                    </div>
                </div>
            )
            }
        </>
    );
}

export default MeetingActivityCard;