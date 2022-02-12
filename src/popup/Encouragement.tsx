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
            }
        ],
    },
    koga_default: {
        name: "Koga",
        portrait: "../assets/koga.jpg",
        phrases: [
            {
                text: "You again? When will you ever learn?"
            }
        ],
    }
};