import React from "react";
import { Loading } from "../components/Loading";
import { pinData } from "../context/pinContext";
import PinCard from "../components/PinCard";

const Home = () => {
    const { pins, loading } = pinData();
    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
                            {pins && pins.length > 0 ? (
                                pins.map((e, i) => <PinCard key={i} pin={e}/>)
                            ) : (
                                <p>No Pins Yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;