"use client";
import { useEffect, useRef } from "react";

const GlowCard = ({ children, identifier }) => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const CONTAINER = containerRef.current;
    const CARD = cardRef.current;

    if (!CONTAINER || !CARD) return;

    const CONFIG = {
      proximity: 40,
      spread: 80,
      blur: 12,
      gap: 32,
      vertical: false,
      opacity: 0,
    };

    const UPDATE = (event) => {
      const CARD_BOUNDS = CARD.getBoundingClientRect();

      // Check if pointer is near the card
      if (
        event?.x > CARD_BOUNDS.left - CONFIG.proximity &&
        event?.x < CARD_BOUNDS.left + CARD_BOUNDS.width + CONFIG.proximity &&
        event?.y > CARD_BOUNDS.top - CONFIG.proximity &&
        event?.y < CARD_BOUNDS.top + CARD_BOUNDS.height + CONFIG.proximity
      ) {
        CARD.style.setProperty("--active", "1");
      } else {
        CARD.style.setProperty("--active", CONFIG.opacity.toString());
      }

      // Calculate angle for gradient effect
      const CARD_CENTER = [
        CARD_BOUNDS.left + CARD_BOUNDS.width * 0.5,
        CARD_BOUNDS.top + CARD_BOUNDS.height * 0.5,
      ];

      let ANGLE =
        (Math.atan2(event?.y - CARD_CENTER[1], event?.x - CARD_CENTER[0]) *
          180) /
        Math.PI;

      ANGLE = ANGLE < 0 ? ANGLE + 360 : ANGLE;
      CARD.style.setProperty("--start", (ANGLE + 90).toString());
    };

    // Initialize styles
    const RESTYLE = () => {
      CONTAINER.style.setProperty("--gap", `${CONFIG.gap}px`);
      CONTAINER.style.setProperty("--blur", `${CONFIG.blur}px`);
      CONTAINER.style.setProperty("--spread", `${CONFIG.spread}px`);
      CONTAINER.style.setProperty(
        "--direction",
        CONFIG.vertical ? "column" : "row"
      );
    };

    RESTYLE();
    window.addEventListener("pointermove", UPDATE);

    return () => {
      window.removeEventListener("pointermove", UPDATE);
    };
  }, [identifier]);

  return (
    <div
      ref={containerRef}
      className={`glow-container-${identifier} glow-container`}
      style={{
        "--gap": "32px",
        "--blur": "12px",
        "--spread": "80px",
        "--direction": "row",
      }}
    >
      <article
        ref={cardRef}
        className={`glow-card glow-card-${identifier}`}
        style={{
          "--active": "0",
          "--start": "120deg",
        }}
      >
        <div className="glows"></div>
        {children}
      </article>
    </div>
  );
};

export default GlowCard;
