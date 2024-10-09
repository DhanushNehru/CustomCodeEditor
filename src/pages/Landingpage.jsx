import React, { useEffect, useState } from "react";
import "../components/css/Landingpage.css";
import axios from "axios";
import { useContext } from "react";
import { SocketContext } from "../context/socket";
import Header from '../components/Header'
import GoogleSignIn from "../components/GoogleSignIn";
import { useAuth } from "../context/AuthContext";

const CreatePopUp = ({ setTogglePopUp, setRooms, rooms }) => {
    const { socket } = useContext(SocketContext);
    const [roomName, setRoomName] = useState('');



    const handleFormSubmit = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND}/api/room/createroom`, { roomName });
            console.log(res.data);
            if (res.data) {
                setRooms((prev) => [res.data.newRoom, ...prev])
                setTogglePopUp(false);
            }
        } catch (err) {
            console.log(err);

        }
    }
    return (
        <div style={{ "position": "absolute", "bottom": "30vh", "left": "25vw", "width": "50vw", "height": "25vh", "backgroundColor": "#d2b48c", "paddingLeft": "1rem", "border": "2px solid white", "borderRadius": "1rem" }} className="popup">
            <div className="popup-content" style={{ "display": "flex", "flexDirection": "column" }}>
                <h2 style={{ "margin": '1rem 0' }}>Create Room</h2>
                <input style={{ "padding": "0.4rem 1rem", "outline": "none", "width": "75%", "margin": "0.2rem 0rem" }} value={roomName} type="text" placeholder="Room Name" onChange={(e) => setRoomName(e.target.value)} />
                <div>
                    <button style={{ "width": "fit-content", "padding": "0.5rem 1rem", "marginRight": "1rem" }} onClick={handleFormSubmit}>Create</button>
                    <button style={{ "width": "fit-content", "padding": "0.5rem 1rem", "marginBottom": "1rem" }} onClick={() => setTogglePopUp(prev => !prev)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
function Landingpage() {
    const [rooms, setRooms] = useState();
    const [togglePopUp, setTogglePopUp] = useState(false);
    const { currentUser } = useAuth();

    useEffect(() => {
        const getAllRooms = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/room/allrooms`);
                console.log(res.data.rooms);
                setRooms(res.data.rooms);
            } catch (err) {
                console.log(err);
            }
        }
        getAllRooms();
    }, [])

    const handleJoinRoom = async (room) => {

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND}/api/room/joinroom/`, { roomId: room._id });
            if (res.data) {
                window.location.href = `/editor/${res.data.room._id}`
            }
        } catch (err) {
            console.log(err);
        }
    }

    const renderUnauthenticatedContent = () => (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                flexDirection: "column",
            }}
        >
            <h2>Please sign in to use the Code Editor</h2>
            <GoogleSignIn />
        </div>
    );

    return (
        <>
            <Header />
            {currentUser ?
                <>
             <div className="app-container" style={{ position: "relative", opacity: togglePopUp ? 0.4 : 1 }}>


                <div style={{ "display": "flex", "marginTop": "5rem" }}>

                    <div className="create-room-container">
                        <h2>Wanna Create a room?</h2>
                        <button className="create-btn" onClick={() => setTogglePopUp(prev => !prev)}>Create</button>
                    </div>

                    <div className="available-rooms-container">
                        <h2>List of available rooms</h2>
                        {rooms && rooms.map((room, index) => (
                            <div className="room-block" key={index}>
                                <p style={{ "padding": "0rem", "margin": "0.3rem 0rem" }}>Room Name: {room.roomName}</p>
                                <button className="join-btn" onClick={() => handleJoinRoom(room)}>Join Room</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
                {togglePopUp ? <CreatePopUp setTogglePopUp={setTogglePopUp} setRooms={setRooms} rooms={rooms} /> : ""}
                </>

: renderUnauthenticatedContent()  }

        </>
    );
}

export default Landingpage;
