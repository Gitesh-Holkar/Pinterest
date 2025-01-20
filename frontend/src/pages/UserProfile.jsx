import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PinCard from "../components/PinCard";
import { UserData } from "../context/userContext";
import { pinData } from "../context/pinContext";

const UserProfile = ({ user: loggedInUser }) => {
  const params = useParams();
  const [user, setUser] = useState([]);

  async function fetchUser() {
    try {
      const { data } = await axios.get(`/api/user/${params.id}`);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  const [isFollow, setIsFollow] = useState(false);

  const { followUser } = UserData();

  const followHander = () => {
    setIsFollow(!isFollow);
    followUser(user._id, fetchUser);
  };

  const followers = user.followers;
  

  useEffect(() => {
    if (followers && followers.includes(loggedInUser._id)) setIsFollow(true);
  }, [user]);

  const { pins } = pinData();

  let userPins;

  if (pins) {
    userPins = pins.filter((pin) => pin.owner === user._id);
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      {user && (
        <div className="flex flex-col items-center justify-center">
          <div className="p-6 w-full">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                {user.name && ( //check is user name exists then slice will performed, that's why we used this otherwise it shows error
                  <span className="text-3xl text-gray-700">
                    {user.name.slice(0, 1)}
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-center text-2xl font-bold mt-4">{user.name}</h1>
            <p className="text-center text-gray-600 mt-2">{user.email}</p>
            <p className="flex justify-center items-center text-center gap-3 text-gray-600 mt-2">
              {user.followers && <span>{user.followers.length} followers</span>}
              {user.followings && <span>{user.followings.length} followings</span>}
            </p>
            {user && user._id === loggedInUser._id ? (
              ""
            ) : (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={followHander}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  {isFollow ? "Unfollow" : " Follow"}
                </button>
              </div>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {userPins && userPins.length > 0 ? (
                userPins.map((e) => <PinCard key={e._id} pin={e} />)
              ) : (
                <p>No Pin Yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;