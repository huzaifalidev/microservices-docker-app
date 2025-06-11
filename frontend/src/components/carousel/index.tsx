import React from "react";
import { Carousel } from "antd";
import type { CarouselProps } from "antd";

type GlobalCarouselProps = {
  items: React.ReactNode[];
  autoplay?: boolean;
  height?: string;
  width?: string;
  showArrows?: boolean;
};

const GlobalCarousel: React.FC<GlobalCarouselProps> = ({
  items,
  autoplay = false,
  height = "400px", // Default height
  width = "100%", // Default width
  showArrows = true, // Show arrows by default
}) => {
  const contentStyle: React.CSSProperties = {
    height,
    color: "#fff",
    lineHeight: height,
    textAlign: "center",
    background: "#000000",
    fontSize: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={{ width, margin: "0 auto" }}>
      <Carousel
        autoplay={autoplay}
        arrows={showArrows}
        dots={true}
        style={{ width, height }}
      >
        {items.map((item, index) => (
          <div key={index}>
            <div style={contentStyle}>{item}</div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default GlobalCarousel;
