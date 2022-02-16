// type EncouragementConfig = {
//     character_id: {
//         name: string,
//         portrait: string,
//         phrases: [
//             {
//                 text: string,
//             }
//         ],
//     };
// }

export const Encouragement = {
    /**
     * Character_id : {
     *     "name": "<character's name>"
     *     "portrait": "<character's portrait>"
     *     "phrases": []
     * }
     */
    alice_default: {
        name: "Alice",
        portrait: "../assets/alice.jpg",
        phrases: [
            {
                text: "Good work! Now, remember to take a break!"
            },
            {
                text: "Wow, we sure showed those clankers, didn't we?"
            },
            {
                text: "Whew! Break time!"
            },
            {
                text: "Hiya, Whadaya think they'll serve for desert?"
            },
            {
                text: "Let's take a short break? We've need to stay alert!"
            },
        ],
    },
    koga_default: {
        name: "Koga",
        portrait: "../assets/koga.jpg",
        phrases: [
            {
                text: "You again? When will you ever learn?"
            },
            {
                text: "Huh. Passable work, I guess..."
            },
            {
                text: "Oi, you need to take a break."
            },
            {
                text: "You. Were you even focussing?"
            },
            {
                text: "Don't let your guard down now. We've got a long way to go."
            },
            {
                text: "Take Five, we must recuperate while we can."
            },
        ],
    }
};