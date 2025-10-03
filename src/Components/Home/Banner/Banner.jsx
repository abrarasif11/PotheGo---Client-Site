import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import banner1 from "../../../assets/assests/banner (1).jpg";
import banner2 from "../../../assets/assests/banner (2).jpg";
import banner3 from "../../../assets/assests/banner (3).jpg";
const Banner = () => {
  return (
    <div className="mt-20 mb-20">
      <Carousel infiniteLoop={true} autoPlay={true} showThumbs={false}>
        <div>
          <img src={banner1} />
        </div>
        <div>
          <img src={banner2} />
        </div>
        <div>
          <img src={banner3} />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
