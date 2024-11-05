import { useEffect } from "react";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    console.log({user});

    const checkUserStatusAndRedirect = async () => {
        console.log(user._id);
        const userStatus = await fetch(
        `http://localhost:3000/user-assessment/status`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            userid: user.user._id,
            },
        }
        );
        console.log({userStatus})

        const status = await userStatus.json();
        console.log({status});

        if (status.attemptNumber === 0 || (!status.isComplete && status.attemptNumber === 1)) {
            navigate("/new-user-assessment");
        }
    };

    useEffect(() => {
        checkUserStatusAndRedirect();
    }, [])

    return (
        <div>Dashboard</div>
    )
}

export default Dashboard