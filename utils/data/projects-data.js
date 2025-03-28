import bugbee from "@/public/image/bugbee.png";
import stackbuddy from "@/public/image/stackbuddy.png";

// const bugbee =
//   "https://res.cloudinary.com/vanshstorage/image/upload/v1743168689/Screenshot_2025-03-26_203555_oa2wa1.png";
// const stackbuddy =
//   "https://res.cloudinary.com/vanshstorage/image/upload/v1743168690/Screenshot_2025-03-26_224114_mfi0fa.png";

export const projectsData = [
  {
    id: 1,
    name: "BugBee",
    description: [
      "Co-developing a developer-focused Q&A forum where users can track their questions answers, and engagement and can be shared externally as a link with clients or stakeholders.",
      "Integrated AI-powered automatic tagging for improved question categorization",
      "Tech-Stack: Reactjs, Nodejs, Tailwind, Redux, Prisma",
    ],
    code: "https://github.com/Vansh16aug/BugBee.git",
    demo: "https://bugbee.vercel.app/",
    image: bugbee,
  },
  {
    id: 2,
    name: "StackBuddy:",
    description: [
      "Built a Tinder-like platform for developers to connect based on interests,from debugging to personal discussions.",
      "Enforced swipe-based matching and real-time chat functionality for seamless interaction.",
      "Developed APIs to form a smooth interface between database and the platform.",
      "Tech-Stack: Reactjs, Redux, MongoDB, Nodejs, Tailwind.",
    ],
    code: "https://github.com/RahulGupta77/Sorting-Visualizer",
    demo: "https://stackbuddy.projectwork.tech/",
    image: stackbuddy,
  },
];
