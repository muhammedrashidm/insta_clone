import React from 'react'
import faker from 'faker'
import { useState, useEffect } from 'react'

function Suggestions() {
    const [suggestions, setSuggestions] = useState()

    useEffect(() => {

        const suggestionsa = [...Array(20)].map((_, i) => ({
            ...faker.helpers.contextualCard(),
            id: i,

        }))

        setSuggestions(suggestionsa)

    }, []);
    console.log(suggestions)
    return (
        <div className="mt-4 ml-10  ">
            <div className="flex justify-between text-sm mb-5">
                <h3 className="text-sm font-bold">Suggestions</h3>
                <button className="text-gray-600">See All</button>
            </div>
            {/* {suggestions.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between mt-3 ml-10">
                    <img className="w-10 h-10 object-cover rounded-full border p-[2px] " src={profile.avatar} />

                    <div className="flex-1 ml-4">

                        <h2 className="font-semi-bold">{profile.name}</h2>
                        <h3 className="truncate text-xs text-gray-400"> {profile.company.name}</h3>






                    </div>
                    <button className="text-blue-400 text-xs font-bold">Follow</button>
                </div>
            ))} */}
        </div>
    )
}

export default Suggestions
