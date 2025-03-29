"use client";
import { isValidEmail } from "@/utils/check-email";
import emailjs from "emailjs-com";
import { useState, useEffect } from "react";
import { TbMailForward } from "react-icons/tb";
import { toast } from "react-toastify";

// Helper function to get email counts from localStorage
const getEmailCounts = () => {
  if (typeof window !== "undefined") {
    const counts = localStorage.getItem("emailCounts");
    return counts ? JSON.parse(counts) : {};
  }
  return {};
};

// Helper function to save email counts to localStorage
const saveEmailCounts = (counts) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("emailCounts", JSON.stringify(counts));
  }
};

function ContactForm() {
  const [error, setError] = useState({
    email: false,
    required: false,
    limitReached: false,
  });
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [emailCounts, setEmailCounts] = useState({});

  // Load email counts on component mount
  useEffect(() => {
    setEmailCounts(getEmailCounts());
  }, []);

  const checkRequired = () => {
    if (userInput.email && userInput.message && userInput.name) {
      setError({ ...error, required: false });
    }
  };

  const handleSendMail = async (e) => {
    e.preventDefault();

    if (!userInput.email || !userInput.message || !userInput.name) {
      setError({ ...error, required: true });
      return;
    } else if (error.email) {
      return;
    } else {
      setError({ ...error, required: false });
    }

    // Check email sending limit
    const currentCount = emailCounts[userInput.email] || 0;
    if (currentCount >= 2) {
      setError({ ...error, limitReached: true });
      toast.error("You've reached the maximum of 2 messages.");
      return;
    }

    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    const templateParams = {
      from_email: userInput.email,
      from_name: userInput.name,
      message: userInput.message,
    };

    try {
      const res = await emailjs.send(
        serviceID,
        templateID,
        templateParams,
        publicKey
      );

      if (res.status === 200) {
        // Update email count
        const newCount = currentCount + 1;
        const updatedCounts = {
          ...emailCounts,
          [userInput.email]: newCount,
        };
        setEmailCounts(updatedCounts);
        saveEmailCounts(updatedCounts);

        toast.success("Message sent successfully!");
        setUserInput({
          name: "",
          email: "",
          message: "",
        });
        setError({ ...error, limitReached: false });
      } else {
        toast.error("Failed to send message via Email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(error?.text || error.message || "An error occurred");
    }
  };

  return (
    <div className="">
      <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
        Contact with me
      </p>
      <div className="max-w-3xl text-white rounded-lg border border-[#464c6a] p-3 lg:p-5">
        <p className="text-sm text-[#d3d8e8]">
          {
            "If you have any questions or concerns, please don't hesitate to contact me. I am open to any work opportunities that align with my skills and interests."
          }
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-base">Your Name: </label>
            <input
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              type="text"
              maxLength="100"
              required={true}
              name="name"
              onChange={(e) =>
                setUserInput({ ...userInput, name: e.target.value })
              }
              onBlur={checkRequired}
              value={userInput.name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Your Email: </label>
            <input
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              type="email"
              maxLength="100"
              required={true}
              name="email"
              value={userInput.email}
              onChange={(e) => {
                setUserInput({ ...userInput, email: e.target.value });
                // Reset limit error when email changes
                if (error.limitReached) {
                  setError({ ...error, limitReached: false });
                }
              }}
              onBlur={() => {
                checkRequired();
                setError({ ...error, email: !isValidEmail(userInput.email) });
              }}
            />
            {error.email && (
              <p className="text-sm text-red-400">
                Please provide a valid email!
              </p>
            )}
            {error.limitReached && (
              <p className="text-sm text-red-400">
                You can only send 2 messages from this email address.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Your Message: </label>
            <textarea
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              maxLength="500"
              name="message"
              required={true}
              onChange={(e) =>
                setUserInput({ ...userInput, message: e.target.value })
              }
              onBlur={checkRequired}
              rows="4"
              value={userInput.message}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            {error.required && (
              <p className="text-sm text-red-400">
                Email and Message are required!
              </p>
            )}
            <button
              className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-5 md:px-12 py-2.5 md:py-3 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
              role="button"
              onClick={handleSendMail}
              disabled={error.limitReached}
            >
              <span>Send Message</span>
              <TbMailForward className="mt-1" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
